import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query({ query: "DELETE FROM community_posts WHERE id = ?", values: [id] as never[] });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, image_url, is_poll, poll_options, admin_reply } = body;

    await query({
      query: `UPDATE community_posts 
              SET title = COALESCE(?, title), 
                  content = COALESCE(?, content), 
                  image_url = COALESCE(?, image_url), 
                  is_poll = COALESCE(?, is_poll), 
                  poll_options = COALESCE(?, poll_options),
                  admin_reply = COALESCE(?, admin_reply)
              WHERE id = ?`,
      values: [title || null, content || null, image_url || null, is_poll !== undefined ? (is_poll ? 1 : 0) : null, poll_options || null, admin_reply || null, id] as never[],
    });

    return NextResponse.json({ message: "Updated" });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}