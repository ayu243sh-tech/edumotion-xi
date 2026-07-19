import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, LayoutDashboard } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FAF9F6]/80 border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
          <div className="w-9 h-9 rounded-xl bg-[#7B1E1E] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#F5B400]" strokeWidth={2} />
          </div>
          <div className="leading-none">
            <div className="font-display font-bold text-xl text-[#292524]">
              Edu<span className="text-[#7B1E1E]">Motion</span>
              <span className="ml-1 text-xs font-mono-em text-[#78716C]">XI</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#78716C] font-mono-em mt-0.5">Learn Smart. Score Better.</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink to="/" end className={({isActive}) => isActive ? "text-[#7B1E1E]" : "text-[#292524] hover:text-[#7B1E1E]"} data-testid="nav-home">Home</NavLink>
          <NavLink to="/search" className={({isActive}) => isActive ? "text-[#7B1E1E]" : "text-[#292524] hover:text-[#7B1E1E]"} data-testid="nav-search">
            <NavLink to="/library" className={({isActive}) => isActive ? "text-[#7B1E1E]" : "text-[#292524] hover:text-[#7B1E1E]"}>Library</NavLink>
            <span className="inline-flex items-center gap-1"><Search className="w-4 h-4"/> Search</span>
          </NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-[#7B1E1E]" : "text-[#292524] hover:text-[#7B1E1E]"} data-testid="nav-dashboard">Dashboard</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/dashboard")} data-testid="header-dashboard-button" className="bg-[#7B1E1E] hover:bg-[#631818] text-white rounded-full px-5">
            <LayoutDashboard className="w-4 h-4 mr-2" /> My Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
}
