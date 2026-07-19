import "@/App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChatFAB from "@/components/AIChatFAB";
import CurrentAffairsFAB from "@/components/CurrentAffairsFAB";
import About from "@/pages/About";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Search from "@/pages/Search";
import ClassDetail from "@/pages/ClassDetail";
import Chapter from "@/pages/Chapter";

function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]"><Outlet /></main>
      <Footer />
      <AIChatFAB />
      <CurrentAffairsFAB />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/class/:classId" element={<ClassDetail />} />
            <Route path="/chapter/:chapterId" element={<Chapter />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
  
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
