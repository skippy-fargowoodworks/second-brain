import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const note = await prisma.note.create({
    data: {
      title: body.title,
      content: body.content,
      category: body.category || "general",
      tags: body.tags,
    },
  });
  return NextResponse.json(note);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const note = await prisma.note.update({
    where: { id: body.id },
    data: {
      title: body.title,
      content: body.content,
      category: body.category,
      tags: body.tags,
    },
  });
  return NextResponse.json(note);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
