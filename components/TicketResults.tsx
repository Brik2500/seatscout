"use client";

import { useState } from "react";
import { Ticket } from "@/types/ticket";
import { sortByPriceAsc, getBestDealId, getUniqueSections } from "@/lib/ticketUtils";
import TicketCard, { TicketTableRow } from "@/components/TicketCard";

interface TicketResultsProps {
  tickets: Ticket[];
  isLoading: boolean;
  hasSearched: boolean;
}

type ViewMode = "cards" | "table";

export default function TicketResults({ tickets, isLoading, hasSearched }: TicketResultsProps) {
  const [maxPrice, setMaxPrice] = useState("");
  const [section, setSection] = useState("");
  const [view, setView] = useState<ViewMode>("cards");

  const filtered = sortByPriceAsc(
    tickets.filter((t) => {
      const underBudget = maxPrice ? t.price <= Number(maxPrice) : true;
      const inSection = section ? t.section.toLowerCase().includes(section.toLowerCase()) : true;
      return underBudget && inSection;
    })
  );

  const bestDealId = getBestDealId(filtered);
  const sections = getUniqueSections(tickets);
  const savings = filtered.length > 1
    ? filtered[filtered.length - 1].price - filtered[0].price
    : 0;

  // ── Loading ──────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative w-11 h-11 mb-4">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#BFDBFE]" />
          <div className="absolute inset-0 rounded-full border-[3px] border-[#1D4ED8] border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-semibold text-[#0F172A]">Finding the best seats…</p>
        <p className="text-xs text-[#94A3B8] mt-1">Checking all marketplaces</p>
      </div>
    );
  }

  // ── Pre-search ───────────────────────────────
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#0F172A]">Pick a game to see available seats</p>
        <p className="text-xs text-[#94A3B8] mt-1">Results always sorted lowest price first</p>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] flex items-center justify-center mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#0F172A]">No tickets match your search</p>
        <p className="text-xs text-[#94A3B8] mt-1">Try a wider budget or a different section</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {/* ── Results summary bar ─────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">
            {filtered.length} ticket{filtered.length !== 1 ? "s" : ""} available
          </p>
          {savings > 0 && (
            <p className="text-xs text-[#16A34A] font-semibold mt-0.5">
              Best deal saves you ${savings} vs. the most expensive option
            </p>
          )}
        </div>

        {/* View toggle */}
        <div className="flex rounded-xl border border-[#E2E8F0] overflow-hidden bg-white flex-shrink-0">
          {(["cards", "table"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3.5 py-2 text-xs font-semibold capitalize transition-colors ${
                view === v ? "bg-[#1D4ED8] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────── */}
      <div className="sticky top-0 z-10 bg-[#F8FAFC] py-2 -mx-1 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-widest mr-0.5">Filter</span>

          {/* Section */}
          <div className="relative">
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="appearance-none rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-7 py-1.5 text-xs text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition"
            >
              <option value="">All sections</option>
              {sections.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </div>

          {/* Max price */}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs font-medium select-none">$</span>
            <input
              type="number"
              placeholder="Max price"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-lg border border-[#E2E8F0] bg-white pl-5 pr-3 py-1.5 text-xs text-[#0F172A] font-medium w-28 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition"
            />
          </div>

          {(section || maxPrice) && (
            <button
              onClick={() => { setSection(""); setMaxPrice(""); }}
              className="text-[11px] text-[#94A3B8] hover:text-[#1D4ED8] font-semibold transition-colors underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Card view ───────────────────────────── */}
      {view === "cards" && (
        <div className="space-y-3 animate-results">
          {filtered.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isBestDeal={ticket.id === bestDealId}
            />
          ))}
        </div>
      )}

      {/* ── Table view ──────────────────────────── */}
      {view === "table" && (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm animate-results">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                {["Section", "Row", "Seat", "Price", "Marketplace", "Buy"].map((h) => (
                  <th key={h} className="py-3 px-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => (
                <TicketTableRow
                  key={ticket.id}
                  ticket={ticket}
                  isBestDeal={ticket.id === bestDealId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
