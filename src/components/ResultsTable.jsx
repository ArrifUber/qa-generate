"use client";

import { useState } from "react";

const TYPE_BADGE = {
  Positive: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Negative: "bg-red-100 text-red-700 border border-red-200",
  Edge: "bg-amber-100 text-amber-700 border border-amber-200",
  Security: "bg-purple-100 text-purple-700 border border-purple-200",
};

const TYPE_ACCENT = {
  Positive: "border-l-emerald-400",
  Negative: "border-l-red-400",
  Edge: "border-l-amber-400",
  Security: "border-l-purple-400",
};

function Badge({ type }) {
  const cls =
    TYPE_BADGE[type] || "bg-slate-100 text-slate-600 border border-slate-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      {type}
    </span>
  );
}

function StepList({ steps }) {
  if (!steps || steps.length === 0)
    return <span className="text-slate-400 italic text-sm">—</span>;
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm text-slate-700">
          <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs mt-0.5">
            {i + 1}
          </span>
          <span className="leading-relaxed">
            {step.replace(/^Step \d+:\s*/i, "")}
          </span>
        </li>
      ))}
    </ol>
  );
}

function PreconditionList({ items }) {
  if (!items || items.length === 0)
    return <span className="text-slate-400 italic text-sm">None</span>;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-600">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function TestCaseCard({ tc, index, isOpen, onToggle }) {
  const id = tc.id || `TC-${String(index + 1).padStart(3, "0")}`;
  const accentBorder = TYPE_ACCENT[tc.testType] || "border-l-slate-300";

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${accentBorder} shadow-sm overflow-hidden transition-shadow duration-200 ${isOpen ? "shadow-md" : "hover:shadow-md"}`}
    >
      {/* ── Header row (always visible) ── */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        {/* ID pill */}
        <span className="shrink-0 font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-1 leading-none">
          {id}
        </span>

        {/* Title + scenario */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-snug truncate">
            {tc.title}
          </p>
          {tc.scenario && (
            <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-1">
              {tc.scenario}
            </p>
          )}
        </div>

        {/* Type badge */}
        <Badge type={tc.testType} />

        {/* Chevron */}
        <svg
          className={`shrink-0 w-4 h-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {/* ── Expandable body ── */}
      {isOpen && (
        <div className="border-t border-slate-100 px-5 py-5 flex flex-col gap-6">
          {/* Scenario (full text when open) */}
          {tc.scenario && (
            <div>
              <SectionLabel>Scenario</SectionLabel>
              <p className="text-sm text-slate-700 leading-relaxed">{tc.scenario}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pre-conditions */}
            <div>
              <SectionLabel>Pre-conditions</SectionLabel>
              <PreconditionList items={tc.preconditions} />
            </div>

            {/* Expected Result */}
            <div>
              <SectionLabel>Expected Result</SectionLabel>
              <p className="text-sm text-slate-700 leading-relaxed">
                {tc.expectedResult || (
                  <span className="italic text-slate-400">Not specified</span>
                )}
              </p>
            </div>
          </div>

          {/* Test Steps (full width) */}
          <div>
            <SectionLabel>Test Steps</SectionLabel>
            <StepList steps={tc.steps} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsTable({ testCases }) {
  const [openIndex, setOpenIndex] = useState(0); // first card open by default

  if (!testCases || testCases.length === 0) return null;

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="flex flex-col gap-3">
      {testCases.map((tc, idx) => (
        <TestCaseCard
          key={tc.id || idx}
          tc={tc}
          index={idx}
          isOpen={openIndex === idx}
          onToggle={() => toggle(idx)}
        />
      ))}
    </div>
  );
}
