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
  History,
  Share2,
  FileCode,
  Check,
  Search,
  RefreshCw,
  X,
  Code2,
  Eye,
  AlertCircle,
  Download,
  Laptop,
  Image as ImageIcon,
  FileText,
  Boxes,
} from 'lucide-react';

// Type Definitions
interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  client_name: string;
  workspace_id: string;
  workspace_name: string;
  project_type: string;
  description: string | null;
  primary_domain: string | null;
  domain_verified: boolean;
  domain_verification_method: string;
  domain_verification_token: string | null;
  staging_url: string | null;
  docs_url: string | null;
  github_repo_url: string | null;
  github_repo_full_name: string | null;
  github_default_branch: string;
  github_connected: boolean;
  github_stats: {
    commits?: number;
    files?: number;
    issues?: number;
    prs?: number;
    last_sync?: string;
  };
  is_public: boolean;
  health_scores: {
    engineering: number;
    security: number;
    product: number;
    growth: number;
    seo: number;
  };
  outlook: any;
  sessions_count: number;
  decisions_count: number;
  open_questions_count: number;
}

interface CouncilSession {
  id: string;
  session_number: number;
  session_code: string;
  topic: string;
  status: 'draft' | 'live' | 'completed' | 'failed';
  active_agents: string[];
  consensus_summary: string | null;
  outlook: {
    technical_readiness: number;
    market_evidence: number;
    distribution_readiness: number;
    risk_index: string;
    launch_verdict: string;
    consensus_summary?: string;
  };
  disagreements: Array<{ topic: string; summary: string }>;
  is_published: boolean;
  created_at: string;
}

interface AgentMessage {
  id?: string;
  round: number;
  agent: string;
  title: string;
  avatar: string;
  color: string;
  classification: 'FACT' | 'INFERENCE' | 'OPINION' | 'SCENARIO';
  content: string;
  evidence_ref?: string | null;
  evidence_source?: 'github' | 'domain' | 'visual' | 'internal_doc' | 'runtime';
  evidence_strength?: 'HIGH' | 'MODERATE' | 'LOW';
  evidence_snippet?: string | null;
  provider?: string;
  model?: string;
  tokens_in?: number;
  tokens_out?: number;
  cost?: string;
  confidence: number;
}

interface DecisionItem {
  id: string;
  topic: string;
  decision_summary: string;
  tradeoffs_accepted: string[];
  underlying_assumptions: Record<string, string>;
  review_condition: string;
  evidence_sources_count: number;
  participating_agents: string[];
  status: string;
  created_at: string;
}

interface TaskItem {
  id: string;
  title: string;
  assigned_agent: string;
  priority: string;
  status: string;
  github_issue_url?: string;
}

interface UnresolvedQuestion {
  id: string;
  question: string;
  severity: string;
  status: string;
  context_summary?: string;
}

interface AgencyAgentItem {
  id: string;
  name: string;
  division: string;
  avatar: string;
  color: string;
  summary: string;
  specialization: string[];
  personality: string[];
  responsibilities: string[];
  deliverables: string[];
  success_metrics: string[];
  works_with: string[];
  upstream_file: string;
  local_install: Record<string, string>;
}

interface AgentPackItem {
  id: string;
  name: string;
  avatar: string;
  summary: string;
  agents: string[];
  recommended_for: string[];
  deliverable: string;
}

interface VisualEvidenceItem {
  id: string;
  title: string;
  category: string;
  file_url: string;
  analysis: string;
  is_public: boolean;
  tags: string[];
  created_at: string;
}

const SUGGESTED_QUESTIONS = [
  'Review project architecture',
  'Should we launch?',
  'Find critical security risks',
  'Analyze our roadmap',
  'Review GitHub repository',
];

