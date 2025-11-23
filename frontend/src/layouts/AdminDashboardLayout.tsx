import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  Sidebar: React.ComponentType;
  Header: React.ComponentType;
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<DashboardLayoutProps> = ({
  Sidebar,
  Header,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Hamburger for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition-all duration-200"
          >
            <Menu size={24} />
          </button>

          {/* Header Component */}
          <div className="flex-1 text-center md:text-left text-white font-semibold">
            <Header />
          </div>
        </div>
      </header>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 fixed top-0 left-0 h-full z-30 bg-white border-r border-gray-200 shadow-md">
        <Sidebar />
      </aside>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Sidebar Slide-in */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white z-50 shadow-xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-blue-500">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-white hover:text-yellow-300"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "blur-sm md:blur-0" : ""
        } md:ml-64 mt-16 p-4 md:p-6 overflow-y-auto`}
      >
        <div className="max-w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
