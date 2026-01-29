import { prisma } from "@/lib/db";
import { Card, StatCard } from "@/components/Card";
import Link from "next/link";

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
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard title="Total Tasks" value={stats.totalTasks} iconName="CheckSquare" color="blue" />
        <StatCard title="In Progress" value={stats.inProgressTasks} iconName="Clock" color="purple" />
        <StatCard title="Critical" value={stats.criticalTasks} iconName="AlertTriangle" color="yellow" />
        <StatCard title="Notes" value={stats.totalNotes} iconName="FileText" color="green" />
      </div>

      {/* Recent Tasks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Tasks</h2>
          <Link href="/tasks" className="text-sm text-blue-400">View all</Link>
        </div>
        <div className="space-y-2">
          {stats.recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex-1 min-w-0 mr-3">
                <p className="font-medium text-sm truncate">{task.title}</p>
                <p className="text-xs text-gray-500">{task.category}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Notes</h2>
          <Link href="/notes" className="text-sm text-blue-400">View all</Link>
        </div>
        <div className="space-y-2">
          {stats.recentNotes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-800/50 rounded-lg">
              <p className="font-medium text-sm">{note.title}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{note.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
