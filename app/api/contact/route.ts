import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
  _hp: z.string().optional(),
});

function buildRawMessage(opts: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}) {
  const msg = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Reply-To: ${opts.replyTo}`,
    `Subject: ${opts.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    "",
    opts.text,
  ].join("\r\n");
  return Buffer.from(msg).toString("base64url");
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 });
  }

  const { name, email, message, _hp } = parsed.data;

  if (_hp) return NextResponse.json({ ok: true });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const raw = buildRawMessage({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: "andrew.t.lau101@gmail.com",
    replyTo: email,
    subject: `Portfolio inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  try {
    await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Mail send failed:", msg);
    return NextResponse.json(
      { ok: false, error: process.env.NODE_ENV === "development" ? msg : "Failed to send" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
