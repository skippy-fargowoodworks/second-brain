import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const credentials = await prisma.credential.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(credentials);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const credential = await prisma.credential.create({
    data: {
      service: body.service,
      username: body.username,
      password: body.password,
      url: body.url,
      notes: body.notes,
    },
  });
  return NextResponse.json(credential);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const credential = await prisma.credential.update({
    where: { id: body.id },
    data: {
      service: body.service,
      username: body.username,
      password: body.password,
      url: body.url,
      notes: body.notes,
    },
  });
  return NextResponse.json(credential);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  await prisma.credential.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
