"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

const HOW_OPTIONS = [
  "Search engine",
  "Colleague / referral",
  "Academic / research network",
  "Social media",
  "News article or publication",
  "Other",
];

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setState("success");
        form.reset();
      } else {
        const json = await res.json();
        setErrorMsg(
          json?.errors?.[0]?.message || "Submission failed. Please try again."
        );
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-8 py-12 text-center">
        <div className="mb-3 text-3xl">&#10003;</div>
        <h3 className="mb-2 text-lg font-semibold text-green-800">
          Message received
        </h3>
        <p className="text-sm text-green-700">
          We&apos;ll follow up within 2&ndash;3 business days.
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-6 text-sm text-green-700 underline underline-offset-2 hover:text-green-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your full name"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@organization.com"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      {/* How did you find us */}
      <div>
        <label
          htmlFor="referral"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          How did you find us?
        </label>
        <select
          id="referral"
          name="referral"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="">— Select one —</option>
          {HOW_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Research inquiry, data question, partnership, or feedback..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
        />
      </div>

      {/* Error */}
      {state === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {state === "submitting" ? "Sending..." : "Send message"}
      </button>

      <p className="text-xs text-slate-400 text-center">
        We respond within 2&ndash;3 business days. Your information is never
        shared.
      </p>
    </form>
  );
}
