import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        <Header />
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}
