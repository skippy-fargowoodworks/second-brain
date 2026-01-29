"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import {
  Plus,
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
} from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  category: string | null;
  tags: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  todo: "bg-gray-500/20 text-gray-400",
  "in-progress": "bg-blue-500/20 text-blue-400",
  done: "bg-green-500/20 text-green-400",
  blocked: "bg-red-500/20 text-red-400",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/20 text-gray-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400",
};

const statusIcons: Record<string, React.ElementType> = {
  todo: CheckSquare,
  "in-progress": Clock,
  done: CheckCircle,
  blocked: XCircle,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    category: "",
    tags: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      category: "",
      tags: "",
    });
    setShowForm(false);
    fetchTasks();
  };

  const updateTaskStatus = async (id: string, status: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      return task.status === filter;
    })
    .filter((task) => {
      if (!searchQuery) return true;
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Tasks</h1>
          <p className="text-gray-400 mt-1">Manage your tasks and to-dos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-xl text-white font-medium hover:shadow-glow transition-shadow"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-glass border border-glass-border focus:border-primary-500 outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          {["all", "todo", "in-progress", "done", "blocked"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary-500/20 text-primary-400"
                  : "bg-glass text-gray-400 hover:text-white"
              }`}
            >
              {status === "all" ? "All" : status.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-lg m-4" hover={false}>
            <h2 className="text-xl font-bold mb-4">New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Migration, Development"
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., urgent, backend, review"
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-glass border border-glass-border hover:bg-glass-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-glow transition-shadow"
                >
                  Create Task
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card hover={false}>
            <p className="text-center text-gray-500 py-8">No tasks found</p>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const StatusIcon = statusIcons[task.status] || CheckSquare;
            return (
              <Card key={task.id} className="group">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task.id,
                        task.status === "done" ? "todo" : "done"
                      )
                    }
                    className={`mt-1 p-2 rounded-lg transition-colors ${statusColors[task.status]}`}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`font-medium ${
                            task.status === "done" ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          {task.category && (
                            <span className="px-2 py-0.5 rounded text-xs bg-accent-500/20 text-accent-400">
                              {task.category}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due: {format(new Date(task.dueDate), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
