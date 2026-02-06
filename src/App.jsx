import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Ideas from "./pages/Ideas";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

// Layout Wrapper to handle page-specific scrolling
function AppLayout({ children }) {
  const location = useLocation();
  const isMessagesPage = location.pathname === "/messages";

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] selection:bg-blue-500/30">
      <Navbar />
      
      {/* Messages page ke liye hum scroll block kar dete hain (h-[calc(100vh-navbarHeight)])
        taki click karne par page upar-niche jump na kare.
      */}
      <main className={`flex-1 ${isMessagesPage ? "h-[calc(100vh-70px)] overflow-hidden" : ""}`}>
        {children}
      </main>

      {/* Messages page par footer hide karna better UX hai (Sweden/Industrial style) */}
      {!isMessagesPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Ideas />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}