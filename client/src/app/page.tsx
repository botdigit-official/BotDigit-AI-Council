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
  ChevronDown,
  Cpu,
  Coins,
  Settings,
  Plus,
  Server,
  Zap,
  BookOpen,
  FolderKanban,
  Key,
  HardDrive,
  Sliders,
  DollarSign,
  Briefcase,
} from 'lucide-react';

interface ProjectInfo {
  id: string;
  code: string;
  name: string;
  client_name: string;
  workspace: string;
  github_url: string;
  visibility: 'private' | 'public';
  environment: string;
  status: string;
  active_agents_count: number;
  total_decisions: number;
}

interface AgentMessage {
  agent: string;
  title: string;
  avatar: string;
  color: string;
  provider?: string;
  model?: string;
  classification: 'FACT' | 'INFERENCE' | 'OPINION' | 'SCENARIO';
  content: string;
  evidence_ref?: string | null;
  confidence: number;
  cost?: string;
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

const ALL_PROJECTS: ProjectInfo[] = [
  {
    id: 'prj_01',
    code: 'PRJ-8F42K',
    name: 'BotDigit Marketplace',
    client_name: 'BotDigit Labs',
    workspace: 'BotDigit Labs',
    github_url: 'https://github.com/botdigit/marketplace',
    visibility: 'private',
    environment: 'Production',
    status: 'Active',
    active_agents_count: 6,
    total_decisions: 47,
  },
  {
    id: 'prj_02',
    code: 'PRJ-9X11M',
    name: 'AIVEX Decentralized Compute',
    client_name: 'AIVEX Foundation',
    workspace: 'BotDigit Labs',
    github_url: 'https://github.com/aivex/protocol',
    visibility: 'private',
    environment: 'Mainnet Stage',
    status: 'Active',
    active_agents_count: 8,
    total_decisions: 62,
  },
  {
    id: 'prj_03',
    code: 'PRJ-3K90P',
    name: 'Grow50X Growth Engine',
    client_name: 'Grow50X Inc',
    workspace: 'BotDigit Labs',
    github_url: 'https://github.com/botdigit/grow50x',
    visibility: 'private',
    environment: 'Staging',
    status: 'Active',
    active_agents_count: 7,
    total_decisions: 29,
  },
  {
    id: 'prj_04',
    code: 'PRJ-1B44L',
    name: 'Amarjeevan Medical Portal',
    client_name: 'Amar Jeevan Trust',
    workspace: 'BotDigit Healthcare',
    github_url: 'https://github.com/botdigit/amarjeevan',
    visibility: 'public',
    environment: 'Production',
    status: 'Active',
    active_agents_count: 5,
    total_decisions: 18,
  },
];

const AGENT_CATALOG = [
  { id: 'moderator', title: 'Chief AI / Moderator', avatar: '🧠', defaultModel: 'Claude 3.5 Sonnet' },
  { id: 'product', title: 'Product Manager', avatar: '👨‍💼', defaultModel: 'GPT-4o' },
  { id: 'engineering', title: 'Senior Engineer', avatar: '🧑‍💻', defaultModel: 'DeepSeek Coder' },
  { id: 'security', title: 'Security Specialist', avatar: '🔐', defaultModel: 'Claude 3.5 Sonnet' },
  { id: 'growth', title: 'Growth Lead', avatar: '📈', defaultModel: 'Gemini 1.5 Pro' },
  { id: 'skeptic', title: 'Skeptic / Red Team', avatar: '🕵️', defaultModel: 'Claude 3.5 Sonnet' },
  { id: 'architect', title: 'System Architect', avatar: '🏗️', defaultModel: 'Claude 3.5 Sonnet' },
  { id: 'qa', title: 'QA & Reliability', avatar: '🧪', defaultModel: 'GPT-4o' },
  { id: 'ux', title: 'UX Specialist', avatar: '🎨', defaultModel: 'Gemini 1.5 Flash' },
  { id: 'seo', title: 'SEO & Content', avatar: '🔎', defaultModel: 'Gemini 1.5 Pro' },
  { id: 'finance', title: 'Finance & Unit Economics', avatar: '💰', defaultModel: 'GPT-4o' },
  { id: 'competitor', title: 'Competitor Analyst', avatar: '⚔️', defaultModel: 'Perplexity Sonar' },
];

const PRESET_TOPICS = [
  'Should we launch this marketplace now?',
  'Security & OWASP audit of authentication endpoints',
  'Organic acquisition loops & SEO indexability review',
  'Database scalability & connection pool limits under 500 req/s',
];

export default function CouncilDashboard() {
  const [selectedProject, setSelectedProject] = useState<ProjectInfo>(ALL_PROJECTS[0]);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'council' | 'decisions' | 'tasks' | 'memory' | 'roadmap'>('council');

  // Provider & Intelligence Mode State
  const [providerMode, setProviderMode] = useState<'botdigit' | 'byok' | 'local'>('botdigit');
  const [intelligenceMode, setIntelligenceMode] = useState<'fast' | 'balanced' | 'deep' | 'maximum'>('balanced');
  const [activeAgentIds, setActiveAgentIds] = useState<string[]>([
    'moderator',
    'product',
    'engineering',
    'security',
    'growth',
    'skeptic',
  ]);

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

  // Initial council run on load
  useEffect(() => {
    triggerCouncilDebate(PRESET_TOPICS[0]);
  }, [selectedProject.id]);

  const triggerCouncilDebate = async (targetTopic: string) => {
    setIsDebating(true);
    setMessages([]);
    setCurrentRound(1);
    setOutlook(null);

    try {
      const res = await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/debates`, {
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
          if (msg) {
            setMessages((prev) => [...prev, { ...msg, cost: '$0.003' }]);
          }
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
    const simulatedMessages: AgentMessage[] = [
      {
        agent: 'product',
        title: 'Product Manager',
        avatar: '👨‍💼',
        color: 'blue',
        provider: 'OpenAI',
        model: 'GPT-4o',
        classification: 'FACT',
        content: `Analyzing '${selectedProject.name}': The initial onboarding flow contains 5 configuration screens before users experience product value.`,
        evidence_ref: 'docs/onboarding.md#L30-L55',
        confidence: 0.95,
        cost: '$0.004',
      },
      {
        agent: 'engineering',
        title: 'Senior Engineer',
        avatar: '🧑‍💻',
        color: 'emerald',
        provider: 'DeepSeek',
        model: 'DeepSeek-V3',
        classification: 'FACT',
        content: 'Core automated test suite reports 82% coverage. However, third-party webhook retry logic lacks unit tests.',
        evidence_ref: 'tests/integration/test_webhooks.py',
        confidence: 0.91,
        cost: '$0.001',
      },
      {
        agent: 'security',
        title: 'Security Specialist',
        avatar: '🔐',
        color: 'rose',
        provider: 'Anthropic',
        model: 'Claude 3.5 Sonnet',
        classification: 'INFERENCE',
        content: 'The public API gateway has no active token-bucket rate limiter. An automated scrape could exhaust worker connection pools.',
        evidence_ref: 'server/app/main.py#L40',
        confidence: 0.88,
        cost: '$0.006',
      },
      {
        agent: 'growth',
        title: 'Growth Lead',
        avatar: '📈',
        color: 'amber',
        provider: 'Google',
        model: 'Gemini 1.5 Pro',
        classification: 'OPINION',
        content: 'Launching without an organic invite loop or automated referral incentive will result in a flatlined post-launch retention curve.',
        evidence_ref: null,
        confidence: 0.82,
        cost: '$0.002',
      },
      {
        agent: 'skeptic',
        title: 'Skeptic / Red Team',
        avatar: '🕵️',
        color: 'purple',
        provider: 'Anthropic',
        model: 'Claude 3.5 Sonnet',
        classification: 'SCENARIO',
        content: 'If we launch today, we risk burning early waitlist enthusiasm. 70% of early adopters churn permanently if initial friction exceeds 2 minutes.',
        evidence_ref: null,
        confidence: 0.86,
        cost: '$0.005',
      },
      {
        agent: 'moderator',
        title: 'Chief AI / Moderator',
        avatar: '🧠',
        color: 'indigo',
        provider: 'BotDigit Auto',
        model: 'Claude 3.5 Sonnet',
        classification: 'OPINION',
        content: 'Consensus reached: Do NOT launch publicly today. Execute a 72-hour hardening sprint: (1) Simplify onboarding to 1-click template, (2) Add Redis rate limiting on auth endpoints, (3) Raise connection pool limit.',
        evidence_ref: null,
        confidence: 0.96,
        cost: '$0.005',
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

  const toggleAgent = (agentId: string) => {
    setActiveAgentIds((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'approved' ? 'done' : 'approved' } : t
      )
    );
  };

  const copyExecutiveSummary = () => {
    if (!outlook) return;
    const text = `BOTDIGIT AI COUNCIL — EXECUTIVE PROJECT AUDIT
Project: ${selectedProject.name} (${selectedProject.code})
Workspace: ${selectedProject.workspace}
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
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      {/* 1. Global Navigation Bar */}
      <header className="border-b border-slate-800/90 bg-[#090d18]/95 backdrop-blur sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              BC
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white">BotDigit AI Council</span>
              <span className="ml-2 text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Operating System
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Explicit Workspace / Project Switcher */}
          <div className="relative">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs transition"
            >
              <div className="flex items-center gap-1 text-slate-400">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Workspace:</span>
                <span className="text-slate-200 font-medium">{selectedProject.workspace}</span>
              </div>
              <span className="text-slate-600">/</span>
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{selectedProject.name}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Project Switcher Dropdown */}
            {projectDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-50 p-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                  Your Managed Projects
                </div>
                <div className="space-y-1">
                  {ALL_PROJECTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProject(p);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                        selectedProject.id === p.id
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.id === 'prj_01'
                                ? 'bg-blue-400'
                                : p.id === 'prj_02'
                                ? 'bg-purple-400'
                                : p.id === 'prj_03'
                                ? 'bg-emerald-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span>{p.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.code} • {p.visibility} • {p.active_agents_count} agents
                        </div>
                      </div>
                      {selectedProject.id === p.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-800 mt-2 pt-2 px-2 flex justify-between">
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 py-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Project</span>
                  </button>
                  <button className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Manage</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Nav Right Controls */}
        <div className="flex items-center gap-3">
          {/* AI Provider & Agent Control Center Pill */}
          <button
            onClick={() => setControlCenterOpen(true)}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">{activeAgentIds.length} / 12 Active Agents</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 font-mono">
              {providerMode === 'botdigit' ? 'BotDigit AI' : providerMode === 'byok' ? 'BYOK' : 'Local Ollama'}
            </span>
          </button>

          {/* Visibility Indicator */}
          <div
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${
              selectedProject.visibility === 'public'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {selectedProject.visibility === 'public' ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public Snapshot Active</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Private Workspace</span>
              </>
            )}
          </div>

          {/* GitHub Connected Badge */}
          <a
            href={selectedProject.github_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span>{selectedProject.github_url.replace('https://github.com/', '')}</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </header>

      {/* 2. Persistent Project Identity Hero Section (Zero Ambiguity) */}
      <section className="bg-gradient-to-b from-[#0d1424] to-[#090d16] border-b border-slate-800/80 px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50" />
              <h1 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                {selectedProject.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedProject.code}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                ● {selectedProject.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-3">
              <span>Client: <strong className="text-slate-300">{selectedProject.client_name}</strong></span>
              <span>•</span>
              <span>Env: <strong className="text-slate-300">{selectedProject.environment}</strong></span>
              <span>•</span>
              <span>Repo: <strong className="text-slate-300 font-mono">{selectedProject.github_url.replace('https://github.com/', '')}</strong></span>
              <span>•</span>
              <span>Decisions Logged: <strong className="text-indigo-400">{selectedProject.total_decisions}</strong></span>
            </p>
          </div>

          {/* Subsystem Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            {(
              [
                { id: 'council', label: 'Council Room', icon: Sparkles },
                { id: 'decisions', label: 'Decisions Memory', icon: BookOpen },
                { id: 'tasks', label: 'Tasks & GitHub', icon: CheckCircle2 },
                { id: 'memory', label: 'Knowledge Graph', icon: Layers },
                { id: 'roadmap', label: 'Public Roadmap', icon: Globe },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Council Discussion Room (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Explicit Project Context Session Header */}
          <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-lg">
                🧠
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{selectedProject.name} — AI Council Session #024</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ID: <span className="font-mono text-slate-300">{selectedProject.code}</span> • Workspace:{' '}
                  <span className="text-slate-300">{selectedProject.workspace}</span> • {activeAgentIds.length} Agents
                  Participating
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500">Isolation Policy</span>
              <div className="text-xs font-mono text-indigo-400 font-semibold">Strict Project Boundary</div>
            </div>
          </div>

          {/* Agenda & Topic Selector Bar */}
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Council Deliberation Agenda
              </span>
              <span className="text-[11px] font-mono text-slate-400 lowercase">
                scope: project_id = {selectedProject.code}
              </span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ask your persistent AI team..."
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
                <h2 className="font-semibold text-sm tracking-wide text-white">
                  Live Multi-Agent Discussion Room
                </h2>
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
                          <span className="text-[10px] text-slate-500 font-mono">
                            {selectedProject.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(
                              classification
                            )}`}
                          >
                            [{classification}]
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {m.model && (
                            <span className="text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded">
                              {m.model}
                            </span>
                          )}
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

      {/* 4. AI Provider & Agent Control Center Drawer / Modal */}
      {controlCenterOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">AI Provider & Agent Control Center</h3>
              </div>
              <button
                onClick={() => setControlCenterOpen(false)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            {/* Provider Mode Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                1. AI Inference Provider Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setProviderMode('botdigit')}
                  className={`p-3 rounded-xl border text-left transition ${
                    providerMode === 'botdigit'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>BotDigit AI (Auto)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Zero configuration. Smart model routing across Claude & GPT.
                  </p>
                </button>

                <button
                  onClick={() => setProviderMode('byok')}
                  className={`p-3 rounded-xl border text-left transition ${
                    providerMode === 'byok'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bring Your Own Key</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Connect OpenAI, Anthropic, Gemini, or OpenRouter keys.
                  </p>
                </button>

                <button
                  onClick={() => setProviderMode('local')}
                  className={`p-3 rounded-xl border text-left transition ${
                    providerMode === 'local'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Local / Private AI</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Run Ollama / vLLM on-premises. Code never leaves local server.
                  </p>
                </button>
              </div>
            </div>

            {/* Intelligence Depth Mode */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                2. Deliberation Depth & Rigor
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'fast', title: '⚡ Fast', desc: 'Short 2-round debate' },
                  { id: 'balanced', title: '🧠 Balanced', desc: '4 rounds + verification' },
                  { id: 'deep', title: '🔬 Deep Research', desc: 'Full repo code audit' },
                  { id: 'maximum', title: '🏛️ Max Council', desc: '12 agents + red team' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setIntelligenceMode(m.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      intelligenceMode === m.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-xs">{m.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Specialist Agents Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  3. Select Active Specialists ({activeAgentIds.length} / 12)
                </label>
                <div className="flex gap-2 text-[11px]">
                  <button
                    onClick={() =>
                      setActiveAgentIds(['product', 'engineering', 'security', 'growth', 'skeptic', 'moderator'])
                    }
                    className="text-indigo-400 hover:underline"
                  >
                    Startup Pack
                  </button>
                  <button
                    onClick={() => setActiveAgentIds(AGENT_CATALOG.map((a) => a.id))}
                    className="text-indigo-400 hover:underline"
                  >
                    Select All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AGENT_CATALOG.map((agent) => {
                  const isActive = activeAgentIds.includes(agent.id);
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs transition ${
                        isActive
                          ? 'bg-slate-900 border-indigo-500/60 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{agent.avatar}</span>
                        <div>
                          <div className="font-medium text-[11px]">{agent.title}</div>
                          <div className="text-[9px] text-slate-400 font-mono">{agent.defaultModel}</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isActive}
                        readOnly
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project Budget Guardrails */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-slate-200">Project AI Budget Guardrail</div>
                  <div className="text-[11px] text-slate-400">
                    Monthly Limit: $50.00 • Used: $12.45 • Max / Session: $2.00
                  </div>
                </div>
              </div>
              <button
                onClick={() => setControlCenterOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 rounded-lg text-xs transition"
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
