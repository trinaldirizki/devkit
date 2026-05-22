import { Nav } from "@/components/layout/nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Nav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-surface p-4 md:p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
