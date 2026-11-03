// DevTools Hub — native macOS shell
// Serves the Next.js static export (bundled at Contents/Resources/app) under
// a custom app:// origin via WKURLSchemeHandler, so client-side routing,
// RSC payload fetches and localStorage persistence all behave like a real site.

import Cocoa
import SwiftUI
import WebKit

// MARK: - Scheme handler

private let scheme = "app"
private let host = "local"

final class AppSchemeHandler: NSObject, WKURLSchemeHandler {
  private let root: URL
  // Weak table of in-flight tasks;WKURLSchemeTask is not Hashable-safe to
  // retain strongly — tasks that were stopped must never receive callbacks.
  private let activeTasks = NSHashTable<AnyObject>.weakObjects()

  init(root: URL) {
    self.root = root
  }

  func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
    activeTasks.add(task)
    let request = task.request
    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      guard let self else { return }
      let resolved = Self.resolve(request: request, root: self.root)
      DispatchQueue.main.async { [weak self] in
        guard let self, self.activeTasks.contains(task) else { return }
        self.activeTasks.remove(task)
        switch resolved {
        case .success((let fileURL, let mime)):
          guard
            let data = try? Data(contentsOf: fileURL, options: .mappedIfSafe),
            let url = request.url
          else {
            task.didFailWithError(
              CocoaError(.fileReadNoSuchFile))
            return
          }
          let response = HTTPURLResponse(
            url: url,
            statusCode: 200,
            httpVersion: "HTTP/1.1",
            headerFields: [
              "Content-Type": mime,
              "Cache-Control": "no-cache",
            ]
          )!
          task.didReceive(response)
          task.didReceive(data)
          task.didFinish()
        case .failure:
          task.didFailWithError(CocoaError(.fileReadNoSuchFile))
        }
      }
    }
  }

  func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
    activeTasks.remove(urlSchemeTask)
  }

  // MARK: path resolution

  private static func resolve(request: URLRequest, root: URL)
    -> Result<(URL, String), Error>
  {
    guard
      let url = request.url,
      url.scheme == scheme,
      url.host == host
    else { return .failure(CocoaError(.fileReadNoSuchFile)) }

    // Percent-decoded, rootless path: "/json-formatter/" -> "json-formatter/"
    let sub = url.path.drop { $0 == "/" }
    var subStr = String(sub)
    if subStr.isEmpty || subStr.hasSuffix("/") {
      subStr += "index.html"
    }

    // 1) Direct file (static assets, RSC payloads such as /route.txt)
    let direct = root.appendingPathComponent(subStr)
    if isSafe(file: direct, root: root) {
      return .success((direct, mime(for: direct.pathExtension)))
    }

    // 2) App Router RSC fetches are made as "<path>.txt?_rsc=..." but the
    //    export also stores directory payloads as "<path>.txt".
    let payload = root.appendingPathComponent(subStr + ".txt")
    if isSafe(file: payload, root: root) {
      return .success((payload, "text/plain; charset=utf-8"))
    }

    // 3) SPA fallback — let the client router render its own 404.
    let fallback = root.appendingPathComponent("index.html")
    if isSafe(file: fallback, root: root) {
      return .success((fallback, "text/html"))
    }
    return .failure(CocoaError(.fileReadNoSuchFile))
  }

  private static func isSafe(file: URL, root: URL) -> Bool {
    let standardized = file.standardizedFileURL.path
    guard standardized.hasPrefix(root.standardizedFileURL.path) else {
      return false
    }
    var isDir: ObjCBool = false
    return FileManager.default.fileExists(atPath: standardized, isDirectory: &isDir)
      && !isDir.boolValue
  }

  private static func mime(for ext: String) -> String {
    switch ext.lowercased() {
    case "html": return "text/html; charset=utf-8"
    case "css": return "text/css; charset=utf-8"
    case "js", "mjs": return "text/javascript; charset=utf-8"
    case "json", "map", "webmanifest": return "application/json"
    case "txt": return "text/plain; charset=utf-8"
    case "svg": return "image/svg+xml"
    case "png": return "image/png"
    case "jpg", "jpeg": return "image/jpeg"
    case "ico": return "image/x-icon"
    case "woff": return "font/woff"
    case "woff2": return "font/woff2"
    case "avif": return "image/avif"
    case "webp": return "image/webp"
    case "wasm": return "application/wasm"
    default: return "application/octet-stream"
    }
  }
}

// MARK: - Web view

struct ToolWebView: NSViewRepresentable {
  final class Coordinator {
    var titleObserver: NSKeyValueObservation?
  }

  func makeCoordinator() -> Coordinator { Coordinator() }

  func makeNSView(context: Context) -> WKWebView {
    let config = WKWebViewConfiguration()
    let appRoot = Bundle.main.resourceURL!.appendingPathComponent(
      "app", isDirectory: true)
    config.setURLSchemeHandler(
      AppSchemeHandler(root: appRoot), forURLScheme: scheme)

    let web = WKWebView(frame: .zero, configuration: config)
    web.autoresizingMask = [.width, .height]
    web.allowsBackForwardNavigationGestures = true
    web.underPageBackgroundColor = .windowBackgroundColor

    // Mirror the page <title> (per-tool metadata) into the window title.
    context.coordinator.titleObserver = web.observe(
      \.title, options: [.initial, .new]
    ) { view, _ in
      let title = view.title ?? ""
      DispatchQueue.main.async {
        NSApp.windows.forEach { window in
          if window.isKeyWindow { window.title = title.isEmpty ? "DevTools Hub" : title }
        }
      }
    }

    web.load(URLRequest(url: URL(string: "\(scheme)://\(host)/")!))
    return web
  }

  func updateNSView(_ nsView: WKWebView, context: Context) {}
}

// MARK: - App

@main
struct DevToolsHubApp: App {
  var body: some Scene {
    WindowGroup("DevTools Hub") {
      ToolWebView()
        .frame(minWidth: 960, minHeight: 640)
        .ignoresSafeArea(.container, edges: .top)
    }
    .windowStyle(.hiddenTitleBar)
    .defaultSize(width: 1200, height: 800)
  }
}
