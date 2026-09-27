'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PublicProfile {
  id: string;
  name: string;
  slug: string;
  client_name: string;
  description: string;
  project_type: string;
  primary_domain: string;
  domain_verified: boolean;
  staging_url: string;
  docs_url: string;
  github_repo_url: string;
  github_stats: {
    stars: number;
    forks: number;
    open_issues: number;
    commits: number;
    license: string;
  };
  health_scores: {
    architecture: number;
    security: number;
    product: number;
    growth: number;
    seo: number;
  };
  outlook: {
    technical_readiness: number;
    market_evidence: number;
    launch_verdict: string;
    risk_index: string;
  };
  team: Array<{
    role: string;
    name: string;
    avatar: string;
    color: string;
  }>;
  published_sessions_count: number;
  published_sessions: Array<{
    id: string;
    session_code: string;
    session_number: number;
    topic: string;
    consensus_summary: string | null;
    disagreements: Array<{ topic: string; summary: string }>;
    active_agents: string[];
    outlook: Record<string, any>;
    published_at: string;
  }>;
  decisions: Array<{
    id: string;
    topic: string;
    summary: string;
    tradeoffs: string[];
    participating_agents: string[];
    created_at: string;
  }>;
  public_roadmap_questions: Array<{
    id: string;
    question: string;
    severity: string;
    status: string;
  }>;
  visual_evidence: Array<{
    id: string;
    title: string;
    category: string;
    file_url: string;
    analysis: string;
    tags: string[];
    created_at: string;
  }>;
}

