import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import type { Note, Task } from "@prisma/client";

type ContextTask = Pick<Task, "id" | "title" | "status" | "priority" | "category" | "updatedAt">;
type ContextNote = Pick<Note, "id" | "title" | "content" | "category" | "updatedAt">;

// Returns a summary of recent context for Skippy's memory sync
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  
  // Get recent tasks
  const tasks: ContextTask[] = await prisma.task.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      category: true,
      updatedAt: true,
    },
  });
  
  // Get recent notes
  const notes: ContextNote[] = await prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      updatedAt: true,
    },
  });
  
  // Get current status
  let status = { status: "idle", lastUpdated: null, currentTask: null };
  try {
    const statusFile = join(process.cwd(), "status.json");
    const data = await readFile(statusFile, "utf-8");
    status = JSON.parse(data);
  } catch {
    // No status file yet
  }
  
  // Get active/in-progress tasks
  const activeTasks = tasks.filter((t: ContextTask) => 
    t.status === "in-progress" || t.status === "in_progress"
  );
  
  // Get critical tasks
  const criticalTasks = tasks.filter((t: ContextTask) => t.priority === "critical");
  
  return NextResponse.json({
    status,
    summary: {
      totalTasks: tasks.length,
      activeTasks: activeTasks.length,
      criticalTasks: criticalTasks.length,
      totalNotes: notes.length,
    },
    activeTasks,
    criticalTasks,
    recentTasks: tasks.slice(0, 5),
    recentNotes: notes.slice(0, 3).map((n: ContextNote) => ({
      ...n,
      content: n.content?.substring(0, 200) + (n.content && n.content.length > 200 ? "..." : ""),
    })),
    lastUpdated: new Date().toISOString(),
  });
}
