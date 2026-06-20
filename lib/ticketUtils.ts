// ─────────────────────────────────────────────
// SeatScout — Ticket Utilities
//
// All data fetching and filtering logic lives here.
// When you're ready to connect a real API, replace
// the body of `fetchTickets` — the rest of the app
// will continue to work unchanged.
// ─────────────────────────────────────────────

import { Ticket, SearchFilters } from "@/types/ticket";

// ─────────────────────────────────────────────
// FETCH TICKETS
//
// Calls /api/tickets, which handles SeatGeek
// server-side (keeping the API key out of the
// browser). Falls back to mock data automatically
// when SEATGEEK_CLIENT_ID is not set in .env.local.
//
// You should NOT need to edit this function.
// To change API behavior, edit app/api/tickets/route.ts.
// ─────────────────────────────────────────────
export async function fetchTickets(filters: SearchFilters): Promise<Ticket[]> {
  const params = new URLSearchParams();
  if (filters.event)     params.set("event",     filters.event);
  if (filters.date)      params.set("date",       filters.date);
  if (filters.maxBudget) params.set("maxBudget",  String(filters.maxBudget));

  const res = await fetch(`/api/tickets?${params}`);
  if (!res.ok) throw new Error(`Ticket fetch failed: ${res.status}`);
  return res.json();
}

// ─────────────────────────────────────────────
// FILTER — by event name, date, budget, section
// ─────────────────────────────────────────────
export function filterTickets(tickets: Ticket[], filters: SearchFilters): Ticket[] {
  return tickets.filter((ticket) => {
    const matchesEvent =
      !filters.event ||
      ticket.event.toLowerCase().includes(filters.event.toLowerCase());

    const matchesDate =
      !filters.date || ticket.date === filters.date;

    const matchesBudget =
      filters.maxBudget === undefined || ticket.price <= filters.maxBudget;

    const matchesSection =
      !filters.section ||
      ticket.section.toLowerCase().includes(filters.section.toLowerCase());

    return matchesEvent && matchesDate && matchesBudget && matchesSection;
  });
}

// ─────────────────────────────────────────────
// SORT — lowest price first (default)
// ─────────────────────────────────────────────
export function sortByPriceAsc(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => a.price - b.price);
}

// ─────────────────────────────────────────────
// BEST DEAL — returns the id of the cheapest ticket
// ─────────────────────────────────────────────
export function getBestDealId(tickets: Ticket[]): string | null {
  if (tickets.length === 0) return null;
  return sortByPriceAsc(tickets)[0].id;
}

// ─────────────────────────────────────────────
// UNIQUE SECTIONS — for the section filter dropdown
// ─────────────────────────────────────────────
export function getUniqueSections(tickets: Ticket[]): string[] {
  return Array.from(new Set(tickets.map((t) => t.section))).sort();
}
