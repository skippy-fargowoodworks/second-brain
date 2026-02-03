import { prisma } from "@/lib/db";
import type { Note } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Quick capture endpoint for logging thoughts, decisions, and events
// Simpler than full task/note creation - just text + optional type
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }
  
  const type = body.type || "note"; // note, decision, thought, event
  const source = body.source || "skippy";
  
  // Create as a note with special category for quick captures
  const note = await prisma.note.create({
    data: {
      title: body.title || `Quick Capture - ${new Date().toLocaleString()}`,
      content: body.text,
      category: `capture:${type}`,
      tags: JSON.stringify({
        type,
        source,
        timestamp: new Date().toISOString(),
        ...(body.metadata || {}),
      }),
    },
  });
  
  return NextResponse.json({
    success: true,
    id: note.id,
    type,
    message: `Captured ${type} successfully`,
  });
}

// GET recent captures
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type"); // filter by type
  
  const captures = await prisma.note.findMany({
    where: {
      category: type ? `capture:${type}` : { startsWith: "capture:" },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  
  return NextResponse.json(captures.map((c: Note) => ({
    id: c.id,
    title: c.title,
    content: c.content,
    type: c.category?.replace("capture:", ""),
    metadata: c.tags ? JSON.parse(c.tags) : {},
    createdAt: c.createdAt,
  })));
}
