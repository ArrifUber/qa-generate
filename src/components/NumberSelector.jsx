"use client";

const PRESET_OPTIONS = [3, 5, 10, 15];

export default function NumberSelector({ value, onChange }) {
  const isCustom = !PRESET_OPTIONS.includes(value);

  const handlePreset = (num) => {
    onChange(num);
  };

  const handleCustom = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = parseInt(raw, 10);
    if (raw === "") {
      onChange(1);
      return;
    }
    if (!isNaN(num)) {
      onChange(Math.min(20, Math.max(1, num)));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">
        Number of Test Cases
      </label>
      <p className="text-xs text-slate-500 -mt-1">
        How many test cases should be generated? (max 20)
      </p>
      <div className="flex items-center gap-2 flex-wrap mt-1">
        {PRESET_OPTIONS.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handlePreset(num)}
            className={`w-12 h-10 rounded-lg border-2 text-sm font-semibold transition-all duration-150 cursor-pointer
              ${
                value === num && !isCustom
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            aria-pressed={value === num && !isCustom}
          >
            {num}
          </button>
        ))}

        {/* Custom input */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Custom:</span>
          <input
            type="number"
            min={1}
            max={20}
            value={value}
            onChange={handleCustom}
            className={`w-16 h-10 rounded-lg border-2 text-sm font-semibold text-center transition-all duration-150 outline-none
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              ${
                isCustom
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            aria-label="Custom number of test cases"
          />
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Selected: <span className="font-semibold text-slate-600">{value}</span> test case{value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
