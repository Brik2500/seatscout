// ─────────────────────────────────────────────
// SeatScout — Mock Ticket Data
//
// REPLACE THIS with a real API call when ready.
// See lib/ticketUtils.ts → fetchTickets() for
// the integration point.
// ─────────────────────────────────────────────

import { Ticket } from "@/types/ticket";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    event: "Dodgers vs Yankees",
    date: "2026-07-10",
    section: "Reserve 1",
    row: "A",
    seat: "12",
    price: 45,
    source: "SeatGeek",
    buy_url: "https://example.com/ticket/1",
  },
  {
    id: "2",
    event: "Dodgers vs Yankees",
    date: "2026-07-10",
    section: "Field Box 26",
    row: "C",
    seat: "7",
    price: 120,
    source: "StubHub",
    buy_url: "https://example.com/ticket/2",
  },
  {
    id: "3",
    event: "Dodgers vs Yankees",
    date: "2026-07-10",
    section: "Top Deck 1",
    row: "F",
    seat: "22",
    price: 28,
    source: "Ticketmaster",
    buy_url: "https://example.com/ticket/3",
  },
  {
    id: "4",
    event: "Dodgers vs Yankees",
    date: "2026-07-10",
    section: "Loge Box 116",
    row: "B",
    seat: "5",
    price: 210,
    source: "SeatGeek",
    buy_url: "https://example.com/ticket/4",
  },
  {
    id: "5",
    event: "Dodgers vs Yankees",
    date: "2026-07-10",
    section: "Reserve 52",
    row: "D",
    price: 55,
    source: "Vivid Seats",
    buy_url: "https://example.com/ticket/5",
  },
  {
    id: "6",
    event: "Dodgers vs Giants",
    date: "2026-08-07",
    section: "Field Box 5",
    row: "A",
    seat: "3",
    price: 175,
    source: "StubHub",
    buy_url: "https://example.com/ticket/6",
  },
  {
    id: "7",
    event: "Dodgers vs Giants",
    date: "2026-08-07",
    section: "Top Deck 4",
    row: "G",
    seat: "11",
    price: 22,
    source: "SeatGeek",
    buy_url: "https://example.com/ticket/7",
  },
  {
    id: "8",
    event: "Dodgers vs Giants",
    date: "2026-08-07",
    section: "Reserve 10",
    row: "B",
    seat: "8",
    price: 65,
    source: "Ticketmaster",
    buy_url: "https://example.com/ticket/8",
  },
  {
    id: "9",
    event: "Dodgers vs Padres",
    date: "2026-09-04",
    section: "Loge Box 140",
    row: "C",
    seat: "15",
    price: 310,
    source: "StubHub",
    buy_url: "https://example.com/ticket/9",
  },
  {
    id: "10",
    event: "Dodgers vs Padres",
    date: "2026-09-04",
    section: "Top Deck 7",
    row: "H",
    price: 18,
    source: "Vivid Seats",
    buy_url: "https://example.com/ticket/10",
  },
];

// ─────────────────────────────────────────────
// Sample dropdown options for the search form.
// Update these as you add more events.
// ─────────────────────────────────────────────
export const DODGERS_GAMES = [
  { label: "Dodgers vs Yankees — Jul 10, 2026", event: "Dodgers vs Yankees", date: "2026-07-10" },
  { label: "Dodgers vs Giants — Aug 7, 2026",   event: "Dodgers vs Giants",  date: "2026-08-07" },
  { label: "Dodgers vs Padres — Sep 4, 2026",   event: "Dodgers vs Padres",  date: "2026-09-04" },
];
