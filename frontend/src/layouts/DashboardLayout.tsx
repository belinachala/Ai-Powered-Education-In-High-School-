import React, { useState, useEffect } from "react";

interface DashboardLayoutProps {
  Sidebar: React.FC<SidebarProps>;
  Header: React.FC<any>;
  children: React.ReactNode;
}

export interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  isMobile: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ Sidebar, Header, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} isMobile={isMobile} />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen && !isMobile ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header */}
        <Header />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
