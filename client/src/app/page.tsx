'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Shield,
  Activity,
  GitBranch,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ExternalLink,
  Lock,
  Globe,
  Sparkles,
  ChevronRight,
  ClipboardCopy,
  Layers,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';

interface AgentMessage {
  agent: string;
  title: string;
  avatar: string;
  color: string;
  classification: 'FACT' | 'INFERENCE' | 'OPINION' | 'SCENARIO';
  content: string;
  evidence_ref?: string | null;
  confidence: number;
}

interface ProjectOutlook {
  technical_readiness: number;
  market_evidence: number;
  distribution_readiness: number;
  risk_index: string;
  launch_verdict: string;
  consensus_summary: string;
}

interface TaskItem {
  id: string;
  title: string;
  assigned_agent: string;
  priority: string;
  status: string;
}

const PRESET_TOPICS = [
  'Should we launch this marketplace now?',
  'Security & OWASP audit of authentication endpoints',
  'Organic acquisition loops & SEO indexability review',
  'Database scalability & connection pool limits under 500 req/s',
];

export default function CouncilDashboard() {
  const [selectedProject, setSelectedProject] = useState({
    id: 'proj_default',
    name: 'BotDigit Marketplace',
    client_name: 'BotDigit Labs',
    github_url: 'https://github.com/botdigit/marketplace',
    is_public: false,
  });

  const [topic, setTopic] = useState(PRESET_TOPICS[0]);
  const [isDebating, setIsDebating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [outlook, setOutlook] = useState<ProjectOutlook | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 't1',
      title: 'Implement 1-click template onboarding flow',
      assigned_agent: 'product',
      priority: 'critical',
      status: 'proposed',
    },
    {
      id: 't2',
      title: 'Add Redis token-bucket rate limiter to /api/auth',
      assigned_agent: 'security',
      priority: 'critical',
      status: 'proposed',
    },
    {
      id: 't3',
      title: 'Configure PgBouncer connection pool layer',
      assigned_agent: 'engineering',
      priority: 'high',
      status: 'proposed',
    },
  ]);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial mock seed
  useEffect(() => {
    triggerCouncilDebate(PRESET_TOPICS[0]);
  }, []);

  const triggerCouncilDebate = async (targetTopic: string) => {
    setIsDebating(true);
    setMessages([]);
    setCurrentRound(1);
    setOutlook(null);

    try {
      // Attempt backend SSE stream
      const res = await fetch('http://127.0.0.1:41661/api/projects/proj_default/debates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: targetTopic }),
      });

      if (res.ok) {
        const data = await res.json();
        const eventSource = new EventSource(`http://127.0.0.1:41661/api/debates/${data.debate_id}/stream`);

        eventSource.addEventListener('round_start', (e: any) => {
          const payload = JSON.parse(e.data);
          setCurrentRound(payload.round);
        });

        eventSource.addEventListener('agent_message', (e: any) => {
          const msg = JSON.parse(e.data);
          setMessages((prev) => [...prev, msg]);
        });

        eventSource.addEventListener('outlook_summary', (e: any) => {
          const out = JSON.parse(e.data);
          setOutlook(out);
        });

        eventSource.addEventListener('debate_done', () => {
          setIsDebating(false);
          eventSource.close();
        });

        eventSource.onerror = () => {
          eventSource.close();
          fallbackLocalSim(targetTopic);
        };
      } else {
        fallbackLocalSim(targetTopic);
      }
    } catch {
      fallbackLocalSim(targetTopic);
    }
  };

  const fallbackLocalSim = (targetTopic: string) => {
    // Zero-config instant agency simulation
    const simulatedMessages: AgentMessage[] = [
      {
        agent: 'product',
        title: 'Product Manager',
        avatar: '👨‍💼',
        color: 'blue',
        classification: 'FACT',
        content: `Analyzing '${selectedProject.name}': The initial onboarding flow contains 5 configuration screens before users experience product value.`,
        evidence_ref: 'docs/onboarding.md#L30-L55',
        confidence: 0.95,
      },
      {
        agent: 'engineering',
        title: 'Senior Engineer',
        avatar: '🧑‍💻',
        color: 'emerald',
        classification: 'FACT',
        content: 'Core automated test suite reports 82% coverage. However, third-party webhook retry logic lacks unit tests.',
        evidence_ref: 'tests/integration/test_webhooks.py',
        confidence: 0.91,
      },
      {
        agent: 'security',
        title: 'Security Specialist',
        avatar: '🔐',
        color: 'rose',
        classification: 'INFERENCE',
        content: 'The public API gateway has no active token-bucket rate limiter. An automated scrape could exhaust worker connection pools.',
        evidence_ref: 'server/app/main.py#L40',
        confidence: 0.88,
      },
      {
        agent: 'growth',
        title: 'Growth Lead',
        avatar: '📈',
        color: 'amber',
        classification: 'OPINION',
        content: 'Launching without an organic invite loop or automated referral incentive will result in a flatlined post-launch retention curve.',
        evidence_ref: null,
        confidence: 0.82,
      },
      {
        agent: 'skeptic',
        title: 'Skeptic / Red Team',
        avatar: '🕵️',
        color: 'purple',
        classification: 'SCENARIO',
        content: 'If we launch today, we risk burning early waitlist enthusiasm. 70% of early adopters churn permanently if initial friction exceeds 2 minutes.',
        evidence_ref: null,
        confidence: 0.86,
      },
      {
        agent: 'moderator',
        title: 'Chief AI / Moderator',
        avatar: '🧠',
        color: 'indigo',
        classification: 'OPINION',
        content: 'Consensus reached: Do NOT launch publicly today. Execute a 72-hour hardening sprint: (1) Simplify onboarding to 1-click template, (2) Add Redis rate limiting on auth endpoints, (3) Raise connection pool limit.',
        evidence_ref: null,
        confidence: 0.96,
      },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < simulatedMessages.length) {
        const nextMsg = simulatedMessages[i];
        if (nextMsg) {
          setMessages((prev) => [...prev, nextMsg]);
        }
        i++;
      } else {
        clearInterval(interval);
        setIsDebating(false);
        setOutlook({
          technical_readiness: 78,
          market_evidence: 54,
          distribution_readiness: 42,
          risk_index: 'medium',
          launch_verdict: 'Conditional 72-Hour Hold',
          consensus_summary: 'Delay public launch for 72 hours to implement 1-click template onboarding and Redis rate limiting.',
        });
      }
    }, 450);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'approved' ? 'done' : 'approved' }
          : t
      )
    );
  };

  const copyExecutiveSummary = () => {
    if (!outlook) return;
    const text = `BOTDIGIT AI COUNCIL — EXECUTIVE PROJECT AUDIT
Project: ${selectedProject.name}
Verdict: ${outlook.launch_verdict}
Consensus: ${outlook.consensus_summary}
Technical Readiness: ${outlook.technical_readiness}%
Market Evidence: ${outlook.market_evidence}%
Risk Index: ${outlook.risk_index.toUpperCase()}
Generated by BotDigit AI Council (council.botdigit.site)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (classification: string) => {
    switch (classification) {
      case 'FACT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'INFERENCE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'OPINION':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'SCENARIO':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#090e1a]/90 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              BC
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white">BotDigit AI Council</span>
              <span className="ml-2 text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Agency Edition
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Project Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-slate-400">Client:</span>
            <span className="font-medium text-slate-200">{selectedProject.client_name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-indigo-400">{selectedProject.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Public / Private Toggle */}
          <button
            onClick={() =>
              setSelectedProject((prev) => ({ ...prev, is_public: !prev.is_public }))
            }
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
              selectedProject.is_public
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {selectedProject.is_public ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public SEO Snapshot Active</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Private Workspace</span>
              </>
            )}
          </button>

          <a
            href={selectedProject.github_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub Connected</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Council Discussion Room (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Topic Selector & Convene Bar */}
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Council Agenda & Strategic Prompt
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                6 Agents Available
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ask council a question..."
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                onClick={() => triggerCouncilDebate(topic)}
                disabled={isDebating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
              >
                {isDebating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Deliberating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Convene Council</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_TOPICS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(p);
                    triggerCouncilDebate(p);
                  }}
                  className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-md transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Live Council Room */}
          <div className="glass-panel flex-1 rounded-xl p-5 flex flex-col min-h-[500px] border border-slate-800/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h2 className="font-semibold text-sm tracking-wide text-white">Live Council Room</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Round {currentRound} of 4
                </span>
                <span>{messages.length} Statements Tagged</span>
              </div>
            </div>

            {/* Chat Transcript */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[520px]">
              {messages
                .filter((m): m is AgentMessage => Boolean(m && typeof m === 'object'))
                .map((m, idx) => {
                  const avatar = m.avatar || '🤖';
                  const title = m.title || 'Council Agent';
                  const classification = m.classification || 'OPINION';
                  return (
                    <div
                      key={idx}
                      className="glass-card rounded-lg p-3.5 border border-slate-800/60 hover:border-slate-700/80 transition"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{avatar}</span>
                          <span className="font-semibold text-xs text-slate-200">{title}</span>
                          <span
                            className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(
                              classification
                            )}`}
                          >
                            [{classification}]
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {m.evidence_ref && (
                            <span className="text-[10px] font-mono bg-blue-950/40 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded flex items-center gap-1">
                              <span>Ref: {m.evidence_ref}</span>
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            {((m.confidence ?? 0.85) * 100).toFixed(0)}% conf
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-6">{m.content}</p>
                    </div>
                  );
                })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </section>

        {/* Right Column: Outlook Diagnostic & Decision Memory (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          {/* Project Outlook Diagnostic */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800/80 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-sm text-white">Project Outlook Diagnostic</h3>
              </div>
              <button
                onClick={copyExecutiveSummary}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition"
                title="Copy client-ready report"
              >
                <ClipboardCopy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Export'}</span>
              </button>
            </div>

            {outlook ? (
              <div className="flex flex-col gap-4">
                {/* Launch Verdict Banner */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    Council Verdict
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {outlook.launch_verdict}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{outlook.consensus_summary}</p>
                </div>

                {/* Metric Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Technical Readiness</span>
                      <span className="font-mono text-indigo-400 font-bold">
                        {outlook.technical_readiness}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${outlook.technical_readiness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Market & Validation Evidence</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {outlook.market_evidence}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${outlook.market_evidence}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Distribution Readiness</span>
                      <span className="font-mono text-amber-400 font-bold">
                        {outlook.distribution_readiness}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${outlook.distribution_readiness}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Operational Risk Index</span>
                    <span className="uppercase text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {outlook.risk_index}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-6 text-center">
                Awaiting debate completion to render multi-dimensional outlook...
              </div>
            )}
          </div>

          {/* Action Plan & Human Approval Checklist */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800/80 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">Actionable Next Steps</h3>
              </div>
              <span className="text-[11px] text-slate-400">Human Sign-off</span>
            </div>

            <p className="text-xs text-slate-400">
              Tasks synthesized from council consensus. Click to approve and push to GitHub:
            </p>

            <div className="space-y-2 mt-1">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTaskStatus(t.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                    t.status === 'done'
                      ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                      : t.status === 'approved'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border ${
                      t.status === 'done' || t.status === 'approved'
                        ? 'border-emerald-500 bg-emerald-500 text-black'
                        : 'border-slate-600'
                    }`}
                  >
                    {(t.status === 'done' || t.status === 'approved') && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{t.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span className="capitalize">Agent: {t.assigned_agent}</span>
                      <span>•</span>
                      <span className="uppercase text-amber-400 font-semibold">{t.priority}</span>
                      <span>•</span>
                      <span className="capitalize">{t.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
