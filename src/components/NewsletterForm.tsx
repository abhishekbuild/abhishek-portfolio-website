"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-label-caps text-label-caps text-primary tracking-widest">
        YOU&apos;RE IN. CHECK YOUR INBOX.
      </p>
    );
  }

  return (
    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="w-full bg-transparent border-b border-outline-variant py-4 focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant/50 font-body-md text-body-md"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-primary-container text-white py-4 font-label-caps text-label-caps tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-60"
      >
        {status === "loading" ? "SUBSCRIBING…" : "SUBSCRIBE"}
      </button>
      {status === "error" && (
        <p className="font-mono-data text-mono-data text-error">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
