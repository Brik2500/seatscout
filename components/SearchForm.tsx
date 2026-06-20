"use client";

import { useState } from "react";
import { SearchFilters } from "@/types/ticket";
import { DODGERS_GAMES } from "@/lib/mockData";

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [selectedGame, setSelectedGame] = useState("");

  function handleGameSelect(value: string) {
    setSelectedGame(value);
    if (!value) { setEvent(""); setDate(""); return; }
    const game = DODGERS_GAMES.find((g) => g.label === value);
    if (game) { setEvent(game.event); setDate(game.date); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ event, date, maxBudget: maxBudget ? Number(maxBudget) : undefined });
  }

  const canSubmit = !isLoading && (!!event || !!date);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
    >
      <div className="p-5 sm:p-6 space-y-4">

        {/* ── Quick game picker ── */}
        <div>
          <Label>Select a game</Label>
          <div className="relative mt-1.5">
            <select
              value={selectedGame}
              onChange={(e) => handleGameSelect(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 pr-10 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition"
            >
              <option value="">— Choose a Dodgers game —</option>
              {DODGERS_GAMES.map((g) => (
                <option key={g.label} value={g.label}>{g.label}</option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[#F1F5F9]" />
          <span className="text-[11px] text-[#CBD5E1] font-medium tracking-wide">or search manually</span>
          <div className="h-px flex-1 bg-[#F1F5F9]" />
        </div>

        {/* ── Event name ── */}
        <div>
          <Label>Team or event</Label>
          <input
            type="text"
            placeholder="e.g. Dodgers vs Yankees"
            value={event}
            onChange={(e) => { setEvent(e.target.value); setSelectedGame(""); }}
            className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition"
          />
        </div>

        {/* ── Date + Budget — stack on mobile ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Date</Label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setSelectedGame(""); }}
              className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition"
            />
          </div>
          <div>
            <Label>
              Max budget{" "}
              <span className="font-normal text-[#CBD5E1] normal-case tracking-normal ml-1">optional</span>
            </Label>
            <div className="relative mt-1.5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm select-none">$</span>
              <input
                type="number"
                placeholder="150"
                min={0}
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-8 pr-4 py-3 text-sm text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit — full-width, flush to card bottom ── */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.99] disabled:bg-[#BFDBFE] disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm tracking-wide transition-all duration-150 shadow-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Searching tickets…
            </span>
          ) : (
            "Search Tickets"
          )}
        </button>
      </div>
    </form>
  );
}

// ── Small helpers ──────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
      {children}
    </p>
  );
}

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
      width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    >
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
}
