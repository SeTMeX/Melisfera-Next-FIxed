import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, address, items, total } = await req.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
    }

    const itemsList = items
      .map((i: any) => `• ${i.name} ×${i.quantity} — ${i.price}`)
      .join("\n");

    const message = [
      "🍯 *COMANDĂ NOUĂ — Melisfera*",
      "",
      "📦 *Produse:*",
      itemsList,
      "",
      `💰 *Total: ${total} MDL*`,
      `📞 *Telefon:* ${phone}`,
      `📍 *Adresă:* ${address}`,
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
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram error:", data);
      return NextResponse.json({ error: "Telegram error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cash order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}