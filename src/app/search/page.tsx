"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Search as SearchIcon, CheckSquare, FileText, MessageSquare, Key } from "lucide-react";
import { format } from "date-fns";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    tasks: any[];
    notes: any[];
    conversations: any[];
    credentials: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const totalResults = results
    ? results.tasks.length + results.notes.length + results.conversations.length + results.credentials.length
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Search</h1>
        <p className="text-gray-400 mt-1">Find anything across your second brain</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks, notes, conversations, credentials..."
          className="w-full pl-14 pr-4 py-4 rounded-2xl bg-glass border border-glass-border focus:border-primary-500 outline-none text-lg transition-colors"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-primary rounded-xl text-white font-medium hover:shadow-glow transition-shadow disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <p className="text-gray-400">
            Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>

          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary-400" />
                Tasks ({results.tasks.length})
              </h2>
              <div className="space-y-2">
                {results.tasks.map((task) => (
                  <Card key={task.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === "done" ? "bg-green-500/20 text-green-400" :
                        task.status === "in-progress" ? "bg-blue-500/20 text-blue-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {results.notes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-400" />
                Notes ({results.notes.length})
              </h2>
              <div className="space-y-2">
                {results.notes.map((note) => (
                  <Card key={note.id}>
                    <h3 className="font-medium">{note.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{note.content}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Conversations */}
          {results.conversations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                Conversations ({results.conversations.length})
              </h2>
              <div className="space-y-2">
                {results.conversations.map((convo) => (
                  <Card key={convo.id}>
                    <h3 className="font-medium">{convo.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{convo.participants}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{convo.summary}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Credentials */}
          {results.credentials.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-400" />
                Credentials ({results.credentials.length})
              </h2>
              <div className="space-y-2">
                {results.credentials.map((cred) => (
                  <Card key={cred.id}>
                    <h3 className="font-medium">{cred.service}</h3>
                    <p className="text-sm text-gray-400">{cred.username}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <Card hover={false}>
              <p className="text-center text-gray-500 py-8">No results found</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
