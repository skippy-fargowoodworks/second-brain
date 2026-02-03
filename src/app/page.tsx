import { prisma } from "@/lib/db";
import { Card, StatCard } from "@/components/Card";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [tasks, notes] = await Promise.all([
    prisma.task.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.note.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const criticalTasks = tasks.filter((t) => t.priority === "critical").length;

  return {
    totalTasks: tasks.length,
    inProgressTasks,
    criticalTasks,
    totalNotes: notes.length,
    recentTasks: tasks.slice(0, 5),
    recentNotes: notes.slice(0, 2),
  };
}

export default async function Dashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-2">Welcome back. Here is your recent activity.</p>
        </div>
        <div className="hidden min-[900px]:flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
          Workspace
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          Active
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatCard title="Total Tasks" value={stats.totalTasks} iconName="CheckSquare" color="blue" />
        <StatCard title="In Progress" value={stats.inProgressTasks} iconName="Clock" color="purple" />
        <StatCard title="Critical" value={stats.criticalTasks} iconName="AlertTriangle" color="yellow" />
        <StatCard title="Notes" value={stats.totalNotes} iconName="FileText" color="green" />
      </div>

      {/* Recent Tasks */}
      <Card>
        <div className="flex items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">Top priorities</p>
          </div>
          <Link href="/tasks" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">View all</Link>
        </div>
        <div className="space-y-6">
          {stats.recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate">{task.title}</p>
                <p className="text-xs text-slate-500 mt-1">{task.category}</p>
              </div>
              <span className={`px-3 py-1 text-[11px] uppercase tracking-[0.2em] rounded-full border border-white/10 ${
                task.priority === "critical" ? "badge-critical" :
                task.priority === "high" ? "badge-high" : "badge-medium"
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Notes */}
      <Card>
        <div className="flex items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Notes</h2>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">Knowledge base</p>
          </div>
          <Link href="/notes" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">View all</Link>
        </div>
        <div className="space-y-6">
          {stats.recentNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
            >
              <p className="font-medium text-sm text-white">{note.title}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{note.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
