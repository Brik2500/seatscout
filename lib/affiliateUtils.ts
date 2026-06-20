// ─────────────────────────────────────────────
// SeatScout — Affiliate URL Utilities
//
// Called by TicketCard before rendering the Buy button.
// Add env vars to .env.local, uncomment the relevant
// case, and affiliate tracking goes live automatically.
//
// Env vars needed:
//   NEXT_PUBLIC_SEATGEEK_AID   — from partners.seatgeek.com
//   NEXT_PUBLIC_STUBHUB_REF    — from StubHub affiliate program
//   NEXT_PUBLIC_TM_AFF         — from Ticketmaster / CJ Affiliate
//   NEXT_PUBLIC_VS_WSUSER      — from Vivid Seats affiliate program
// ─────────────────────────────────────────────

export function formatAffiliateUrl(baseUrl: string, source: string): string {
  try {
    const url = new URL(baseUrl);

    switch (source) {
      case "SeatGeek":
        // ⬇️  AFFILIATE ACTIVE: uncomment when you have your aid
        if (process.env.NEXT_PUBLIC_SEATGEEK_AID) {
          url.searchParams.set("aid", process.env.NEXT_PUBLIC_SEATGEEK_AID);
        }
        break;

      case "StubHub":
        // if (process.env.NEXT_PUBLIC_STUBHUB_REF) {
        //   url.searchParams.set("referrerId", process.env.NEXT_PUBLIC_STUBHUB_REF);
        // }
        break;

      case "Ticketmaster":
        // if (process.env.NEXT_PUBLIC_TM_AFF) {
        //   url.searchParams.set("awtrc", process.env.NEXT_PUBLIC_TM_AFF);
        // }
        break;

      case "Vivid Seats":
        // if (process.env.NEXT_PUBLIC_VS_WSUSER) {
        //   url.searchParams.set("wsuser", process.env.NEXT_PUBLIC_VS_WSUSER);
        // }
        break;

      default:
        break;
    }

    return url.toString();
  } catch {
    return baseUrl;
  }
}
