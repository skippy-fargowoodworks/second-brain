"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { Plus, Key, Eye, EyeOff, Copy, ExternalLink, Trash2, Check } from "lucide-react";

interface Credential {
  id: string;
  service: string;
  username: string;
  password: string;
  url: string | null;
  notes: string | null;
  createdAt: string;
}

export default function VaultPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    const res = await fetch("/api/credentials");
    const data = await res.json();
    setCredentials(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ service: "", username: "", password: "", url: "", notes: "" });
    setShowForm(false);
    fetchCredentials();
  };

  const deleteCredential = async (id: string) => {
    if (!confirm("Are you sure you want to delete this credential?")) return;
    await fetch(`/api/credentials?id=${id}`, { method: "DELETE" });
    fetchCredentials();
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskPassword = (password: string) => "•".repeat(password.length);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Vault</h1>
          <p className="text-gray-400 mt-1">Secure credential storage</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-xl text-white font-medium hover:shadow-glow transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Add Credential
        </button>
      </div>

      {/* Warning */}
      <Card hover={false} className="border-yellow-500/30 bg-yellow-500/5">
        <div className="flex items-center gap-3 text-yellow-400">
          <Key className="w-5 h-5" />
          <p className="text-sm">
            Passwords are stored locally. For production use, implement proper encryption.
          </p>
        </div>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-lg m-4" hover={false}>
            <h2 className="text-xl font-bold mb-4">Add Credential</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="e.g., GitHub, Shopify"
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username / Email</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL (optional)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg bg-glass border border-glass-border focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any additional info..."
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

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {credentials.length === 0 ? (
          <Card hover={false} className="col-span-full">
            <p className="text-center text-gray-500 py-8">No credentials stored yet</p>
          </Card>
        ) : (
          credentials.map((cred) => (
            <Card key={cred.id} className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Key className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{cred.service}</h3>
                    <p className="text-sm text-gray-400">{cred.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteCredential(cred.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Password field */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-glass">
                <code className="flex-1 font-mono text-sm">
                  {visiblePasswords.has(cred.id) ? cred.password : maskPassword(cred.password)}
                </code>
                <button
                  onClick={() => togglePasswordVisibility(cred.id)}
                  className="p-1.5 rounded hover:bg-glass-light transition-colors text-gray-400 hover:text-white"
                >
                  {visiblePasswords.has(cred.id) ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(cred.password, cred.id)}
                  className="p-1.5 rounded hover:bg-glass-light transition-colors text-gray-400 hover:text-white"
                >
                  {copiedId === cred.id ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* URL */}
              {cred.url && (
                <a
                  href={cred.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 mt-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  {new URL(cred.url).hostname}
                </a>
              )}

              {/* Notes */}
              {cred.notes && (
                <p className="text-sm text-gray-500 mt-2">{cred.notes}</p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
