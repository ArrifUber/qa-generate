"use client";

export default function UserStoryInput({ value, onChange, error }) {
  const charCount = value.length;
  const isNearLimit = charCount > 4000;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="user-story"
        className="text-sm font-semibold text-slate-700"
      >
        User Story / Feature Description
        <span className="ml-1 text-red-500" aria-hidden="true">*</span>
      </label>
      <p className="text-xs text-slate-500 -mt-1">
        Paste your user story, PRD snippet, or feature description below.
      </p>
      <textarea
        id="user-story"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        maxLength={5000}
        placeholder={`Example:\n\nAs a registered user, I want to be able to reset my password via email so that I can regain access to my account if I forget my password.\n\nAcceptance Criteria:\n- A "Forgot Password" link is visible on the login page.\n- Clicking it asks for my registered email address.\n- An email with a secure reset link is sent within 2 minutes.\n- The link expires after 30 minutes.`}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 resize-y
          font-mono leading-relaxed transition-colors duration-150 outline-none
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
        aria-describedby={error ? "story-error" : undefined}
      />
      <div className="flex items-center justify-between">
        {error ? (
          <p id="story-error" className="text-xs text-red-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        ) : (
          <span />
        )}
        <span
          className={`text-xs tabular-nums ${
            isNearLimit ? "text-amber-600 font-medium" : "text-slate-400"
          }`}
        >
          {charCount.toLocaleString()} / 5,000
        </span>
      </div>
    </div>
  );
}
