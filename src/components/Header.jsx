export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex items-center gap-3">
        {/* Logo mark */}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            QA-Gen
          </h1>
          <p className="text-xs text-slate-500 leading-tight">
            AI Test Case Generator · Built Using IBM Bob
          </p>
        </div>
      </div>
    </header>
  );
}
