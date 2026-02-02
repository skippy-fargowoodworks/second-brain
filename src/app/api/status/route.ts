import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const STATUS_FILE = join(process.cwd(), "status.json");

interface StatusData {
  status: "working" | "idle";
  lastUpdated: string;
  currentTask?: string;
}

async function getStatus(): Promise<StatusData> {
  try {
    const data = await readFile(STATUS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { status: "idle", lastUpdated: new Date().toISOString() };
  }
}

async function setStatus(status: StatusData): Promise<void> {
  await writeFile(STATUS_FILE, JSON.stringify(status, null, 2));
}

export async function GET() {
  const data = await getStatus();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data: StatusData = {
    status: body.status || "idle",
    lastUpdated: new Date().toISOString(),
    currentTask: body.currentTask,
  };
  await setStatus(data);
  return NextResponse.json({ ...data, message: "Status updated successfully" });
}
