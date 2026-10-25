"use client";

import { useState } from "react";
import Header from "@/components/Header";
import UserStoryInput from "@/components/UserStoryInput";
import TestCaseTypeSelector from "@/components/TestCaseTypeSelector";
import NumberSelector from "@/components/NumberSelector";
import ResultsTable from "@/components/ResultsTable";
import ExportButtons from "@/components/ExportButtons";
import ErrorAlert from "@/components/ErrorAlert";

const INITIAL_FORM = {
  userStory: "",
  testCaseType: "comprehensive",
  numberOfTests: 5,
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function StatsBar({ testCases }) {
  if (!testCases || testCases.length === 0) return null;

  const counts = testCases.reduce((acc, tc) => {
    const t = tc.testType || "Unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const statDefs = [
    { label: "Total", value: testCases.length, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { label: "Positive", value: counts.Positive || 0, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "Negative", value: counts.Negative || 0, color: "text-red-600 bg-red-50 border-red-200" },
    { label: "Edge", value: counts.Edge || 0, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Security", value: counts.Security || 0, color: "text-purple-600 bg-purple-50 border-purple-200" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statDefs.map(({ label, value, color }) => (
        <span
          key={label}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}
        >
          <span className="text-base font-bold">{value}</span>
          {label}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldError, setFieldError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const updateField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "userStory" && fieldError) setFieldError("");
  };

  const validate = () => {
    if (!form.userStory.trim()) {
      setFieldError("Please enter a user story or feature description before generating.");
      return false;
    }
    if (form.userStory.trim().length < 10) {
      setFieldError("Your description is too short. Please provide more detail (at least 10 characters).");
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    setApiError("");
    setFieldError("");

    if (!validate()) return;

    setLoading(true);
    setTestCases([]);

    try {
      const res = await fetch("/api/generate-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userStory: form.userStory.trim(),
          testCaseType: form.testCaseType,
          numberOfTests: form.numberOfTests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || `Request failed with status ${res.status}.`);
        return;
      }

      setTestCases(data.testCases);
    } catch (err) {
      console.error(err);
      setApiError(
        err.name === "TypeError"
          ? "Could not reach the server. Please check your connection and try again."
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setTestCases([]);
    setApiError("");
    setFieldError("");
  };

  const hasResults = testCases.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-8">

        {/* ── Page heading ── */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Generate Test Cases with AI
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Describe your feature, pick a focus, and let Gemini craft structured test cases instantly.
            </p>
          </div>
          {hasResults && (
            <button
              type="button"
              onClick={handleReset}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Start Over
            </button>
          )}
        </div>

        {/* ── Flex-wrap body: input left, results right on wide screens ── */}
        <div className="flex flex-wrap gap-6 items-start">

          {/* ── Input column: fixed width, stacks below results on narrow screens ── */}
          <div className="flex flex-col gap-5 w-full shrink-0">
                        {/* Pro tips */}
            {!hasResults && !loading && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                  💡 Pro Tips
                </p>
                <ul className="text-xs text-indigo-600 space-y-1 list-disc list-inside">
                  <li>Include clear acceptance criteria for better results.</li>
                  <li>Describe user roles, actions, and expected outcomes.</li>
                  <li>Export to CSV for direct Jira / TestRail import.</li>
                  <li>Use <strong>Security</strong> mode for login &amp; auth flows.</li>
                </ul>
              </div>
            )}

            {/* Input card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
              <UserStoryInput
                value={form.userStory}
                onChange={updateField("userStory")}
                error={fieldError}
              />

              <hr className="border-slate-100" />

              <TestCaseTypeSelector
                value={form.testCaseType}
                onChange={updateField("testCaseType")}
              />

              <hr className="border-slate-100" />

              <NumberSelector
                value={form.numberOfTests}
                onChange={updateField("numberOfTests")}
              />

              {apiError && (
                <ErrorAlert message={apiError} onDismiss={() => setApiError("")} />
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-base font-semibold text-white
                  transition-all duration-200 cursor-pointer shadow-sm
                  ${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 hover:shadow-md"
                  }`}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Generating…</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                    Generate Test Cases
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center -mt-2">
                Gemini 3.6 Flash · Results in ~5–15s
              </p>
            </div>

          </div>

          {/* ── Results column: grows to fill remaining space ── */}
          <div className="flex flex-col gap-4 flex-1 min-w-0 w-full lg:w-0">

            {/* Empty state */}
            {!hasResults && !loading && (
              <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-2xl border border-dashed border-slate-300 text-center p-8 gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">No test cases yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Fill in the form and click{" "}
                    <span className="font-medium text-indigo-600">Generate Test Cases</span>{" "}
                    to get started.
                  </p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-2xl border border-slate-200 gap-5 py-16">
                <div className="relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                  <div className="absolute w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 text-sm">Gemini is thinking…</p>
                  <p className="text-xs text-slate-400 mt-1">Analysing your story and crafting test cases</p>
                </div>
              </div>
            )}

            {/* Results */}
            {hasResults && (
              <>
                {/* Results bar: stats + export */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-slate-800">Generated Test Cases</p>
                    <StatsBar testCases={testCases} />
                  </div>
                  <ExportButtons testCases={testCases} />
                </div>

                {/* Accordion cards */}
                <ResultsTable testCases={testCases} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>QA-Gen · AI Test Case Generator</span>
          <span>Built Using IBM Bob</span>
        </div>
      </footer>
    </div>
  );
}
