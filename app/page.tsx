"use client";

import { useState } from "react";
import { Ticket, SearchFilters } from "@/types/ticket";
import { fetchTickets } from "@/lib/ticketUtils";
import SearchForm from "@/components/SearchForm";
import TicketResults from "@/components/TicketResults";

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(filters: SearchFilters) {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await fetchTickets(filters);
      setTickets(results);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      {/* ── Header ───────────────────────────────── */}
      <header className="bg-[#1E1B4B]">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-white font-black text-lg tracking-tight leading-none">Seat</span>
              <span className="text-[#60A5FA] font-black text-lg tracking-tight leading-none">Scout</span>
            </div>
            <span className="hidden sm:inline text-[10px] font-bold text-[#1E1B4B] bg-[#60A5FA] px-1.5 py-0.5 rounded tracking-widest uppercase">
              Beta
            </span>
          </div>

          <span className="text-xs text-[#818CF8] font-medium tracking-wide">
            LA Dodgers · 2026
          </span>
        </div>

        {/* Accent line */}
        <div className="h-[2px] bg-gradient-to-r from-[#1D4ED8] via-[#60A5FA] to-[#1E1B4B]" />
      </header>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="max-w-2xl mx-auto w-full px-5 pt-10 pb-7 text-center">

        {/* Status pill */}
        <div className="inline-flex items-center gap-1.5 bg-white border border-[#E2E8F0] text-[#1D4ED8] text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse inline-block" />
          Prices sorted lowest first — always
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] leading-[1.15] tracking-tight">
          Stop overpaying<br className="hidden sm:block" /> for Dodgers tickets.
        </h1>

        <p className="mt-3 text-[#64748B] text-[15px] max-w-sm mx-auto leading-relaxed">
          Search every marketplace at once. Best seats, lowest prices, zero markup.
        </p>
      </section>

      {/* ── Main content ─────────────────────────── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-5 pb-16 space-y-5">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        <TicketResults
          tickets={tickets}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />
      </main>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="max-w-2xl mx-auto px-5 py-5 text-center space-y-1">
          <p className="text-xs font-semibold text-[#64748B]">
            SeatScout — Find the best seat at the best price.
          </p>
          <p className="text-[11px] text-[#94A3B8]">
            Prices sourced from third-party marketplaces. Not affiliated with MLB or the LA Dodgers.
          </p>
        </div>
      </footer>
    </div>
  );
}
