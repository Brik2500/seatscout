// ─────────────────────────────────────────────
// SeatScout — Ticket type definitions
// ─────────────────────────────────────────────

export interface Ticket {
  id: string;
  event: string;       // e.g. "Dodgers vs Yankees"
  date: string;        // ISO format: "2026-05-10"
  section: string;     // e.g. "Reserve 1"
  row: string;         // e.g. "A"
  seat?: string;       // optional seat number
  price: number;       // USD, no cents formatting needed here
  source: string;      // marketplace name, e.g. "SeatGeek"
  buy_url: string;     // base URL — affiliate params added via affiliateUtils
}

export interface SearchFilters {
  event: string;
  date: string;
  maxBudget?: number;
  section?: string;
}
