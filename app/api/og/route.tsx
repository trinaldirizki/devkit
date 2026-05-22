import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "DevTools Hub";
  const description =
    searchParams.get("description") ??
    "Free, fast, client-side developer tools";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              maxWidth: 800,
              textAlign: "center",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
