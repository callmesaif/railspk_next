import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await query({
      query: "SELECT * FROM community_posts ORDER BY created_at DESC",
      values: [],
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Destructuring with default values to avoid 'undefined'
    const { 
      title = "", 
      content = "", 
      image_url = null, 
      is_poll = 0, 
      poll_options = null 
    } = body;

    const result = await query({
      query: `INSERT INTO community_posts
              (title, content, image_url, is_poll, poll_options, admin_reply)
              VALUES (?, ?, ?, ?, ?, ?)`,
      values: [
        title,
        content,
        image_url || null,
        is_poll ? 1 : 0,
        poll_options || null,
        null // Admin reply initially null
      ] as never[], // Cast to never[] to match expected type
    }) as any;

    return NextResponse.json({ id: result.insertId, message: "Post Published!" });
  } catch (error: any) {
    console.error("POST API ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}