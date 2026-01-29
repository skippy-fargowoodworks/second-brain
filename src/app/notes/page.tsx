"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Plus, FileText, Search, Folder, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
}

const categoryColors: Record<string, string> = {
  general: "bg-gray-500/20 text-gray-400",
  projects: "bg-blue-500/20 text-blue-400",
  ideas: "bg-purple-500/20 text-purple-400",
  reference: "bg-green-500/20 text-green-400",
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ title: "", content: "", category: "general", tags: "" });
    setShowForm(false);
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    if (selectedNote?.id === id) setSelectedNote(null);
    fetchNotes();
  };

  const filteredNotes = notes
    .filter((note) => filter === "all" || note.category === filter)
    .filter((note) => {
      if (!searchQuery) return true;
      return (
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Notes</h1>
          <p className="text-gray-400 mt-1">Your knowledge base</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-xl text-white font-medium hover:shadow-glow transition-shadow"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-glass border border-glass-border focus:border-primary-500 outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-gray-400" />
          {["all", "general", "projects", "ideas", "reference"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-primary-500/20 text-primary-400"
                  : "bg-glass text-gray-400 hover:text-white"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl m-4" hover={false}>
            <h2 className="text-xl font-bold mb-4">New Note</h2>
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
                <label className="block text-sm text-gray-400 mb-1">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  placeholder="Write your note here... (Markdown supported)"
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  >
                    <option value="general">General</option>
                    <option value="projects">Projects</option>
                    <option value="ideas">Ideas</option>
                    <option value="reference">Reference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., important, review"
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  />
                </div>
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
                  Save Note
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <Card hover={false} className="col-span-full">
            <p className="text-center text-gray-500 py-8">No notes found</p>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="group cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent-400" />
                  <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[note.category]}`}>
                    {note.category}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-medium mb-2">{note.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-3">{note.content}</p>
              <p className="text-xs text-gray-600 mt-3">
                {format(new Date(note.updatedAt), "MMM d, yyyy")}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl m-4 max-h-[80vh] overflow-auto" hover={false}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[selectedNote.category]}`}>
                  {selectedNote.category}
                </span>
                <h2 className="text-2xl font-bold mt-2">{selectedNote.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Updated {format(new Date(selectedNote.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-300">{selectedNote.content}</pre>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
