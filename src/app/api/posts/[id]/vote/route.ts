import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { option_index } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';

    // Check if already voted
    const existing = await query({
      query: "SELECT id FROM poll_votes WHERE post_id = ? AND user_ip = ?",
      values: [id, ip] as never[],
    }) as any[];

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already Voted!" }, { status: 403 });
    }

    await query({
      query: "INSERT INTO poll_votes (post_id, option_index, user_ip) VALUES (?, ?, ?)",
      values: [id, option_index, ip] as never[],
    });

    return NextResponse.json({ message: "Vote Counted!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: To fetch results
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const votes = await query({
      query: "SELECT option_index, COUNT(*) as count FROM poll_votes WHERE post_id = ? GROUP BY option_index",
      values: [id] as never[],
    }) as any[];
    return NextResponse.json(votes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}