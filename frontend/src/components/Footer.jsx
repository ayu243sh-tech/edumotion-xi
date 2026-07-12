import { Sparkles, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E5E4] bg-[#FAF9F6] mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#7B1E1E] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#F5B400]" />
            </div>
            <div className="font-display text-2xl font-bold">EduMotion <span className="font-mono-em text-sm text-[#78716C]">XI</span></div>
          </div>
          <p className="text-[#78716C] max-w-md leading-relaxed">A focused, distraction-free learning home for Indian school students. Notes, videos, PYQs, AI doubts — all in one calm space.</p>
          <div className="flex gap-3 mt-6">
            {[
              { Icon: Twitter, label: "twitter" },
              { Icon: Instagram, label: "instagram" },
              { Icon: Youtube, label: "youtube" },
              { Icon: Linkedin, label: "linkedin" },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" className="w-9 h-9 rounded-full border border-[#E7E5E4] flex items-center justify-center hover:border-[#7B1E1E] hover:text-[#7B1E1E] transition" aria-label={label}>
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-4">Learn</div>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-[#7B1E1E]" href="#">Class 9</a></li>
            <li><a className="hover:text-[#7B1E1E]" href="#">Class 10</a></li>
            <li><a className="hover:text-[#7B1E1E]" href="#">Class 11</a></li>
            <li><a className="hover:text-[#7B1E1E]" href="#">Class 12</a></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-[#7B1E1E]" href="#">About</a></li>
            <li><a className="hover:text-[#7B1E1E]" href="#">Contact</a></li>
            <li><a className="hover:text-[#7B1E1E]" href="#">Careers</a></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-4">Legal</div>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-[#7B1E1E]" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-[#7B1E1E]" href="#">Terms of Service</a></li>
            <li><a className="hover:text-[#7B1E1E]" href="#">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#78716C]">
          <div>© {new Date().getFullYear()} EduMotion XI. Crafted for calm learners.</div>
          <div className="font-mono-em">v1.0 · India</div>
        </div>
      </div>
    </footer>
  );
}
