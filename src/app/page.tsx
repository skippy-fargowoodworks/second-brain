import { prisma } from "@/lib/db";
import { Card, StatCard } from "@/components/Card";
import { Zap, FileText, MessageSquare, Key } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [tasks, notes, conversations, credentials] = await Promise.all([
    prisma.task.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.note.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.conversation.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.credential.findMany(),
  ]);

  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const criticalTasks = tasks.filter((t) => t.priority === "critical").length;

  return {
    totalTasks: tasks.length,
    inProgressTasks,
    criticalTasks,
    totalNotes: notes.length,
    recentTasks: tasks.slice(0, 5),
    recentNotes: notes.slice(0, 3),
  };
}

export default async function Dashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6 2xl:space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl 2xl:text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm 2xl:text-base">
          Welcome back. Here&apos;s your overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 2xl:grid-cols-4 gap-3 2xl:gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          iconName="CheckSquare"
          color="primary"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressTasks}
          iconName="Clock"
          color="accent"
        />
        <StatCard
          title="Critical"
          value={stats.criticalTasks}
          iconName="AlertTriangle"
          color="warning"
        />
        <StatCard
          title="Notes"
          value={stats.totalNotes}
          iconName="FileText"
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg 2xl:text-xl font-semibold mb-3 2xl:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-3 2xl:gap-4">
          <Link href="/tasks">
            <Card className="group">
              <div className="flex items-center gap-2 2xl:gap-3">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                  <Zap className="w-4 h-4 2xl:w-5 2xl:h-5 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-sm 2xl:text-base">Tasks</p>
                  <p className="text-xs 2xl:text-sm text-gray-400">View all</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/notes">
            <Card className="group">
              <div className="flex items-center gap-2 2xl:gap-3">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-accent-500/20 flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
                  <FileText className="w-4 h-4 2xl:w-5 2xl:h-5 text-accent-400" />
                </div>
                <div>
                  <p className="font-medium text-sm 2xl:text-base">Notes</p>
                  <p className="text-xs 2xl:text-sm text-gray-400">View all</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/conversations">
            <Card className="group">
              <div className="flex items-center gap-2 2xl:gap-3">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <MessageSquare className="w-4 h-4 2xl:w-5 2xl:h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-sm 2xl:text-base">Conversations</p>
                  <p className="text-xs 2xl:text-sm text-gray-400">View all</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/vault">
            <Card className="group">
              <div className="flex items-center gap-2 2xl:gap-3">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                  <Key className="w-4 h-4 2xl:w-5 2xl:h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-sm 2xl:text-base">Vault</p>
                  <p className="text-xs 2xl:text-sm text-gray-400">Credentials</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 2xl:gap-6">
        {/* Recent Tasks */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-3 2xl:mb-4">
            <h3 className="font-semibold text-base 2xl:text-lg">Recent Tasks</h3>
            <Link href="/tasks" className="text-xs 2xl:text-sm text-primary-400 hover:text-primary-300">
              View all
            </Link>
          </div>
          {stats.recentTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-6 2xl:py-8 text-sm">No tasks yet</p>
          ) : (
            <div className="space-y-2 2xl:space-y-3">
              {stats.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 2xl:p-3 rounded-lg bg-glass-light hover:bg-glass transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-medium text-sm 2xl:text-base truncate">{task.title}</p>
                    <p className="text-xs 2xl:text-sm text-gray-400">{task.category || "No category"}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      task.priority === "critical"
                        ? "bg-red-500/20 text-red-400"
                        : task.priority === "high"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Notes */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-3 2xl:mb-4">
            <h3 className="font-semibold text-base 2xl:text-lg">Recent Notes</h3>
            <Link href="/notes" className="text-xs 2xl:text-sm text-primary-400 hover:text-primary-300">
              View all
            </Link>
          </div>
          {stats.recentNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-6 2xl:py-8 text-sm">No notes yet</p>
          ) : (
            <div className="space-y-2 2xl:space-y-3">
              {stats.recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-2 2xl:p-3 rounded-lg bg-glass-light hover:bg-glass transition-colors"
                >
                  <p className="font-medium text-sm 2xl:text-base">{note.title}</p>
                  <p className="text-xs 2xl:text-sm text-gray-400 line-clamp-2 mt-1">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
