import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  
  if (!query) {
    return NextResponse.json({ tasks: [], notes: [], conversations: [], credentials: [] });
  }

  const searchTerm = query.toLowerCase();

  const [tasks, notes, conversations, credentials] = await Promise.all([
    prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { category: { contains: searchTerm } },
          { tags: { contains: searchTerm } },
        ],
      },
    }),
    prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { content: { contains: searchTerm } },
          { category: { contains: searchTerm } },
          { tags: { contains: searchTerm } },
        ],
      },
    }),
    prisma.conversation.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { summary: { contains: searchTerm } },
          { participants: { contains: searchTerm } },
          { decisions: { contains: searchTerm } },
        ],
      },
    }),
    prisma.credential.findMany({
      where: {
        OR: [
          { service: { contains: searchTerm } },
          { username: { contains: searchTerm } },
          { notes: { contains: searchTerm } },
        ],
      },
    }),
  ]);

  return NextResponse.json({ tasks, notes, conversations, credentials });
}
