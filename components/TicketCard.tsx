"use client";

// Buy button routes through formatAffiliateUrl.
// To add affiliate tags, edit lib/affiliateUtils.ts.

import { Ticket } from "@/types/ticket";
import { formatAffiliateUrl } from "@/lib/affiliateUtils";

interface TicketCardProps {
  ticket: Ticket;
  isBestDeal: boolean;
}

export default function TicketCard({ ticket, isBestDeal }: TicketCardProps) {
  const buyUrl = formatAffiliateUrl(ticket.buy_url, ticket.source);

  if (isBestDeal) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        {/* Green top bar */}
        <div className="h-1 bg-gradient-to-r from-[#16A34A] via-[#4ADE80] to-[#16A34A]" />

        <div className="bg-[#F0FDF4] border border-[#16A34A]/30 rounded-b-2xl px-4 pt-4 pb-4">
          {/* Badge row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-[#16A34A] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Best Deal
            </span>
            <span className="text-[11px] text-[#16A34A] font-semibold">Lowest price available</span>
          </div>

          {/* Card body */}
          <div className="flex items-center gap-4">
            {/* Price */}
            <div className="flex-shrink-0 text-center">
              <span className="text-3xl font-black text-[#16A34A] leading-none">${ticket.price}</span>
              <p className="text-[10px] text-[#4ADE80] mt-0.5 font-semibold uppercase tracking-wide">each</p>
            </div>

            <div className="w-px self-stretch bg-[#BBF7D0]" />

            {/* Seat info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#14532D] truncate">{ticket.section}</p>
              <p className="text-xs text-[#16A34A] mt-0.5">
                Row <span className="font-bold">{ticket.row}</span>
                {ticket.seat && <> · Seat <span className="font-bold">{ticket.seat}</span></>}
              </p>
              <p className="text-[11px] text-[#4ADE80] mt-0.5 font-medium">{ticket.source}</p>
            </div>

            {/* CTA */}
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white text-xs font-bold px-4 py-3 transition-all duration-150 whitespace-nowrap shadow-sm"
            >
              Buy Ticket →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Standard card ──────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#CBD5E1] transition-all duration-150 p-4 flex items-center gap-4">
      {/* Price */}
      <div className="flex-shrink-0 w-[68px] text-center bg-[#F8FAFC] rounded-xl py-2.5">
        <span className="text-xl font-black text-[#0F172A] leading-none">${ticket.price}</span>
        <p className="text-[10px] text-[#94A3B8] mt-0.5 font-medium">each</p>
      </div>

      <div className="w-px self-stretch bg-[#F1F5F9]" />

      {/* Seat info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#0F172A] truncate">{ticket.section}</p>
        <p className="text-xs text-[#64748B] mt-0.5">
          Row <span className="font-semibold text-[#0F172A]">{ticket.row}</span>
          {ticket.seat && <> · Seat <span className="font-semibold text-[#0F172A]">{ticket.seat}</span></>}
        </p>
        <p className="text-[11px] text-[#94A3B8] mt-0.5">{ticket.source}</p>
      </div>

      {/* CTA */}
      <a
        href={buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.98] text-white text-xs font-bold px-4 py-2.5 transition-all duration-150 whitespace-nowrap shadow-sm"
      >
        Buy Ticket →
      </a>
    </div>
  );
}

// ── Table row variant ──────────────────────────

export function TicketTableRow({ ticket, isBestDeal }: TicketCardProps) {
  const buyUrl = formatAffiliateUrl(ticket.buy_url, ticket.source);

  return (
    <tr className={`border-b border-[#F1F5F9] transition-colors ${isBestDeal ? "bg-[#F0FDF4]" : "hover:bg-[#F8FAFC]"}`}>
      <td className="py-3 px-4 text-sm text-[#0F172A] font-medium">{ticket.section}</td>
      <td className="py-3 px-4 text-sm text-[#0F172A]">{ticket.row}</td>
      <td className="py-3 px-4 text-sm text-[#64748B]">{ticket.seat ?? "—"}</td>
      <td className="py-3 px-4">
        <span className={`text-sm font-black ${isBestDeal ? "text-[#16A34A]" : "text-[#0F172A]"}`}>
          ${ticket.price}
        </span>
        {isBestDeal && (
          <span className="ml-2 text-[10px] bg-[#DCFCE7] text-[#16A34A] font-bold px-2 py-0.5 rounded-full">
            Best
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-[#64748B]">{ticket.source}</td>
      <td className="py-3 px-4">
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1D4ED8] hover:text-[#1E40AF] text-xs font-bold transition-colors"
        >
          Buy →
        </a>
      </td>
    </tr>
  );
}
