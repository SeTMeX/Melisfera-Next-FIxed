import { NextRequest, NextResponse } from "next/server";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  try {
    const { phone, address, items, total } = await req.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
    }

    const itemsList = items
      .map((i: any) => `• ${escapeHtml(i.name)} ×${i.quantity} — ${escapeHtml(String(i.price))}`)
      .join("\n");

    const message = [
      "🍯 <b>COMANDĂ NOUĂ — Melisfera</b>",
      "",
      "📦 <b>Produse:</b>",
      itemsList,
      "",
      `💰 <b>Total: ${escapeHtml(String(total))} MDL</b>`,
      `📞 <b>Telefon:</b> ${escapeHtml(phone)}`,
      `📍 <b>Adresă:</b> ${escapeHtml(address)}`,
      "",
      `⏰ ${new Date().toLocaleString("ro-RO", { timeZone: "Europe/Chisinau" })}`,
    ].join("\n");

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram error:", data);
      return NextResponse.json({ error: "Telegram error", detail: data }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cash order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}