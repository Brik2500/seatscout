// ─────────────────────────────────────────────
// SeatScout — /api/tickets
//
// This server-side route keeps your SeatGeek
// client_id out of the browser. The frontend
// calls this route; this route calls SeatGeek.
//
// SETUP:
//   1. Get a free client_id at seatgeek.com/account/develop
//   2. Add SEATGEEK_CLIENT_ID to .env.local
//   3. If key is missing, falls back to mock data automatically
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { Ticket } from "@/types/ticket";
import { MOCK_TICKETS } from "@/lib/mockData";
import { filterTickets } from "@/lib/ticketUtils";

// ── SeatGeek API response shapes ──────────────

interface SGEvent {
  id: number;
  title: string;
  datetime_local: string;
  url: string;
  stats: {
    lowest_price: number | null;
    highest_price: number | null;
    listing_count: number;
  };
}

interface SGListing {
  id: string;
  section: string;
  row: string;
  quantity: number;
  price: number; // price per ticket
}

// ─────────────────────────────────────────────
// GET /api/tickets?event=...&date=...&maxBudget=...
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const event     = searchParams.get("event")     ?? "";
  const date      = searchParams.get("date")      ?? "";
  const maxBudget = searchParams.get("maxBudget") ? Number(searchParams.get("maxBudget")) : undefined;

  const clientId = process.env.SEATGEEK_CLIENT_ID;

  // ── No real API key → return mock data ───────
  // Treats missing, placeholder, or default values as "not set".
  // Remove this block once you have a real client_id.
  const hasRealKey = clientId && !clientId.startsWith("your_");
  if (!hasRealKey) {
    await new Promise((r) => setTimeout(r, 500)); // simulate network latency
    const mock = filterTickets(MOCK_TICKETS, { event, date, maxBudget });
    return NextResponse.json(mock);
  }

  // ── Step 1: Find the SeatGeek event ──────────
  //
  // We search by the Dodgers' performer slug so results
  // are always scoped to Dodger Stadium.
  //
  // TO EXPAND BEYOND DODGERS: replace "los-angeles-dodgers"
  // with a dynamic slug derived from the `event` query param,
  // or search by `q` (free text) instead of performers.slug.
  try {
    const eventParams = new URLSearchParams({
      "performers.slug": "los-angeles-dodgers",
      client_id: clientId,
      per_page: "1",
    });

    if (date) {
      // Scope to the specific game day
      eventParams.set("datetime_local.gte", `${date}T00:00:00`);
      eventParams.set("datetime_local.lte", `${date}T23:59:59`);
    }

    const eventsRes  = await fetch(`https://api.seatgeek.com/2/events?${eventParams}`, {
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!eventsRes.ok) {
      throw new Error(`SeatGeek events error: ${eventsRes.status}`);
    }

    const eventsData = await eventsRes.json();
    const sgEvent: SGEvent | undefined = eventsData.events?.[0];

    if (!sgEvent) {
      // No event found for this date — return empty
      return NextResponse.json([]);
    }

    // ── Step 2: Fetch individual seat listings ────
    //
    // NOTE: The /listings endpoint requires SeatGeek Open API access.
    // Apply at partners.seatgeek.com. If your account doesn't have
    // access yet, this call will return an error — the catch block
    // below will fall back to event-level summary cards instead.
    const listingsParams = new URLSearchParams({
      event_id: String(sgEvent.id),
      client_id: clientId,
      per_page: "100",
      sort: "price asc",
    });

    const listingsRes  = await fetch(`https://api.seatgeek.com/2/listings?${listingsParams}`, {
      next: { revalidate: 120 }, // cache listings for 2 minutes
    });

    // ── Step 3a: Full listing-level data (partner access) ──
    if (listingsRes.ok) {
      const listingsData = await listingsRes.json();
      const listings: SGListing[] = listingsData.listings ?? [];

      const tickets: Ticket[] = listings
        .filter((l) => maxBudget === undefined || l.price <= maxBudget)
        .map((l) => ({
          id:       String(l.id),
          event:    sgEvent.title,
          date,
          section:  l.section,
          row:      l.row,
          // SeatGeek free API doesn't expose individual seat numbers
          price:    l.price,
          source:   "SeatGeek",
          // buy_url is the event page — affiliate params appended by affiliateUtils
          buy_url:  sgEvent.url,
        }));

      return NextResponse.json(tickets);
    }

    // ── Step 3b: Event-level fallback (free tier) ─
    //
    // If /listings isn't accessible, return a single summary card
    // per event using the price stats SeatGeek always returns.
    // The Buy button still links to SeatGeek's full seat map.
    const lowestPrice = sgEvent.stats.lowest_price;
    if (!lowestPrice) return NextResponse.json([]);

    const summaryTicket: Ticket = {
      id:      String(sgEvent.id),
      event:   sgEvent.title,
      date,
      section: `${sgEvent.stats.listing_count} listings available`,
      row:     "—",
      price:   lowestPrice,
      source:  "SeatGeek",
      buy_url: sgEvent.url,
    };

    return NextResponse.json([summaryTicket]);

  } catch (err) {
    // SeatGeek call failed — fall back to mock data so the app stays usable.
    // Once your API key is live and verified, you can change this to return a 502.
    console.error("[/api/tickets] SeatGeek fetch failed, falling back to mock:", err);
    const mock = filterTickets(MOCK_TICKETS, { event, date, maxBudget });
    return NextResponse.json(mock);
  }
}