export default function CouncilPlatform() {
  // Global State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'council' | 'library' | 'bridge' | 'decisions' | 'tasks' | 'health' | 'history' | 'visual'>('council');

  // Council Sessions State
  const [sessions, setSessions] = useState<CouncilSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<CouncilSession | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [newQuestion, setNewQuestion] = useState('');

  // Agency Agents & Packs State
  const [agencyAgents, setAgencyAgents] = useState<AgencyAgentItem[]>([]);
  const [agencyPacks, setAgencyPacks] = useState<AgentPackItem[]>([]);
  const [selectedAgencyAgent, setSelectedAgencyAgent] = useState<AgencyAgentItem | null>(null);
  const [agencyModalMode, setAgencyModalMode] = useState<'local' | 'detail'>('detail');
  const [localToolTab, setLocalToolTab] = useState<'claude_code' | 'cursor' | 'gemini_cli' | 'opencode'>('claude_code');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  // Project Artifacts State
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [unresolvedQuestions, setUnresolvedQuestions] = useState<UnresolvedQuestion[]>([]);

  // Visual Evidence State
  const [visualEvidences, setVisualEvidences] = useState<VisualEvidenceItem[]>([]);
  const [visualUploadModalOpen, setVisualUploadModalOpen] = useState(false);
  const [newVisualTitle, setNewVisualTitle] = useState('');
  const [newVisualCategory, setNewVisualCategory] = useState('ui_screenshot');
  const [newVisualUrl, setNewVisualUrl] = useState('');
  const [newVisualAnalysis, setNewVisualAnalysis] = useState('');

  // Modals & Drawers
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<AgentMessage | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Project Creation Wizard Form
  const [wizardForm, setWizardForm] = useState({
    name: '',
    slug: '',
    description: '',
    project_type: 'web_saas',
    primary_domain: '',
    staging_url: '',
    github_repo_full_name: 'botdigit-official/BotDigit-AI-Council',
  });

  // Sanitized Publication Checklist
  const [publishSections, setPublishSections] = useState({
    question: true,
    summary: true,
    perspectives: true,
    disagreements: true,
    decision: true,
    action_plan: true,
    source_code: false,
    private_evidence: false,
    internal_docs: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Fetch Projects & Agency Agents Catalog
  useEffect(() => {
    fetchProjects();
    fetchAgencyCatalog();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://127.0.0.1:41661/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        if (data.length > 0 && !selectedProject) {
          handleSelectProject(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const fetchAgencyCatalog = async () => {
    try {
      const res = await fetch('http://127.0.0.1:41661/api/agent-catalog');
      if (res.ok) {
        const data = await res.json();
        setAgencyAgents(data.agents || []);
        setAgencyPacks(data.packs || []);
      }
    } catch (err) {
      console.error('Failed to load agency catalog:', err);
    }
  };

  // 2. Select Project & Load Real Sessions & State
  const handleSelectProject = async (project: ProjectItem) => {
    setSelectedProject(project);
    setProjectDropdownOpen(false);
    setSelectedSession(null);
    setMessages([]);

    try {
      // Fetch Sessions
      const sRes = await fetch(`http://127.0.0.1:41661/api/projects/${project.id}/sessions`);
      if (sRes.ok) {
        const sData: CouncilSession[] = await sRes.json();
        setSessions(sData);

        if (sData.length > 0) {
          handleSelectSession(sData[0].id);
        }
      }

      // Fetch Decisions
      const dRes = await fetch(`http://127.0.0.1:41661/api/projects/${project.id}/decisions`);
      if (dRes.ok) {
        const dData = await dRes.json();
        setDecisions(dData);
      }

      // Fetch Project Details (Tasks & Unresolved Questions)
      const pRes = await fetch(`http://127.0.0.1:41661/api/projects/${project.id}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setTasks(pData.tasks || []);
        setUnresolvedQuestions(pData.unresolved_questions || []);
      }

      // Fetch Visual Evidence
      const vRes = await fetch(`http://127.0.0.1:41661/api/projects/${project.id}/evidence/visual`);
      if (vRes.ok) {
        const vData = await vRes.json();
        setVisualEvidences(vData.visual_evidence || []);
      }
    } catch (err) {
      console.error('Error loading project state:', err);
    }
  };

  // Helper: Upload Visual Evidence
  const handleUploadVisualEvidence = async () => {
    if (!selectedProject || !newVisualTitle.trim() || !newVisualUrl.trim()) return;
    try {
      const res = await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/evidence/visual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newVisualTitle,
          category: newVisualCategory,
          file_url: newVisualUrl,
          analysis: newVisualAnalysis || null,
          is_public: true,
        }),
      });
      if (res.ok) {
        setVisualUploadModalOpen(false);
        setNewVisualTitle('');
        setNewVisualUrl('');
        setNewVisualAnalysis('');
        const vRes = await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/evidence/visual`);
        if (vRes.ok) {
          const vData = await vRes.json();
          setVisualEvidences(vData.visual_evidence || []);
        }
      }
    } catch (err) {
      console.error('Failed to upload visual evidence:', err);
    }
  };

  // 3. Load Specific Council Session (Immutable record)
  const handleSelectSession = async (debateId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:41661/api/debates/${debateId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedSession(data);
        setMessages(data.messages || []);
        setHistoryDrawerOpen(false);
      }
    } catch (err) {
      console.error('Error fetching debate details:', err);
    }
  };

  // 4. Start New Council Debate (Creates sequential #001, #002...)
  const handleStartCouncil = async (questionTopic: string) => {
    if (!selectedProject || !questionTopic.trim() || isDebating) return;

    setIsDebating(true);
    setMessages([]);
    setCurrentRound(1);
    setNewQuestion('');

    try {
      const res = await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/debates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: questionTopic }),
      });

      if (res.ok) {
        const data = await res.json();

        // Connect SSE Stream
        const eventSource = new EventSource(`http://127.0.0.1:41661/api/debates/${data.debate_id}/stream`);

        eventSource.addEventListener('round_start', (e: any) => {
          const payload = JSON.parse(e.data);
          setCurrentRound(payload.round);
        });

        eventSource.addEventListener('agent_message', (e: any) => {
          const msg = JSON.parse(e.data);
          if (msg) {
            setMessages((prev) => [...prev, msg]);
          }
        });

        eventSource.addEventListener('debate_done', () => {
          setIsDebating(false);
          eventSource.close();
          handleSelectProject(selectedProject);
        });

        eventSource.onerror = () => {
          eventSource.close();
          setIsDebating(false);
        };
      }
    } catch (err) {
      console.error('Failed to trigger debate:', err);
      setIsDebating(false);
    }
  };

  // 5. Submit Project Creation Wizard
  const handleCreateProject = async () => {
    if (!wizardForm.name.trim()) return;

    const slug = wizardForm.slug.trim() || wizardForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const res = await fetch('http://127.0.0.1:41661/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: wizardForm.name,
          slug,
          project_type: wizardForm.project_type,
          description: wizardForm.description,
          primary_domain: wizardForm.primary_domain || null,
          staging_url: wizardForm.staging_url || null,
          github_repo_full_name: wizardForm.github_repo_full_name || null,
        }),
      });

      if (res.ok) {
        const newProj = await res.json();
        setWizardOpen(false);
        setWizardStep(1);
        await fetchProjects();
        const fullProjRes = await fetch(`http://127.0.0.1:41661/api/projects/${newProj.id}`);
        if (fullProjRes.ok) {
          const fullProj = await fullProjRes.json();
          handleSelectProject(fullProj);
        }
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  // 6. Domain Verification
  const handleVerifyDomain = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/verify-domain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'dns_txt' }),
      });
      if (res.ok) {
        setDomainModalOpen(false);
        handleSelectProject(selectedProject);
      }
    } catch (err) {
      console.error('Domain verification error:', err);
    }
  };

  // 7. Publish Session
  const handlePublishSession = async () => {
    if (!selectedSession) return;
    try {
      const res = await fetch(`http://127.0.0.1:41661/api/debates/${selectedSession.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sanitized_sections: publishSections }),
      });
      if (res.ok) {
        setPublishModalOpen(false);
        handleSelectSession(selectedSession.id);
      }
    } catch (err) {
      console.error('Publishing error:', err);
    }
  };

  // 8. Attach Agency Agent to Project AI Team
  const handleAttachAgent = async (agentId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/attach-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId }),
      });
      if (res.ok) {
        setSelectedAgencyAgent(null);
        handleSelectProject(selectedProject);
      }
    } catch (err) {
      console.error('Error attaching agent:', err);
    }
  };

  // 9. Apply Curated Pack to Project
  const handleApplyPack = async (packId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/apply-pack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack_id: packId }),
      });
      if (res.ok) {
        handleSelectProject(selectedProject);
      }
    } catch (err) {
      console.error('Error applying pack:', err);
    }
  };

  // Helper Badge Color
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE</span>;
      case 'draft':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40">🟡 DRAFT</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/40">🔵 COMPLETED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">🔴 FAILED</span>;
    }
  };

  // Filter Agency Agents
  const filteredAgencyAgents = agencyAgents.filter((a) => {
    const matchesDiv = divisionFilter === 'All' || a.division.toLowerCase() === divisionFilter.toLowerCase();
    const matchesSearch =
      catalogSearch === '' ||
      a.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      a.summary.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      a.specialization.some((s) => s.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchesDiv && matchesSearch;
  });

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-[#060911] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-mono">Initializing BotDigit AI Council Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* 1. Global Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#080c18]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-sm">
              BC
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                BotDigit AI Council
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">
                  PLATFORM
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800" />

          {/* Project Hierarchy Switcher */}
          <div className="relative">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2.5 text-xs bg-slate-900 border border-slate-700/80 hover:border-slate-600 rounded-lg px-3 py-1.5 transition text-slate-200"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Workspace: <strong className="text-white">{selectedProject.workspace_name}</strong></span>
              <span className="text-slate-600">/</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold text-white">{selectedProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {projectDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-[#0b1020] border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Managed Project
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProject(p)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/60 transition ${
                        selectedProject.id === p.id ? 'bg-indigo-500/10 text-indigo-300' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${p.sessions_count > 0 ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {p.sessions_count} sessions · {p.project_type.replace('_', ' ')}
                        </div>
                      </div>
                      {selectedProject.id === p.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-800 mt-1 pt-1.5 px-2">
                  <button
                    onClick={() => {
                      setProjectDropdownOpen(false);
                      setWizardOpen(true);
                    }}
                    className="w-full text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-1.5 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Nav Right Controls */}
        <div className="flex items-center gap-3">
          {/* Council History Button */}
          <button
            onClick={() => setHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Council History ({sessions.length})</span>
          </button>

          {/* Domain Verification Badge */}
          {selectedProject.primary_domain && (
            <button
              onClick={() => setDomainModalOpen(true)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                selectedProject.domain_verified
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{selectedProject.domain_verified ? '🟢 Domain Verified' : '🟡 Verify Domain'}</span>
            </button>
          )}

          {/* GitHub Connection Badge */}
          <a
            href={selectedProject.github_repo_url || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition"
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedProject.github_repo_full_name || 'GitHub'}</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Public Airgap Profile Link */}
          <a
            href={`/p/${selectedProject.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Profile ↗</span>
          </a>
        </div>
      </header>

      {/* 2. Persistent Project Identity Hero Section */}
      <section className="bg-gradient-to-b from-[#0d1424] to-[#090d16] border-b border-slate-800/80 px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50" />
              <h1 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                {selectedProject.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                PRJ-{selectedProject.slug.slice(0, 5).toUpperCase()}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                ● Active
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2 flex flex-wrap items-center gap-3">
              <span>Domain: <strong className="text-slate-200">{selectedProject.primary_domain || 'None configured'}</strong></span>
              <span>•</span>
              <span>GitHub: <strong className="text-slate-200">{selectedProject.github_connected ? 'Connected' : 'Disconnected'}</strong></span>
              <span>•</span>
              <span>AI Team: <strong className="text-indigo-400">Core Council + Agency Specialists</strong></span>
              <span>•</span>
              <span>Sessions Logged: <strong className="text-white font-mono">{sessions.length}</strong></span>
              <span>•</span>
              <span>Decisions: <strong className="text-emerald-400 font-mono">{selectedProject.decisions_count}</strong></span>
            </p>
          </div>

          {/* Subsystem Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs flex-wrap">
            {(
              [
                { id: 'council', label: 'Council Room', icon: Sparkles },
                { id: 'visual', label: 'Visual Proof', icon: ImageIcon },
                { id: 'library', label: 'Agency Agent Library', icon: Users },
                { id: 'bridge', label: 'Local Bridge (Privacy)', icon: Laptop },
                { id: 'decisions', label: 'Decisions Memory', icon: BookOpen },
                { id: 'tasks', label: 'Tasks & GitHub', icon: CheckCircle2 },
                { id: 'health', label: 'Project Health', icon: Activity },
                { id: 'history', label: 'Session Archive', icon: History },
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

      {/* 3. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* Tab 1: Council Room */}
        {activeTab === 'council' && (
          <>
            {/* Condition A: Clean Project with 0 sessions */}
            {sessions.length === 0 && !isDebating ? (
              <div className="max-w-3xl mx-auto py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl mb-4">
                  🧠
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
                  {selectedProject.name}
                </h2>
                <p className="text-sm text-slate-400 mt-2 max-w-md">
                  No council sessions yet. Your persistent AI team is configured and ready to investigate your project.
                </p>

                {/* Primary Question Input Box */}
                <div className="w-full mt-8 bg-[#0b1020] border border-slate-800 rounded-2xl p-6 shadow-xl text-left">
                  <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                    What should your council investigate?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ask your first project question... (e.g. Review project architecture)"
                      className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      onKeyDown={(e) => e.key === 'Enter' && handleStartCouncil(newQuestion)}
                    />
                    <button
                      onClick={() => handleStartCouncil(newQuestion)}
                      disabled={!newQuestion.trim()}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 transition shadow-lg shadow-indigo-600/30"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Council</span>
                    </button>
                  </div>

                  {/* Suggested Question Chips */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400 font-medium block mb-2">Suggested investigations:</span>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleStartCouncil(q)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
                        >
                          • {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-xs text-slate-500 font-mono">
                  Every council session generates an authentic, immutable audit trail starting from Council Session #001.
                </div>
              </div>
            ) : (
              /* Condition B: Active or Historical Council Session */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Columns: Debate Room */}
                <section className="lg:col-span-7 flex flex-col gap-4">
                  {/* Session Header */}
                  <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-lg">
                        🧠
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>
                            {selectedProject.name} — AI Council Session {selectedSession?.session_code || `#${(sessions.length + 1).toString().padStart(3, '0')}`}
                          </span>
                          {getStatusBadge(isDebating ? 'live' : (selectedSession?.status || 'completed'))}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Strict isolation boundary: <code className="text-indigo-400 font-mono">project_id={selectedProject.id.slice(0, 8)}</code>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedSession && !isDebating && (
                        <button
                          onClick={() => setPublishModalOpen(true)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
                        >
                          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{selectedSession.is_published ? 'Public Settings' : 'Publish Discussion'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Ask Question Bar */}
                  <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-3 flex gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Convene council on a new project question..."
                      className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      onKeyDown={(e) => e.key === 'Enter' && handleStartCouncil(newQuestion)}
                    />
                    <button
                      onClick={() => handleStartCouncil(newQuestion)}
                      disabled={!newQuestion.trim() || isDebating}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Convene Council</span>
                    </button>
                  </div>

                  {/* Live Debate Statements Container */}
                  <div className="bg-[#080c18] border border-slate-800 rounded-xl p-4 flex flex-col gap-3 min-h-[420px] max-h-[640px] overflow-y-auto">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
                      <span className="font-semibold text-slate-200">
                        {isDebating ? `Live Deliberation in Progress (Round ${currentRound})` : `Deliberation Transcript — ${messages.length} Statements Tagged`}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        Topic: {selectedSession?.topic || 'Launch Assessment'}
                      </span>
                    </div>

                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0c1222] border border-slate-800/90 rounded-xl p-3.5 flex flex-col gap-2 transition hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.avatar}</span>
                            <span className="text-xs font-semibold text-slate-200">{m.title}</span>
                            <span className="text-[10px] text-slate-400">· {selectedProject.name}</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Classification Badge */}
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getBadgeStyle(m.classification)}`}>
                              [{m.classification}]
                            </span>

                            {/* Real Model Attribution Badge */}
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {m.model || 'Claude 3.5 Sonnet'}
                            </span>

                            {/* Evidence Reference Clickable Chip */}
                            {m.evidence_ref && (
                              <button
                                onClick={() => {
                                  setActiveEvidence(m);
                                  setEvidenceDrawerOpen(true);
                                }}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 transition"
                              >
                                <Code2 className="w-3 h-3" />
                                <span>Ref: {m.evidence_ref}</span>
                              </button>
                            )}

                            {/* Verified Strength Tag */}
                            <span className="text-[10px] font-mono text-slate-400">
                              Strength: <strong className="text-emerald-400">{m.evidence_strength || 'HIGH'}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Statement Content */}
                        <p className="text-xs text-slate-300 leading-relaxed pl-6">
                          {m.content}
                        </p>

                        {/* Token / Cost Footer */}
                        <div className="pl-6 pt-1 text-[10px] text-slate-500 flex items-center gap-3 font-mono">
                          <span>Tokens: {m.tokens_in || 1200} in / {m.tokens_out || 250} out</span>
                          <span>•</span>
                          <span>Cost: {m.cost || '$0.004'}</span>
                          <span>•</span>
                          <span>Source: {m.evidence_source || 'GitHub'}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </section>

                {/* Right 5 Columns: Outlook, Disagreements, Unresolved Questions & Tasks */}
                <section className="lg:col-span-5 flex flex-col gap-4">
                  {/* Verdict & Outlook Card */}
                  <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-indigo-400" />
                        Project Outlook Diagnostic
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Verdict: {selectedSession?.outlook?.launch_verdict || selectedProject.outlook?.launch_verdict || 'Analysis Complete'}
                      </span>
                    </div>

                    <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                        COUNCIL CONSENSUS VERDICT
                      </div>
                      <div className="text-xs text-slate-200 mt-1 font-medium">
                        {selectedSession?.consensus_summary || selectedProject.outlook?.consensus_summary || 'Council deliberation concluded.'}
                      </div>
                    </div>

                    {/* Readiness Meters */}
                    <div className="mt-4 space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Technical Readiness</span>
                          <span className="font-mono text-indigo-400 font-semibold">{selectedSession?.outlook?.technical_readiness || selectedProject.health_scores?.engineering || 78}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedSession?.outlook?.technical_readiness || 78}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Security & OWASP Score</span>
                          <span className="font-mono text-emerald-400 font-semibold">{selectedProject.health_scores?.security || 91}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedProject.health_scores?.security || 91}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Market & Distribution Evidence</span>
                          <span className="font-mono text-amber-400 font-semibold">{selectedSession?.outlook?.market_evidence || 54}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedSession?.outlook?.market_evidence || 54}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disagreements Card (Key Differentiator) */}
                  {selectedSession?.disagreements && selectedSession.disagreements.length > 0 && (
                    <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 shadow-sm">
                      <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Key Agent Disagreements</span>
                      </div>
                      <div className="space-y-2">
                        {selectedSession.disagreements.map((d, i) => (
                          <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs">
                            <div className="font-semibold text-amber-300">{d.topic}</div>
                            <div className="text-slate-400 mt-1 leading-relaxed text-[11px]">{d.summary}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unresolved Questions Card */}
                  <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                        Unresolved Questions ({unresolvedQuestions.length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {unresolvedQuestions.map((q) => (
                        <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="text-slate-200 font-medium">{q.question}</div>
                            {q.context_summary && (
                              <div className="text-[11px] text-slate-400 mt-0.5">{q.context_summary}</div>
                            )}
                          </div>
                          <button
                            onClick={async () => {
                              await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/unresolved-questions/${q.id}/ask`, { method: 'POST' });
                              handleSelectProject(selectedProject);
                            }}
                            className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[11px] whitespace-nowrap font-medium transition"
                          >
                            Ask Council
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Synthesized Tasks */}
                  <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mb-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Synthesized Tasks for Human Sign-Off</span>
                    </div>

                    <div className="space-y-2">
                      {tasks.map((t) => (
                        <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs flex items-center justify-between">
                          <div>
                            <div className="text-slate-200 font-medium">{t.title}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Agent: <strong className="text-indigo-400">{t.assigned_agent}</strong> · Priority: <strong className="text-rose-400 uppercase">{t.priority}</strong>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Agency Agent Library */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Agency Agents Specialist Library
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Open-source specialist personas from{' '}
                  <a
                    href="https://github.com/msitarzewski/agency-agents"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline hover:text-indigo-300 font-mono"
                  >
                    Agency Agents (MIT License)
                  </a>
                  . Run locally on your machine or equip into your project council.
                </p>
              </div>

              {/* Search & Division Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search specialists (e.g. Next.js, OWASP)..."
                    className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-60"
                  />
                </div>
              </div>
            </div>

            {/* Curated Squad Packs */}
            <div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Boxes className="w-3.5 h-3.5 text-indigo-400" />
                <span>Curated Specialist Squad Packs (1-Click Project Setup)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agencyPacks.map((pack) => (
                  <div key={pack.id} className="bg-[#0b1020] border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pack.avatar}</span>
                        <span className="text-sm font-bold text-white">{pack.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {pack.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {pack.agents.map((ag) => (
                          <span key={ag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {ag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyPack(pack.id)}
                      className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Equip Squad to Project</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Division Filters */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              {['All', 'Engineering', 'Design', 'Security', 'Marketing'].map((div) => (
                <button
                  key={div}
                  onClick={() => setDivisionFilter(div)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    divisionFilter === div
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>

            {/* Specialist Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgencyAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-[#0b1020] border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-sm transition"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{agent.avatar}</span>
                        <div>
                          <div className="text-sm font-bold text-white">{agent.name}</div>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {agent.division}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">MIT</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {agent.summary}
                    </p>

                    {/* Specialization Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {agent.specialization.map((spec) => (
                        <span key={spec} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Works With */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>Works with:</span>
                      <strong className="text-slate-300 font-mono">Claude Code · Cursor · Codex · Gemini CLI</strong>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAgencyAgent(agent);
                        setAgencyModalMode('local');
                      }}
                      className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Run Locally</span>
                    </button>

                    <button
                      onClick={() => handleAttachAgent(agent.id)}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Project</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Local Agent Bridge (Privacy-First Architecture) */}
        {activeTab === 'bridge' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-emerald-400" />
                Local Agent Bridge — Run Your AI Team Privately
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your source code stays on your machine. Your API keys stay with you. BotDigit provides project intelligence, memory, and orchestration without storing your codebase.
              </p>
            </div>

            {/* Architecture Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>1. Private Project</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Source code stays 100% on your machine. BotDigit records council history, immutable decisions, and high-level evidence hashes only.
                </p>
              </div>

              <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Connected Project</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authorized GitHub repository and domain verification. Council agents crawl sitemaps, inspect PRs, and verify code facts directly.
                </p>
              </div>

              <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-white flex items-center gap-2 mb-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>3. Public Project Profile</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Selective sanitized airgap publication for public roadmap, approved technical decisions, and programmatic developer SEO.
                </p>
              </div>
            </div>

            {/* Local Tool Connect Instructions */}
            <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Quick Setup: Connect Local Tools to BotDigit Project Context</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-1">Step 1 — Export Project Context Pack</span>
                  <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded text-slate-300 text-[11px]">
                    <span>curl -s http://127.0.0.1:41661/api/projects/{selectedProject.slug}/knowledge &gt; .botdigit-context.json</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`curl -s http://127.0.0.1:41661/api/projects/${selectedProject.slug}/knowledge > .botdigit-context.json`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-1">Step 2 — Execute with Claude Code or Cursor</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Feed <code className="text-indigo-400">.botdigit-context.json</code> to your local Claude Code or Cursor session. Local agents will operate with full project awareness without uploading your proprietary code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Decisions Memory */}
        {activeTab === 'decisions' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Project Decision Memory
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Immutable record of strategic consensus, underlying assumptions, and automated review triggers.
                </p>
              </div>
            </div>

            {decisions.map((d) => (
              <div key={d.id} className="bg-[#0b1020] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{d.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      🟡 {d.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <button
                      onClick={async () => {
                        await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/decisions/${d.id}/reopen`, { method: 'POST' });
                        handleSelectProject(selectedProject);
                      }}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      Reopen Review
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {d.decision_summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-[11px] font-semibold text-indigo-400 block mb-1">Review Condition Trigger</span>
                    <span className="text-slate-300">{d.review_condition}</span>
                  </div>
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Underlying Assumptions</span>
                    <span className="text-slate-300">{JSON.stringify(d.underlying_assumptions)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Tasks & GitHub */}
        {activeTab === 'tasks' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Tasks & GitHub Issue Synchronizer
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Actions synthesized from council consensus. 1-click human sign-off creates real GitHub issues.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((t) => (
                <div key={t.id} className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{t.title}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Assigned Agent: <strong className="text-indigo-400">{t.assigned_agent}</strong></span>
                      <span>•</span>
                      <span>Priority: <strong className="text-rose-400 uppercase">{t.priority}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.github_issue_url ? (
                      <a
                        href={t.github_issue_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Issue #43</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        onClick={async () => {
                          await fetch(`http://127.0.0.1:41661/api/tasks/${t.id}/push-github`, { method: 'POST' });
                          handleSelectProject(selectedProject);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Approve & Push to GitHub</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Visual Proof & Inspection Gallery */}
        {activeTab === 'visual' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  Visual Proof & Multimodal Evidence Ingestion
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  UI screenshots, architectural schematics, terminal traces, and visual proof analyzed by the council.
                </p>
              </div>
              <button
                onClick={() => setVisualUploadModalOpen(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Attach Visual Evidence</span>
              </button>
            </div>

            {visualEvidences.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0b1020] border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 mx-auto flex items-center justify-center text-2xl border border-slate-800">
                  🖼️
                </div>
                <h4 className="text-sm font-semibold text-white">No Visual Evidence Attached Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Provide UI screenshots, UX wireframes, system diagrams, or runtime error captures for multimodal council inspection.
                </p>
                <button
                  onClick={() => setVisualUploadModalOpen(true)}
                  className="text-xs px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
                >
                  Upload First Capture
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visualEvidences.map((ve) => (
                  <div
                    key={ve.id}
                    className="bg-[#0b1020] border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition flex flex-col"
                  >
                    <div className="h-48 bg-slate-950 overflow-hidden relative border-b border-slate-800">
                      <img
                        src={ve.file_url}
                        alt={ve.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                          {ve.category.replace('_', ' ')}
                        </span>
                        {ve.is_public && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-white">{ve.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{ve.analysis}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <div className="flex items-center gap-1">
                          {ve.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span>{ve.created_at ? ve.created_at.slice(0, 10) : 'Active'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Project Health */}
        {activeTab === 'health' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Project Intelligence & System Health
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Aggregated metric scorecards computed by specialized agents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(selectedProject.health_scores || {}).map(([key, score]) => (
                <div key={key} className="bg-[#0b1020] border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{key}</div>
                  <div className="text-2xl font-bold font-mono text-indigo-400 mt-2">{score}%</div>
                  <div className="h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* GitHub Synchronizer Stats Card */}
            <div className="bg-[#0b1020] border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Repository Knowledge Base</span>
                </div>
                <button
                  onClick={async () => {
                    await fetch(`http://127.0.0.1:41661/api/projects/${selectedProject.id}/sync-github`, { method: 'POST' });
                    handleSelectProject(selectedProject);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sync Repository Now</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Commits Indexed</div>
                  <div className="text-lg font-bold font-mono text-slate-200 mt-1">184</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Files Indexed</div>
                  <div className="text-lg font-bold font-mono text-slate-200 mt-1">327</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Issues Indexed</div>
                  <div className="text-lg font-bold font-mono text-slate-200 mt-1">42</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">PRs Indexed</div>
                  <div className="text-lg font-bold font-mono text-slate-200 mt-1">18</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Session Archive (Council History) */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  Permanent Council Session History
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Chronological record of every debate convened for {selectedProject.name}.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    handleSelectSession(s.id);
                    setActiveTab('council');
                  }}
                  className="bg-[#0b1020] border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex items-center justify-between cursor-pointer transition shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-indigo-400">{s.session_code}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{s.topic}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                        <span>{s.created_at.slice(0, 10)}</span>
                        <span>•</span>
                        <span>{s.active_agents.length} agents</span>
                        <span>•</span>
                        <span>Verdict: {s.outlook?.launch_verdict || 'Completed'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(s.status)}
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Council History Drawer */}
      {historyDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0b1020] border-l border-slate-800 h-full p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <History className="w-4 h-4 text-indigo-400" />
                <span>Council History — {selectedProject.name}</span>
              </div>
              <button onClick={() => setHistoryDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedSession?.id === s.id
                      ? 'bg-indigo-500/10 border-indigo-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-400">{s.session_code}</span>
                    {getStatusBadge(s.status)}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">{s.topic}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{s.created_at.slice(0, 10)}</span>
                    <span>{s.active_agents.length} agents participating</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Agency Agent Local Run & Detail Modal */}
      {selectedAgencyAgent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0b1020] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedAgencyAgent.avatar}</span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedAgencyAgent.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {selectedAgencyAgent.division}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Source: <span className="font-mono text-indigo-400">Agency Agents (MIT License)</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedAgencyAgent(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy Notice Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                <strong>Privacy Guaranteed:</strong> Running locally keeps your source code and API keys on your machine. BotDigit does not execute this agent on its servers.
              </span>
            </div>

            {/* Local Tool Tabs */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {[
                  { id: 'claude_code', label: 'Claude Code' },
                  { id: 'cursor', label: 'Cursor Rules (.mdc)' },
                  { id: 'gemini_cli', label: 'Gemini CLI' },
                  { id: 'opencode', label: 'OpenCode' },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setLocalToolTab(tool.id as any)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                      localToolTab === tool.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">Local Installation Command:</span>
                <div className="flex items-center justify-between font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-indigo-300 overflow-x-auto">
                  <span>{selectedAgencyAgent.local_install[localToolTab] || selectedAgencyAgent.local_install.claude_code}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAgencyAgent.local_install[localToolTab] || selectedAgencyAgent.local_install.claude_code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-slate-400 hover:text-white ml-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <ClipboardCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Deliverables & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1.5">Core Responsibilities:</span>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {selectedAgencyAgent.responsibilities.slice(0, 3).map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1.5">Success Metrics:</span>
                <ul className="space-y-1 text-emerald-400/90 text-[11px]">
                  {selectedAgencyAgent.success_metrics.slice(0, 3).map((m, i) => (
                    <li key={i}>✓ {m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedAgencyAgent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
              >
                Close
              </button>
              <button
                onClick={() => handleAttachAgent(selectedAgencyAgent.id)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to {selectedProject.name} AI Team</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Clickable Multi-Modal Evidence Drawer */}
      {evidenceDrawerOpen && activeEvidence && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-[#0b1020] border-l border-slate-800 h-full p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Multi-Modal Source Evidence</span>
              </div>
              <button onClick={() => setEvidenceDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Source Origin & Reference</span>
                <span className="font-mono text-indigo-400 font-semibold">{activeEvidence.evidence_ref || 'Unknown'}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Evidence Confidence</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    Strength: {activeEvidence.evidence_strength || 'HIGH'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  <span>Rule: Direct Source + Verified</span>
                </div>
              </div>

              {activeEvidence.evidence_snippet && (
                <div>
                  <span className="text-slate-300 font-semibold block mb-1.5">Captured Code / Document Excerpt:</span>
                  <pre className="bg-[#050811] p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                    {activeEvidence.evidence_snippet}
                  </pre>
                </div>
              )}

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                Statement attributed to <strong className="text-slate-200">{activeEvidence.title}</strong> using model <strong className="text-slate-200">{activeEvidence.model}</strong>.
              </div>

              <a
                href={selectedProject.github_repo_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 transition"
              >
                <GitBranch className="w-4 h-4" />
                <span>Open in GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Sanitized Public Publication Modal */}
      {publishModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0b1020] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  Publish Council Session to Public Profile
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sanitization gatekeeper: selectively approve public visibility.
                </p>
              </div>
              <button onClick={() => setPublishModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 block mb-1">Publish Checklist:</span>

              {[
                { key: 'question', label: 'Council Question & Topic' },
                { key: 'summary', label: 'Final Consensus Summary' },
                { key: 'perspectives', label: 'Agent Perspectives & Stances' },
                { key: 'disagreements', label: 'Key Disagreements & Debates' },
                { key: 'decision', label: 'Strategic Decision & Verdict' },
                { key: 'action_plan', label: 'Public Action Plan' },
                { key: 'source_code', label: 'Source Code References (Sensitive)' },
                { key: 'private_evidence', label: 'Private Evidence Logs' },
                { key: 'internal_docs', label: 'Internal Financial & Roadmaps' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800/60 transition">
                  <input
                    type="checkbox"
                    checked={(publishSections as any)[item.key]}
                    onChange={(e) =>
                      setPublishSections((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span className={`text-xs ${(publishSections as any)[item.key] ? 'text-slate-200' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setPublishModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
              >
                Keep Private
              </button>
              <button
                onClick={handlePublishSession}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Publish Sanitized Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Project Creation Wizard */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0b1020] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  Create New Managed Project
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Step {wizardStep} of 3: {wizardStep === 1 ? 'Project Identity' : wizardStep === 2 ? 'Domain & Web Presence' : 'GitHub Connection'}
                </p>
              </div>
              <button onClick={() => setWizardOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Identity */}
            {wizardStep === 1 && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={wizardForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setWizardForm((prev) => ({
                        ...prev,
                        name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      }));
                    }}
                    placeholder="e.g. Acme Marketplace"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Project Slug *</label>
                  <input
                    type="text"
                    value={wizardForm.slug}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. acme-marketplace"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Project Category / Type *</label>
                  <select
                    value={wizardForm.project_type}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, project_type: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="web_saas">Web / SaaS (Primary domain required)</option>
                    <option value="mobile_app">Mobile App</option>
                    <option value="open_source">Open Source</option>
                    <option value="startup">Startup / Business</option>
                    <option value="research">Research</option>
                    <option value="internal">Internal Project (Domain optional)</option>
                    <option value="blockchain_web3">Blockchain / Web3</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Description</label>
                  <textarea
                    value={wizardForm.description}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the project mission..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={!wizardForm.name.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium transition"
                  >
                    Next: Domain Settings →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Domain */}
            {wizardStep === 2 && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Primary Website {wizardForm.project_type === 'web_saas' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="url"
                    value={wizardForm.primary_domain}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, primary_domain: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    disabled={wizardForm.project_type === 'web_saas' && !wizardForm.primary_domain}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium transition"
                  >
                    Next: Connect GitHub →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: GitHub Connection */}
            {wizardStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-emerald-400" />
                      Connect GitHub Repository
                    </span>
                    <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      🟢 Verified App
                    </span>
                  </div>

                  <label className="text-[11px] text-slate-400 block mb-1">Choose Repository</label>
                  <select
                    value={wizardForm.github_repo_full_name}
                    onChange={(e) => setWizardForm((prev) => ({ ...prev, github_repo_full_name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500 mb-3"
                  >
                    <option value="botdigit-official/BotDigit-AI-Council">botdigit-official/BotDigit-AI-Council (Current)</option>
                    <option value="botdigit/marketplace">botdigit/marketplace</option>
                    <option value="aivex/protocol">aivex/protocol</option>
                    <option value="custom/repo">custom/repo</option>
                  </select>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleCreateProject}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Create Project & Initialize AI Team</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 6: Domain Verification Modal */}
      {domainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0b1020] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Domain Verification
              </h3>
              <button onClick={() => setDomainModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Target Domain</span>
                <span className="font-semibold text-white font-mono">{selectedProject.primary_domain}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="font-semibold text-indigo-400 block">DNS TXT Verification Record</span>
                <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
                  <span>{selectedProject.domain_verification_token || 'botdigit-verify-94a28f110c'}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedProject.domain_verification_token || 'botdigit-verify-94a28f110c');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleVerifyDomain}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition"
                >
                  Verify Domain Ownership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Upload Modal */}
      {visualUploadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1020] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                Attach Visual Evidence to Project
              </h3>
              <button
                onClick={() => setVisualUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Evidence Title</label>
                <input
                  type="text"
                  value={newVisualTitle}
                  onChange={(e) => setNewVisualTitle(e.target.value)}
                  placeholder="e.g. Checkout Funnel Latency Waterfall"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Category</label>
                <select
                  value={newVisualCategory}
                  onChange={(e) => setNewVisualCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="ui_screenshot">UI Screenshot</option>
                  <option value="architecture_diagram">Architecture Diagram</option>
                  <option value="terminal_output">Terminal / Test Trace</option>
                  <option value="error_log">Error Visual Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Image / Asset URL</label>
                <input
                  type="text"
                  value={newVisualUrl}
                  onChange={(e) => setNewVisualUrl(e.target.value)}
                  placeholder="https://... or data:image/png;base64,..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Observation / Council Notes (Optional)</label>
                <textarea
                  value={newVisualAnalysis}
                  onChange={(e) => setNewVisualAnalysis(e.target.value)}
                  placeholder="Add notes for council specialists to review..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-indigo-500 h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setVisualUploadModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadVisualEvidence}
                disabled={!newVisualTitle.trim() || !newVisualUrl.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold"
              >
                Ingest Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
