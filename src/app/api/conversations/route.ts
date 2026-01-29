import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(conversations);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const conversation = await prisma.conversation.create({
    data: {
      title: body.title,
      participants: body.participants,
      summary: body.summary,
      decisions: body.decisions,
      linkedTasks: body.linkedTasks,
      date: body.date ? new Date(body.date) : new Date(),
    },
  });
  return NextResponse.json(conversation);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const conversation = await prisma.conversation.update({
    where: { id: body.id },
    data: {
      title: body.title,
      participants: body.participants,
      summary: body.summary,
      decisions: body.decisions,
      linkedTasks: body.linkedTasks,
      date: body.date ? new Date(body.date) : undefined,
    },
  });
  return NextResponse.json(conversation);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  await prisma.conversation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
