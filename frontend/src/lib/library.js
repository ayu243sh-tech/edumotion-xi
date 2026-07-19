mport { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { isBookmarked } from "@/lib/library";
import { BookMarked, Bookmark } from "lucide-react";

export default function Library() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/catalog/books").then((r) => setBooks(r.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="library-page">
      <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Digital Library</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-8">Your bookshelf.</h1>

      {books.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-10 text-center text-[#78716C]">
          No books available yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" data-testid="library-grid">
          {books.map((b) => (
            <Link
              key={b.id}
              to={/library/${b.id}}
              data-testid={book-card-${b.id}}
              className="group bg-white rounded-[20px] border border-[#E7E5E4] overflow-hidden hover:-translate-y-1 transition-transform bento-shadow bento-shadow-hover"
            >
              <div className="relative aspect-[3/4]">
                <img src={b.cover} alt={b.title} className="w-full h-full object-cover" />
                {isBookmarked(b.id) && (
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1.5">
                    <Bookmark className="w-4 h-4 text-[#7B1E1E] fill-[#7B1E1E]" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="font-display font-semibold text-sm leading-snug line-clamp-2">{b.title}</div>
                <div className="text-xs text-[#78716C] mt-1">{b.author}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
