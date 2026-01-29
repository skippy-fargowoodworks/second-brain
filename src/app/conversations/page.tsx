"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Plus, MessageSquare, Users, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Conversation {
  id: string;
  title: string;
  participants: string;
  summary: string;
  decisions: string | null;
  linkedTasks: string | null;
  date: string;
  createdAt: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    participants: "",
    summary: "",
    decisions: "",
    linkedTasks: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({
      title: "",
      participants: "",
      summary: "",
      decisions: "",
      linkedTasks: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    fetchConversations();
  };

  const deleteConversation = async (id: string) => {
    await fetch(`/api/conversations?id=${id}`, { method: "DELETE" });
    if (selectedConvo?.id === id) setSelectedConvo(null);
    fetchConversations();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Conversations</h1>
          <p className="text-gray-400 mt-1">Log discussions and decisions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-xl text-white font-medium hover:shadow-glow transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Log Conversation
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl m-4" hover={false}>
            <h2 className="text-xl font-bold mb-4">Log Conversation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Product Migration Discussion"
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Participants</label>
                  <input
                    type="text"
                    required
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="e.g., Jake, Skippy"
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Summary</label>
                <textarea
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  placeholder="What was discussed..."
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Decisions Made</label>
                <textarea
                  value={formData.decisions}
                  onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                  rows={3}
                  placeholder="Key decisions and action items..."
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
                  Save
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.length === 0 ? (
          <Card hover={false}>
            <p className="text-center text-gray-500 py-8">No conversations logged yet</p>
          </Card>
        ) : (
          conversations.map((convo) => (
            <Card key={convo.id} className="group" onClick={() => setSelectedConvo(convo)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{convo.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {convo.participants}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(convo.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{convo.summary}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(convo.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedConvo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl m-4" hover={false}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedConvo.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedConvo.participants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(selectedConvo.date), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedConvo(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Summary</h3>
                <p className="text-gray-300">{selectedConvo.summary}</p>
              </div>
              {selectedConvo.decisions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Decisions Made</h3>
                  <p className="text-gray-300">{selectedConvo.decisions}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