export default function PublicProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ask Public Council State
  const [visitorQuestion, setVisitorQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<
    Array<{
      question: string;
      answer: string;
      source: string;
      timestamp: string;
    }>
  >([]);

  // Selected session for viewing
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:41661/api/projects/${slug}/public-profile`);
        if (!res.ok) {
          throw new Error('Project not found or private');
        }
        const data = await res.json();
        setProfile(data);
        if (data.published_sessions && data.published_sessions.length > 0) {
          setSelectedSession(data.published_sessions[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load public profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [slug]);

  const handleAskPublic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorQuestion.trim() || asking) return;

    setAsking(true);
    try {
      const res = await fetch(`http://127.0.0.1:41661/api/projects/${slug}/ask-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: visitorQuestion }),
      });
      if (res.ok) {
        const data = await res.json();
        setQaHistory((prev) => [
          {
            question: data.question,
            answer: data.answer,
            source: data.source_citation,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
        setVisitorQuestion('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Verifying Public Airgap Records...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl mb-4">
          🛡️
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Project Profile Unavailable</h1>
        <p className="text-slate-400 max-w-md text-sm mb-6">
          This project does not exist, has not been published to the public registry, or is protected by private enterprise airgaps.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
        >
          Return to Council Dashboard
        </Link>
      </div>
    );
  }

  // JSON-LD structured data schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: profile.name,
    description: profile.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Cloud / Next.js / FastAPI',
    url: profile.primary_domain || `https://botdigit.com/p/${profile.slug}`,
    author: {
      '@type': 'Organization',
      name: profile.client_name,
    },
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-indigo-500 selection:text-white pb-24">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <span>←</span>
              <span>Council Console</span>
            </Link>
            <span className="text-slate-700">/</span>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                Public Airgap Profile
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <span>🛡️</span>
              <span>Source Code & Secrets Redacted</span>
            </div>
            {profile.primary_domain && (
              <a
                href={profile.primary_domain}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <span>Visit Live App</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-12 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-[#070a12]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                  {profile.client_name}
                </span>
                {profile.domain_verified && (
                  <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center space-x-1">
                    <span>✓</span>
                    <span>Domain Verified</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
                  {profile.project_type.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono">
                  {profile.published_sessions_count} Public Sessions
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {profile.name}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {profile.description || 'Continuous multi-agent architectural debate, verified evidence graph, and autonomous project execution.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
                {profile.github_repo_url && (
                  <a
                    href={profile.github_repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition"
                  >
                    <span>🐙 GitHub: {profile.github_repo_url.replace('https://github.com/', '')}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-amber-400">★ {profile.github_stats.stars}</span>
                    <span className="text-emerald-400">⑂ {profile.github_stats.forks}</span>
                    <span className="text-indigo-400">{profile.github_stats.commits} commits</span>
                  </a>
                )}
                {profile.primary_domain && (
                  <a
                    href={profile.primary_domain}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 transition"
                  >
                    <span>🌐</span>
                    <span>{profile.primary_domain}</span>
                  </a>
                )}
                {profile.docs_url && (
                  <a
                    href={profile.docs_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 transition"
                  >
                    <span>📚</span>
                    <span>Documentation</span>
                  </a>
                )}
              </div>
            </div>

            {/* Health & Outlook Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md w-full lg:w-80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Health & Outlook
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {profile.outlook.launch_verdict || 'Active'}
                </span>
              </div>

              <div className="space-y-2.5">
                {Object.entries(profile.health_scores).map(([metric, score]) => (
                  <div key={metric} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="capitalize text-slate-400">{metric}</span>
                      <span className="font-semibold text-slate-200">{score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Technical Readiness</span>
                <span className="text-emerald-400 font-bold">{profile.outlook.technical_readiness}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Interactive Public AI Inquiry & Published Sessions */}
        <div className="lg:col-span-8 space-y-10">
          {/* Ask Public Council Box */}
          <div className="bg-gradient-to-b from-indigo-950/30 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-600/30">
                💬
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ask the Public AI Council</h3>
                <p className="text-xs text-slate-400">
                  Query architectural decisions, roadmap, and security posture. Constrained strictly to sanitized public records.
                </p>
              </div>
            </div>

            <form onSubmit={handleAskPublic} className="flex gap-2">
              <input
                type="text"
                value={visitorQuestion}
                onChange={(e) => setVisitorQuestion(e.target.value)}
                placeholder="e.g. What is the database architecture and scaling strategy?"
                className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition"
              />
              <button
                type="submit"
                disabled={asking || !visitorQuestion.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition whitespace-nowrap shadow-lg shadow-indigo-600/20"
              >
                {asking ? 'Synthesizing...' : 'Ask Council'}
              </button>
            </form>

            {/* Q&A Stream */}
            {qaHistory.length > 0 && (
              <div className="mt-5 space-y-3 pt-4 border-t border-slate-800/80">
                {qaHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span className="font-semibold text-indigo-400">Q: {item.question}</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{item.answer}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono border-t border-slate-900">
                      <span>Verified Citation: {item.source}</span>
                      <span className="text-emerald-400">✓ Airgap Protected</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sanitized Published Sessions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Sanitized Council Sessions</h2>
                <p className="text-xs text-slate-400">
                  Publicly ratified debates with internal code and secret credentials cleanly stripped.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {profile.published_sessions.length} Published
              </span>
            </div>

            {profile.published_sessions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                No council sessions have been published for this project yet.
              </div>
            ) : (
              <div className="space-y-3">
                {profile.published_sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-5 rounded-2xl border cursor-pointer transition ${
                      selectedSession?.id === session.id
                        ? 'bg-slate-900 border-indigo-500/60 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {session.session_code}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-200">{session.topic}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(session.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    {session.consensus_summary && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                        {session.consensus_summary}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <span>Participants:</span>
                        {session.active_agents.map((ag) => (
                          <span
                            key={ag}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 capitalize text-[10px]"
                          >
                            {ag}
                          </span>
                        ))}
                      </div>
                      <span className="text-emerald-400">View Public Verdict →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ratified Architectural Decisions (ADRs) */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white">Ratified Architectural Decisions</h2>
              <p className="text-xs text-slate-400">
                Official architecture decisions ratified by the multi-agent council.
              </p>
            </div>

            {profile.decisions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                No architectural decisions recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.decisions.map((dec) => (
                  <div
                    key={dec.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Ratified
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {dec.created_at ? new Date(dec.created_at).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{dec.topic}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{dec.summary}</p>
                    {dec.tradeoffs && dec.tradeoffs.length > 0 && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <span className="font-mono text-slate-500 uppercase text-[10px]">
                          Tradeoffs Accepted:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                          {dec.tradeoffs.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visual Proof & Architecture Gallery */}
          {profile.visual_evidence && profile.visual_evidence.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white">Visual Proof & Inspection Gallery</h2>
                <p className="text-xs text-slate-400">
                  Screenshots, system architecture diagrams, and verified performance captures.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.visual_evidence.map((ve) => (
                  <div
                    key={ve.id}
                    className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden group hover:border-slate-700 transition"
                  >
                    <div className="h-44 bg-slate-950 overflow-hidden relative">
                      <img
                        src={ve.file_url}
                        alt={ve.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-300">
                        {ve.category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-xs font-bold text-white">{ve.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{ve.analysis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): AI Council Squad & Public Roadmap */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active AI Council Squad */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>🤖</span>
              <span>Project AI Council Squad</span>
            </h3>
            <p className="text-xs text-slate-400">
              The continuous intelligence team maintaining architectural hygiene and debate records.
            </p>

            <div className="space-y-2.5">
              {profile.team.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <span className="text-xl">{member.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{member.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">{member.role}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Public Roadmap & Unresolved Questions */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>🎯</span>
              <span>Open Roadmap Questions</span>
            </h3>
            <p className="text-xs text-slate-400">
              Questions actively queued for upcoming AI Council deliberation sessions.
            </p>

            {profile.public_roadmap_questions.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">Zero pending critical blockers.</p>
            ) : (
              <div className="space-y-2.5">
                {profile.public_roadmap_questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-400 uppercase font-semibold">[{q.severity}]</span>
                      <span className="text-slate-500 uppercase">{q.status}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{q.question}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Airgap Verification Seal */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/30 border border-indigo-500/20 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <h4 className="text-xs font-bold text-white">BotDigit Airgap Verified</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every item on this public profile has been cryptographically confirmed and sanitized against source code exfiltration policies.
            </p>
            <div className="pt-2 text-[10px] font-mono text-indigo-400">
              Protocol: AIVEX-AIRGAP-v1.4
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
