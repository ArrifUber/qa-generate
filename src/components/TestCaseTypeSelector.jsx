"use client";

const TEST_CASE_TYPES = [
  {
    value: "comprehensive",
    label: "All / Comprehensive",
    description: "Positive, negative, edge cases & security",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
    color: "indigo",
  },
  {
    value: "positive_negative",
    label: "Positive & Negative",
    description: "Happy path and failure scenarios",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    color: "emerald",
  },
  {
    value: "edge_cases",
    label: "Edge Cases",
    description: "Boundaries, extremes & unexpected inputs",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
    color: "amber",
  },
  {
    value: "security_validation",
    label: "Security & Validation",
    description: "Auth, injection, data integrity checks",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    color: "rose",
  },
];

const colorMap = {
  indigo: {
    selected: "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500",
    icon: "bg-indigo-100 text-indigo-600",
    dot: "bg-indigo-500",
  },
  emerald: {
    selected: "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500",
    icon: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
  },
  amber: {
    selected: "border-amber-500 bg-amber-50 ring-2 ring-amber-500",
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
  },
  rose: {
    selected: "border-rose-500 bg-rose-50 ring-2 ring-rose-500",
    icon: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
  },
};

export default function TestCaseTypeSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">
        Test Case Type
      </label>
      <p className="text-xs text-slate-500 -mt-1">
        Choose the focus area for the generated test cases.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {TEST_CASE_TYPES.map((type) => {
          const isSelected = value === type.value;
          const colors = colorMap[type.color];
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`relative flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all duration-150 cursor-pointer
                ${
                  isSelected
                    ? colors.selected
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              aria-pressed={isSelected}
            >
              <span
                className={`mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                  isSelected ? colors.icon : "bg-slate-100 text-slate-500"
                }`}
              >
                {type.icon}
              </span>
              <span className="flex flex-col min-w-0">
                <span
                  className={`text-sm font-semibold leading-tight ${
                    isSelected ? "text-slate-900" : "text-slate-700"
                  }`}
                >
                  {type.label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {type.description}
                </span>
              </span>
              {isSelected && (
                <span
                  className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${colors.dot}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
