import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { isBookmarked, toggleBookmark, getCurrentPage, setCurrentPage } from "@/lib/library";
import { Bookmark, Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export default function BookReader() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [page, setPage] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let ignore = false;
    api.get(`/catalog/books/${bookId}`).then((r) => {
      if (!ignore) {
        setBook(r.data);
        setPage(getCurrentPage(bookId));
      }
    });
    setBookmarked(isBookmarked(bookId));
    return () => {
      ignore = true;
    };
  }, [bookId]);

  if (!book) return null;

  const goToPage = (p) => {
    const clamped = Math.max(1, Math.min(book.total_pages, p));
    setPage(clamped);
    setCurrentPage(bookId, clamped);
    return clamped;
  };

  // Google Drive's embedded /preview viewer is continuous-scroll only — it
  // doesn't support jumping to a specific page via URL. So "page" here just
  // tracks reading progress locally; to actually jump to a page, we open
  // Drive's standalone /view viewer in a new tab, which does honor #page=N.
  const openAtPage = (p) => {
    const clamped = goToPage(p);
    const viewUrl = book.pdf_url.replace("/preview", "/view");
    window.open(`${viewUrl}#page=${clamped}`, "_blank", "noopener");
  };

  const handleBookmark = () => {
    const nowBookmarked = toggleBookmark(bookId);
    setBookmarked(nowBookmarked);
  };

  const hasChapters = book.chapters && book.chapters.length > 0;
  const filteredChapters = hasChapters
    ? book.chapters.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" data-testid="book-reader-page">
      <Link to="/library" className="text-sm text-[#78716C] hover:text-[#7B1E1E]">← Back to Library</Link>

      <div className="mt-4 grid md:grid-cols-12 gap-6">
        {/* Left: chapter list + search */}
        <aside className="md:col-span-3 space-y-4">
          <div>
            <h1 className="font-display text-2xl font-bold">{book.title}</h1>
            <div className="text-sm text-[#78716C] mt-1">{book.author}</div>
          </div>

          <button
            onClick={handleBookmark}
            data-testid="bookmark-button"
            className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 font-semibold text-sm transition-colors ${
              bookmarked ? "bg-[#7B1E1E] text-white" : "border border-[#E7E5E4] text-[#292524] hover:border-[#7B1E1E]"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-white" : ""}`} />
            {bookmarked ? "Bookmarked" : "Bookmark this book"}
          </button>

          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-4">
            {hasChapters && (
              <div className="flex items-center bg-[#FAF9F6] border border-[#E7E5E4] rounded-full px-3 py-1.5 mb-4">
                <Search className="w-4 h-4 text-[#78716C] mr-2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chapters..."
                  data-testid="chapter-search-input"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            )}
            <div className="text-xs uppercase tracking-[0.15em] font-mono-em text-[#78716C] mb-2">Chapters</div>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {!hasChapters ? (
                <div className="text-sm text-[#78716C] py-2">This book has no chapter list — just start reading!</div>
              ) : filteredChapters.length === 0 ? (
                <div className="text-sm text-[#78716C] py-2">No chapters match.</div>
              ) : (
                filteredChapters.map((c) => (
                  <button
                    key={c.page}
                    onClick={() => openAtPage(c.page)}
                    data-testid={`chapter-link-${c.page}`}
                    className={`w-full flex items-center justify-between text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                      page === c.page ? "bg-[#FDE68A]/60 text-[#7B1E1E] font-semibold" : "hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <span>{c.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 opacity-60" />
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right: reader */}
        <div className="md:col-span-9">
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => openAtPage(page - 1)}
              disabled={page <= 1}
              data-testid="prev-page-button"
              className="flex items-center gap-1 text-sm font-semibold text-[#7B1E1E] disabled:text-[#E7E5E4] disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <div className="flex items-center gap-2 text-sm font-mono-em">
              <span>Page</span>
              <input
                type="number"
                value={page}
                onChange={(e) => goToPage(Number(e.target.value) || 1)}
                data-testid="page-number-input"
                className="w-14 text-center border border-[#E7E5E4] rounded-lg py-1"
              />
              <span>of {book.total_pages}</span>
              <button
                onClick={() => openAtPage(page)}
                data-testid="jump-to-page-button"
                className="ml-2 text-xs bg-[#F5B400] hover:bg-[#D99E00] text-[#292524] rounded-full px-3 py-1.5 font-semibold flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> Open at this page
              </button>
            </div>

            <button
              onClick={() => openAtPage(page + 1)}
              disabled={page >= book.total_pages}
              data-testid="next-page-button"
              className="flex items-center gap-1 text-sm font-semibold text-[#7B1E1E] disabled:text-[#E7E5E4] disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-[20px] border border-[#E7E5E4] overflow-hidden">
            <iframe
              src={book.pdf_url}
              title={book.title}
              className="w-full aspect-[3/4] md:aspect-[4/3]"
              data-testid="book-pdf-viewer"
            />
          </div>
          <p className="text-xs text-[#78716C] mt-2">
            This preview scrolls continuously. Use "Open at this page" or a chapter link to jump straight to that page in a new tab.
          </p>

          <div className="mt-3 h-1.5 bg-[#F5F5F4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5B400] rounded-full transition-all"
              style={{ width: `${(page / book.total_pages) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
