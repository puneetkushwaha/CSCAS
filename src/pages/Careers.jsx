import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, ArrowRight, Target, Shield, Briefcase, Globe,
    ShieldCheck, Layers, Eye, ChevronRight, X, CheckCircle2,
    Terminal, Cloud, FileText, Brain, Lock, ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';

const universalFoundationData = {
    title: "0) UNIVERSAL FOUNDATION",
    color: "blue",
    certifications: ["FOUNDATION"],
    sections: [
        {
            id: "0.1",
            title: "NETWORKING FUNDAMENTALS",
            skills: ["OSI/TCP-IP model", "Firewall basics", "DNS, DHCP, ARP, ICMP", "VPN, VLAN, NAT, Proxy"],
            tools: ["Wireshark", "tcpdump", "Termshark", "Ping, traceroute, mtr", "Nmap basics", "Hping3 for packet crafting"]
        },
        {
            id: "0.2",
            title: "LINUX FUNDAMENTALS",
            skills: ["File permissions", "Cron jobs", "SSH hardening", "Sudo misconfigs", "Process control", "Linux services"],
            tools: ["grep", "sed", "awk", "systemctl", "ps", "lsof", "strace", "tcpdump", "netstat / ss", "tmux", "screen"]
        },
        {
            id: "0.3",
            title: "WINDOWS FUNDAMENTALS",
            skills: ["Registry", "Services", "PowerShell scripting", "Basics of Active Directory"],
            tools: ["Sysinternals Suite", "PowerShell ISE", "WinDbg", "ADExplorer"]
        },
        {
            id: "0.4",
            title: "SCRIPTING ESSENTIALS",
            skills: ["Python3", "Bash", "PowerShell", "JavaScript basics"],
            tools: ["VSCode", "Jupyter", "Pyenv", "Pipx"]
        }
    ],
    outcome: "Outcome: Ready for any cyber track."
};

const finalCareerPathsData = {
    title: "7) FINAL CAREER PATHS",
    color: "lh-purple",
    certifications: ["CISO TRACK"],
    sections: [
        {
            id: "7.1",
            title: "OFFENSIVE ROLES",
            skills: ["Pentester", "Red Teamer", "Mobile Pentester", "Adversary Simulation Specialist", "Initial Access Engineer", "C2 Operator"],
            tools: []
        },
        {
            id: "7.2",
            title: "DEFENSIVE ROLES",
            skills: ["SOC Analyst", "Threat Hunter", "DFIR Specialist", "Malware Analyst"],
            tools: []
        },
        {
            id: "7.3",
            title: "CLOUD/DEVSECOPS",
            skills: ["Cloud Security Engineer", "DevSecOps Specialist"],
            tools: []
        },
        {
            id: "7.4",
            title: "AI SECURITY",
            skills: ["AI Security Engineer", "AI Red Teamer"],
            tools: []
        },
        {
            id: "7.5",
            title: "GOVERNANCE",
            skills: ["ISO Auditor", "Compliance Manager"],
            tools: []
        }
    ],
    outcome: "Outcome: TRUE cybersecurity leader."
};

const redTeamRoadmapData = {
    title: "1) RED TEAM / OFFENSIVE SECURITY",
    certifications: ["CVS-WAPT", "CVS-APT", "CVS-MAPT", "CVS-RTO"],
    sections: [
        {
            id: "1.1",
            title: "RECON & INFORMATION GATHERING",
            skills: [
                "Passive reconnaissance",
                "OSINT intel mining",
                "Attack surface discovery",
                "DNS mapping",
                "Cloud footprinting"
            ],
            tools: [
                "Amass (Full modes)", "Subfinder", "Sublist3r", "Assetfinder", "Findomain", "Aquatone",
                "GoWitness", "EyeWitness", "Nmap NSE library", "Naabu", "Masscan", "dnsrecon",
                "dnsenum", "Knockpy", "WhatWeb", "Wappalyzer CLI", "Shodan / Censys / FOFA",
                "reconFTW (framework)", "theHarvester", "Maltego CE", "SpiderFoot", "CloudEnum",
                "s3scanner", "Gitleaks", "TruffleHog"
            ]
        },
        {
            id: "1.2",
            title: "WEB APPLICATION PENTESTING (WAPT)",
            skills: [
                "OWASP Top 10",
                "Business logic exploitation",
                "API pentesting",
                "SSRF, XXE, RCE",
                "JSON/GraphQL hacking"
            ],
            tools: [
                "Burp Suite Pro (All extensions)", "OWASP ZAP", "SQLmap", "XSS Hunter", "XSStrike",
                "DalFox", "FFUF", "WFuzz", "Nuclei (all community templates)", "HTTPX", "Dirsearch",
                "Feroxbuster", "ParamSpider", "Arjun", "Postman / Insomnia", "WPScan / JoomScan / Droopescan",
                "GraphQLmap", "Kiterunner", "JWT_Tool", "UA-Fuzzer", "Jaeles", "tplmap", "SSRFmap", "CRLFuzz"
            ]
        },
        {
            id: "1.3",
            title: "SYSTEM & NETWORK EXPLOITATION (APT)",
            skills: [
                "Shell spawning",
                "Payload creation",
                "Windows privilege escalation",
                "Linux privilege escalation",
                "Active Directory hacking",
                "Credential dumping",
                "Pivoting & tunneling"
            ],
            tools: [
                "Metasploit Framework", "MSFvenom", "Impacket Full Suite", "CrackMapExec (CME)",
                "BloodHound + SharpHound", "Responder", "Inveigh", "Evil-WinRM", "Rubeus", "Mimikatz",
                "PowerView", "PowerUp", "PEASS-ng (WinPEAS / LinPEAS)", "Certipy (ADCS attacks)",
                "Kerbrute", "Nmap NSE exploit scripts", "Chisel", "Ligolo-NG", "Socat", "SSHuttle",
                "Hydra / Medusa / Patator", "Hashcat", "John the Ripper", "GPP-decrypt", "LaZagne",
                "LDAPDomainDump", "CrackStation", "BloodHound Enterprise Graphs", "EternalBlue scripts",
                "Zerologon exploit PoCs"
            ]
        },
        {
            id: "1.4",
            title: "MOBILE PENTESTING (MAPT)",
            skills: [
                "APK decompiling",
                "Dynamic instrumentation",
                "Frida scripting",
                "API abuse",
                "SSL pinning bypass",
                "iOS security model"
            ],
            tools: [
                "MobSF", "Jadx", "Apktool", "Frida", "Objection", "Drozer", "ADB",
                "Burp Mobile Config", "SSL Kill Switch 2", "Hopper / Ghidra", "jadx-gui"
            ]
        },
        {
            id: "1.5",
            title: "RED TEAM OPERATIONS (RTO)",
            skills: [
                "Adversary Simulation (MITRE ATT&CK)",
                "Social engineering",
                "Initial access",
                "C2 operations",
                "Lateral movement",
                "Persistency",
                "Evasion / OPSEC"
            ],
            toolGroups: [
                {
                    name: "BIG C2 TOOLKIT",
                    tools: ["Cobalt Strike", "Sliver C2", "Mythic", "Covenant", "Havoc Framework", "Empire", "Koadic", "Merlin", "Brute Ratel (BRc4)", "Silent Trinity"]
                },
                {
                    name: "Phishing Tools",
                    tools: ["Evilginx2", "Modlishka", "Gophish", "KingPhisher"]
                },
                {
                    name: "Loaders / Obfuscators",
                    tools: ["Donut", "ScareCrow", "Chimera", "NimPlant", "Garble obfuscator", "Binary Ninja (optional)"]
                },
                {
                    name: "OPSEC Tools",
                    tools: ["Timestomping tools", "log-falsifier tools", "ProcDump", "SharpCollection"]
                }
            ]
        }
    ],
    outcome: "Outcome: TRUE red team operator."
};

const blueTeamRoadmapData = {
    title: "2) BLUE TEAM / DEFENSIVE SECURITY",
    color: "blue",
    certifications: ["CVS-SOC", "CVS-TMDR", "CVS-DFIR", "CVS-MAP"],
    sections: [
        {
            id: "2.1",
            title: "SOC ANALYST (TIER 1–2)",
            skills: [
                "SIEM monitoring",
                "Asset-based alert triage",
                "Correlation rules",
                "Log parsing",
                "Reporting"
            ],
            tools: [
                "Splunk", "ELK Stack", "Wazuh", "AlienVault OSSIM", "Sysmon", "Zeek",
                "Suricata", "Sigma rules", "Arkime", "Security Onion"
            ]
        },
        {
            id: "2.2",
            title: "THREAT MONITORING + DETECTION (TMDR)",
            skills: [
                "Threat intelligence",
                "Detection engineering",
                "IOC enrichment",
                "Hunt queries"
            ],
            tools: [
                "YARA", "STIX/TAXII", "Velociraptor", "MISP", "Intezer",
                "VirusTotal Enterprise", "GreyNoise", "JA3 fingerprinting",
                "Red Canary Atomic Red Team"
            ]
        },
        {
            id: "2.3",
            title: "DFIR (FORENSICS)",
            skills: [
                "Disk forensics",
                "Memory analysis",
                "Timeline analysis",
                "Malware behavior analysis"
            ],
            tools: [
                "Volatility / Volatility3", "Autopsy", "FTK Imager", "KAPE", "Plaso",
                "Chainsaw", "PacketTotal", "EricZimmerman Tools", "CyberChef"
            ]
        },
        {
            id: "2.4",
            title: "MALWARE ANALYSIS (MAP)",
            skills: [
                "Static analysis",
                "Dynamic analysis",
                "Deobfuscation",
                "PE analysis",
                "Ransomware behavior"
            ],
            tools: [
                "Ghidra", "IDA Free", "x64dbg", "OllyDbg", "PE Studio", "Detect-It-Easy",
                "CAPA", "ProcMon / ProcExplorer", "RegShot", "Any.Run", "Cuckoo Sandbox"
            ]
        }
    ],
    outcome: "Outcome: TRUE blue team operator."
};

const cloudRoadmapData = {
    title: "3) CLOUD SECURITY TRACK (CPCS)",
    color: "cyan",
    certifications: ["CPCS"],
    sections: [
        {
            id: "3.1",
            title: "CLOUD HARDENING & OPERATIONS",
            skills: [
                "IAM hardening",
                "Cloud networking",
                "Cloud attacks",
                "Cloud monitoring",
                "Cloud incident response"
            ],
            tools: [
                "ScoutSuite", "Prowler", "Pacu (AWS exploitation)", "CloudSploit",
                "Trivy", "Checkov", "Burp Suite for API & cloud", "AWS CLI",
                "Azure CLI", "GCP CLI", "KubeHound"
            ]
        }
    ],
    outcome: "Outcome: TRUE cloud security specialist."
};

const devSecOpsRoadmapData = {
    title: "4) DEVSECOPS SECURITY TRACK (CPDSO)",
    color: "green",
    certifications: ["CPDSO"],
    sections: [
        {
            id: "4.1",
            title: "PIPELINE & CONTAINER SECURITY",
            skills: [
                "CI/CD security",
                "SAST, SCA, DAST",
                "Container & K8s security",
                "Secrets scanning"
            ],
            tools: [
                "Jenkins", "GitHub Actions", "GitLab CI/CD", "Docker", "Kubernetes",
                "Helm", "ArgoCD", "Trivy", "Clair", "Anchore", "Checkov",
                "SonarQube", "Snyk", "Semgrep", "OWASP Dependency Check"
            ]
        }
    ],
    outcome: "Outcome: TRUE DevSecOps engineer."
};

const aiRoadmapData = {
    title: "5) AI SECURITY TRACK (AISEC)",
    color: "purple",
    certifications: ["AISEC"],
    sections: [
        {
            id: "5.1",
            title: "AI & LLM SECURITY",
            skills: [
                "LLM exploit techniques",
                "Prompt Injection",
                "Data poisoning",
                "Model evasion",
                "Adversarial ML"
            ],
            tools: [
                "GPTFuzzer", "LlamaGuard", "ModelScan", "PromptAttack",
                "Adversarial Robustness Toolbox (ART)", "Deepfool scripts",
                "ML Attacks suite"
            ]
        }
    ],
    outcome: "Outcome: TRUE AI security researcher."
};

const governanceRoadmapData = {
    title: "6) GOVERNANCE / ISO 27001 TRACK",
    color: "yellow",
    certifications: ["ISO-27001"],
    sections: [
        {
            id: "6.1",
            title: "COMPLIANCE & RISK GOVERNANCE",
            skills: [
                "ISMS implementation",
                "Risk assessments",
                "Internal auditing",
                "Documentation control"
            ],
            tools: [
                "Drata", "Vanta", "Sprinto", "ISMS Toolkit", "Audit checklist templates"
            ]
        }
    ],
    outcome: "Outcome: TRUE GRC specialist."
};

const RoadmapModal = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    // Explicit color mapping to avoid dynamic tailwind class issues
    const themes = {
        red: {
            accent: 'text-red-500',
            border: 'border-red-500/20',
            bg: 'bg-red-500/10',
            hover: 'hover:bg-red-500',
            tool: 'hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5',
            gradient: 'from-red-500/50',
            skillBg: 'bg-red-500/30',
            skillActive: 'group-hover/item:bg-red-500'
        },
        blue: {
            accent: 'text-blue-500',
            border: 'border-blue-500/20',
            bg: 'bg-blue-500/10',
            hover: 'hover:bg-blue-500',
            tool: 'hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/5',
            gradient: 'from-blue-500/50',
            skillBg: 'bg-blue-500/30',
            skillActive: 'group-hover/item:bg-blue-500'
        },
        cyan: {
            accent: 'text-cyan-500',
            border: 'border-cyan-500/20',
            bg: 'bg-cyan-500/10',
            hover: 'hover:bg-cyan-500',
            tool: 'hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-cyan-500/5',
            gradient: 'from-cyan-500/50',
            skillBg: 'bg-cyan-500/30',
            skillActive: 'group-hover/item:bg-cyan-500'
        },
        green: {
            accent: 'text-green-500',
            border: 'border-green-500/20',
            bg: 'bg-green-500/10',
            hover: 'hover:bg-green-500',
            tool: 'hover:text-green-500 hover:border-green-500/30 hover:bg-green-500/5',
            gradient: 'from-green-500/50',
            skillBg: 'bg-green-500/30',
            skillActive: 'group-hover/item:bg-green-500'
        },
        purple: {
            accent: 'text-purple-500',
            border: 'border-purple-500/20',
            bg: 'bg-purple-500/10',
            hover: 'hover:bg-purple-500',
            tool: 'hover:text-purple-500 hover:border-purple-500/30 hover:bg-purple-500/5',
            gradient: 'from-purple-500/50',
            skillBg: 'bg-purple-500/30',
            skillActive: 'group-hover/item:bg-purple-500'
        },
        yellow: {
            accent: 'text-yellow-500',
            border: 'border-yellow-500/20',
            bg: 'bg-yellow-500/10',
            hover: 'hover:bg-yellow-500',
            tool: 'hover:text-yellow-500 hover:border-yellow-500/30 hover:bg-yellow-500/5',
            gradient: 'from-yellow-500/50',
            skillBg: 'bg-yellow-500/30',
            skillActive: 'group-hover/item:bg-yellow-500'
        }
    };

    const theme = themes[data.color] || themes.red;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-5xl h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Modal Header */}
                <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-10">
                    <div className="space-y-2">
                        <div className={`flex items-center gap-3 ${theme.accent}`}>
                            <Target size={24} />
                            <span className="text-xs font-black uppercase tracking-[0.4em]">Expert Domain Mastery</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-[1000] uppercase tracking-tighter leading-none">
                            {data.title.split(') ')[1].split(' TRACK')[0]} <span className={theme.accent}>ROADMAP</span>
                        </h2>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {data.certifications.map(cert => (
                                <span key={cert} className={`px-3 py-1 ${theme.bg} border ${theme.border} rounded-lg text-[10px] font-black text-white`}>{cert}</span>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white ${theme.hover} transition-all flex self-start md:self-center`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                    <div className="space-y-16">
                        {data.sections.map((section, idx) => (
                            <div key={idx} className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="text-5xl font-[1000] text-white/5 leading-none">{section.id}</div>
                                    <div className={`h-px flex-1 bg-gradient-to-r ${theme.gradient} to-transparent`}></div>
                                    <h3 className="text-xl md:text-2xl font-[1000] uppercase tracking-tight text-white">{section.title}</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    {/* Skills */}
                                    <div className="space-y-6">
                                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} opacity-60 flex items-center gap-2`}>
                                            <CheckCircle2 size={14} /> COMMAND OVER SKILLS
                                        </h4>
                                        <div className="space-y-3">
                                            {section.skills.map((skill, i) => (
                                                <div key={i} className="flex items-start gap-3 group/item">
                                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme.skillBg} ${theme.skillActive} transition-colors`}></div>
                                                    <span className="text-gray-400 group-hover/item:text-white transition-colors text-sm font-medium">{skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tools */}
                                    <div className="space-y-6">
                                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme.accent} opacity-60 flex items-center gap-2`}>
                                            <Terminal size={14} /> TOOLKIT LIST
                                        </h4>
                                        {section.tools ? (
                                            <div className="flex flex-wrap gap-2">
                                                {section.tools.map((tool, i) => (
                                                    <span key={i} className={`px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 ${theme.tool} transition-all`}>
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {section.toolGroups?.map((group, i) => (
                                                    <div key={i} className="space-y-3">
                                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{group.name}</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {group.tools.map((tool, j) => (
                                                                <span key={j} className={`px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 ${theme.tool} transition-all`}>
                                                                    {tool}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Final Outcome */}
                        <div className="pt-16 border-t border-white/5 text-center">
                            <div className={`inline-flex items-center gap-3 px-8 py-4 ${theme.bg} border ${theme.border} rounded-full`}>
                                <ShieldCheck className={theme.accent} size={24} />
                                <span className="text-xl font-[1000] uppercase tracking-tighter text-white">
                                    {data.outcome}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const AuthPromptModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-lh-purple/30 rounded-[40px] p-10 relative overflow-hidden text-center"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative backgrounds */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lh-purple to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-lh-purple/10 blur-[80px] rounded-full"></div>

                <div className="relative z-10 space-y-8">
                    <div className="w-20 h-20 bg-lh-purple/10 rounded-3xl flex items-center justify-center mx-auto border border-lh-purple/20 shadow-[0_0_30px_rgba(188,19,254,0.1)]">
                        <Lock className="text-lh-purple" size={32} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-2xl font-[900] uppercase tracking-tighter text-white">ACCESS RESTRICTED</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            To access our <span className="text-lh-purple font-bold">Elite Roadmap Deep-Dives</span> and technical resources, please sign in to your CSCA account.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-4 bg-lh-purple text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(188,19,254,0.2)]"
                        >
                            Login Now
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                        >
                            Maybe Later
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        Don't have an account? <Link to="/signup" className="text-lh-purple hover:underline">Register here</Link>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Careers = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const roadmapRef = useRef(null);
    const [showFoundationModal, setShowFoundationModal] = useState(false);
    const [showRedTeamModal, setShowRedTeamModal] = useState(false);
    const [showBlueTeamModal, setShowBlueTeamModal] = useState(false);
    const [showCloudModal, setShowCloudModal] = useState(false);
    const [showDevSecOpsModal, setShowDevSecOpsModal] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [showGovernanceModal, setShowGovernanceModal] = useState(false);
    const [showFinalPathsModal, setShowFinalPathsModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const checkAuthAndExecute = (action) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        action();
    };

    const careerSectors = [
        {
            title: "Explore Tech Careers",
            desc: "Red Team Operator | SOC Analyst | Cloud Security Engineer | Threat Intelligence Analyst | Cyber Law & Compliance Specialist | AI Security Engineer | Security Architect | CISO Track",
            icon: <Briefcase size={40} className="text-lh-purple" />,
            border: "border-lh-purple/20",
            stats: "Elite Roles",
            link: "/tech-careers"
        },
        {
            title: "Explore Industry Sectors",
            desc: "Comprehensive insights into critical industries driving global cybersecurity adoption and technical defense strategies.",
            icon: <Globe size={40} className="text-blue-500" />,
            border: "border-blue-500/20",
            stats: "Global Insights",
            link: "/industry-sectors"
        },
        {
            title: "Global Certifications",
            desc: "Industry-standard certifications from Red Team Ops to Blue Team, Cloud Security, AI, and GRC pathways.",
            icon: <ShieldCheck size={40} className="text-red-500" />,
            border: "border-red-500/20",
            stats: "Official Standard",
            link: "/certifications"
        },
        {
            title: "Explore Careers+",
            desc: "Dive deeper into your career possibilities with Careers+, a curated roadmap of in-demand cybersecurity jobs.",
            icon: <Layers size={40} className="text-orange-500" />,
            border: "border-orange-500/20",
            stats: "Curated Roadmaps",
            link: "/careers-plus"
        }
    ];

    const scrollToCareerPaths = () => {
        document.getElementById('career-paths')?.scrollIntoView({ behavior: 'smooth' });
    };

    const downloadRoadmap = async () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;

        const addHeader = (pageNum) => {
            // Background branding
            doc.setFillColor(10, 10, 10);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // Header
            doc.setFillColor(188, 19, 254);
            doc.rect(0, 0, pageWidth, 2, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.text("CSCA GLOBAL MEGA ROADMAP", pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text("ULTRA-DEEP TECHNICAL MAPPING | CAREER GUIDE 2026", pageWidth / 2, 28, { align: 'center' });

            // Watermark
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.1 }));
            doc.setFontSize(60);
            doc.setTextColor(255, 255, 255);
            doc.text("CSCA GLOBAL", pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
            doc.restoreGraphicsState();
        };

        const addFooter = (pageNum) => {
            doc.setFillColor(188, 19, 254);
            doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

            doc.setFontSize(9);
            doc.setTextColor(255, 255, 255);
            doc.text("© 2026 CODEVIRUS SECURITY CERTIFICATION AUTHORITY (CSCA)", 15, pageHeight - 7);
            doc.text("Contact: certifications@csca.global | www.csca.global", pageWidth - 15, pageHeight - 7, { align: 'right' });
            doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 7, { align: 'center' });
        };

        const allData = [
            universalFoundationData,
            redTeamRoadmapData,
            blueTeamRoadmapData,
            cloudRoadmapData,
            devSecOpsRoadmapData,
            aiRoadmapData,
            governanceRoadmapData,
            finalCareerPathsData
        ];

        let pageNum = 1;
        addHeader(pageNum);
        yPos = 40;

        allData.forEach((track, idx) => {
            // Check if track title fits
            if (yPos > pageHeight - 60) {
                addFooter(pageNum);
                doc.addPage();
                pageNum++;
                addHeader(pageNum);
                yPos = 40;
            }

            // Track Header
            doc.setFontSize(14);
            doc.setTextColor(188, 19, 254);
            doc.text(track.title, 15, yPos);
            yPos += 8;

            track.sections.forEach(section => {
                if (yPos > pageHeight - 40) {
                    addFooter(pageNum);
                    doc.addPage();
                    pageNum++;
                    addHeader(pageNum);
                    yPos = 40;
                }

                doc.setFontSize(11);
                doc.setTextColor(255, 255, 255);
                doc.text(`${section.id} ${section.title}`, 20, yPos);
                yPos += 6;

                // Skills
                if (section.skills && section.skills.length > 0) {
                    doc.setFontSize(9);
                    doc.setTextColor(180, 180, 180);
                    const skillText = "Skills: " + section.skills.join(", ");
                    const skillLines = doc.splitTextToSize(skillText, pageWidth - 40);
                    doc.text(skillLines, 25, yPos);
                    yPos += (skillLines.length * 5);
                }

                // Tools
                if (section.tools && section.tools.length > 0) {
                    doc.setFontSize(9);
                    doc.setTextColor(180, 180, 180);
                    const toolText = "Tools: " + section.tools.join(", ");
                    const toolLines = doc.splitTextToSize(toolText, pageWidth - 40);
                    doc.text(toolLines, 25, yPos);
                    yPos += (toolLines.length * 5);
                }

                // Tool Groups (for RTO)
                if (section.toolGroups && section.toolGroups.length > 0) {
                    section.toolGroups.forEach(group => {
                        if (yPos > pageHeight - 30) {
                            addFooter(pageNum);
                            doc.addPage();
                            pageNum++;
                            addHeader(pageNum);
                            yPos = 40;
                        }
                        doc.setFontSize(8);
                        doc.setTextColor(150, 150, 150);
                        const groupText = `${group.name}: ${group.tools.join(", ")}`;
                        const groupLines = doc.splitTextToSize(groupText, pageWidth - 45);
                        doc.text(groupLines, 30, yPos);
                        yPos += (groupLines.length * 4) + 2;
                    });
                }

                yPos += 5;
            });

            doc.setFontSize(10);
            doc.setTextColor(188, 19, 254);
            doc.text(track.outcome, 20, yPos);
            yPos += 15;
        });

        addFooter(pageNum);
        doc.save('CSCA-Global-Mega-Roadmap.pdf');
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* --- Section 1: Hero --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Abstract Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lh-purple/20 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 relative z-10"
                    >
                        <div className="flex items-center gap-3 text-lh-purple">
                            <Eye size={20} strokeWidth={2.5} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Elite Career Mapping</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-[900] leading-[1.2] tracking-tighter uppercase max-w-4xl">
                            Build a <span className="text-lh-purple">Cyber Career</span> <br />
                            <span className="text-white opacity-40 outline-text">That Actually Pays</span> — <br />
                            <span className="text-white/80">Not Just A Certificate</span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                            CSCA maps real-world cybersecurity roles across Red Team, Blue Team, Cloud, GRC, AI Security, and Digital Forensics — aligned with real industry demand.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => checkAuthAndExecute(() => setShowFoundationModal(true))}
                                className="bg-lh-purple text-white py-4 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(188,19,254,0.3)]"
                            >
                                Start Your Journey
                            </button>
                            <button
                                onClick={() => checkAuthAndExecute(downloadRoadmap)}
                                className="border border-white/10 backdrop-blur-md py-4 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                                <Download size={16} /> Download Roadmap
                            </button>
                        </div>
                    </motion.div>

                    {/* Premium Image Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative flex justify-center items-center h-[500px] lg:h-[600px] order-first lg:order-last"
                    >
                        {/* Background Halo */}
                        <div className="absolute inset-0 bg-lh-purple/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>

                        {/* Glass Card Backdrop */}
                        <div className="absolute w-[80%] h-[70%] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[60px] transform -rotate-6"></div>

                        {/* The Main Character Image */}
                        <img
                            src={ngdPic}
                            alt="Cyber Professional"
                            className="relative z-10 w-full max-w-[450px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)]"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- NEW: Explore Career Path Section --- */}
            <section id="career-paths" className="py-24 px-6 relative z-10 bg-gradient-to-b from-transparent to-[#0a0a0a]">
                <div className="max-w-[1400px] mx-auto">
                    {/* Intro */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Target className="text-lh-purple" size={24} />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black text-lh-purple">EXPLORE Career Path</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-[900] tracking-tighter uppercase mb-6">
                            Cybersecurity is <span className="text-lh-purple">not one role.</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed font-medium">
                            It's an ecosystem of attackers, defenders, cloud architects, AI specialists, and governance leaders.
                            <br /><span className="text-white font-bold">Choose your domain. Build your mastery.</span>
                        </p>
                    </motion.div>

                    {/* Career Tracks Grid */}
                    <div className="space-y-12">
                        {/* RED TEAM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-red-500/20 hover:border-red-500/40 transition-all duration-500"
                        >
                            <div className="grid lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-red-500/10 rounded-2xl">
                                            <Target className="text-red-500" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-[900] uppercase tracking-tight text-white">🛡️ RED TEAM / OFFENSIVE SECURITY</h3>
                                            <p className="text-red-500 font-bold text-sm mt-1">Break Systems. Expose Weaknesses. Strengthen Defense.</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed">
                                        Offensive security professionals simulate real-world attacks to uncover vulnerabilities before adversaries do.
                                    </p>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Ethical Hackers', 'Pentesters', 'Red Team Operators', 'Bug Bounty Hunters'].map((role, i) => (
                                                <span key={i} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-white">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Core Skills Covered:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Exploitation frameworks', 'Privilege escalation', 'Post-exploitation', 'Web & API hacking', 'Active Directory attacks'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                    <CheckCircle2 size={16} className="text-red-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple mb-4">Certifications:</h4>
                                        <div className="space-y-3">
                                            {[
                                                { code: 'CVS-APT', name: 'Advanced Penetration Testing' },
                                                { code: 'CVS-WAPT', name: 'Web Application Penetration Testing' },
                                                { code: 'CVS-MAPT', name: 'Mobile Application Pentesting' },
                                                { code: 'CVS-RTO', name: 'Red Team Operations' }
                                            ].map((cert, i) => (
                                                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="font-black text-white text-sm">{cert.code}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{cert.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => checkAuthAndExecute(() => setShowRedTeamModal(true))}
                                        className="w-full py-3 px-6 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        View Red Team Roadmap <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* BLUE TEAM */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500"
                        >
                            <div className="grid lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-blue-500/10 rounded-2xl">
                                            <Shield className="text-blue-500" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-[900] uppercase tracking-tight text-white">🔷 BLUE TEAM / DEFENSIVE SECURITY</h3>
                                            <p className="text-blue-500 font-bold text-sm mt-1">Detect. Respond. Contain.</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed">
                                        Defensive professionals monitor threats, investigate breaches, and defend enterprise environments in real time.
                                    </p>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['SOC Analysts', 'Incident Responders', 'Threat Hunters', 'Malware Analysts'].map((role, i) => (
                                                <span key={i} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-white">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Core Skills Covered:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Threat detection', 'Log analysis', 'Incident response', 'Forensics investigation', 'Malware dissection'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                    <CheckCircle2 size={16} className="text-blue-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple mb-4">Certifications:</h4>
                                        <div className="space-y-3">
                                            {[
                                                { code: 'CVS-SOC', name: 'SOC Operations & SIEM Analysis' },
                                                { code: 'CVS-TMDR', name: 'Threat Monitoring & Detection' },
                                                { code: 'CVS-DFIR', name: 'Digital Forensics & Incident Response' },
                                                { code: 'CVS-MAP', name: 'Malware Analysis Professional' }
                                            ].map((cert, i) => (
                                                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="font-black text-white text-sm">{cert.code}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{cert.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => checkAuthAndExecute(() => setShowBlueTeamModal(true))}
                                        className="w-full py-3 px-6 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        View Blue Team Roadmap <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* CLOUD & DEVSECOPS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500"
                        >
                            <div className="grid lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-cyan-500/10 rounded-2xl">
                                            <Cloud className="text-cyan-500" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-[900] uppercase tracking-tight text-white">☁ CLOUD & DEVSECOPS</h3>
                                            <p className="text-cyan-500 font-bold text-sm mt-1">Secure the Infrastructure of the Future.</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 leading-relaxed">
                                        Cloud-native systems demand proactive security embedded into development pipelines.
                                    </p>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Cloud Engineers', 'DevOps Professionals', 'Security Architects'].map((role, i) => (
                                                <span key={i} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-white">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white/60 mb-3">Core Skills Covered:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Cloud threat modeling', 'IAM security', 'CI/CD pipeline protection', 'Container security', 'Infrastructure as Code security'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                    <CheckCircle2 size={16} className="text-cyan-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest text-lh-purple mb-4">Certifications:</h4>
                                        <div className="space-y-3">
                                            {[
                                                { code: 'CSCA-CPCS', name: 'Cloud Security Specialist', pending: true },
                                                { code: 'CSCA-CPDSO', name: 'DevSecOps Professional', pending: true }
                                            ].map((cert, i) => (
                                                <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="font-black text-white text-sm flex items-center gap-2">
                                                        {cert.code}
                                                        {cert.pending && <span className="text-[10px] px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full">Pending</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{cert.name}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => checkAuthAndExecute(() => setShowCloudModal(true))}
                                            className="w-full py-3 px-6 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs font-black uppercase tracking-widest text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            View Cloud Roadmap <ChevronRight size={14} />
                                        </button>
                                        <button
                                            onClick={() => checkAuthAndExecute(() => setShowDevSecOpsModal(true))}
                                            className="w-full py-3 px-6 bg-green-500/10 border border-green-500/30 rounded-full text-xs font-black uppercase tracking-widest text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            View DevSecOps Roadmap <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Grid: AI Security + Governance */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* AI SECURITY */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[40px] bg-white/[0.02] border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-purple-500/10 rounded-2xl">
                                        <Brain className="text-purple-500" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-[900] uppercase tracking-tight text-white">🤖 AI & EMERGING TECH SECURITY</h3>
                                        <p className="text-purple-500 font-bold text-xs mt-1">Secure the Intelligence of Tomorrow.</p>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    AI systems introduce new attack surfaces including model poisoning and prompt injection.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-lh-purple mb-3">Certification:</h4>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <div className="font-black text-white text-sm">CVS-AISEC</div>
                                            <div className="text-xs text-gray-500 mt-1">AI Security Professional</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Skills Covered:</h4>
                                        <div className="space-y-1">
                                            {['AI threat modeling', 'ML model exploitation', 'LLM security risks', 'Data poisoning defense'].map((skill, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                                    <CheckCircle2 size={14} className="text-purple-500" />
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => checkAuthAndExecute(() => setShowAIModal(true))}
                                        className="w-full py-3 px-6 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-black uppercase tracking-widest text-purple-500 hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        View AI Security Roadmap <ChevronRight size={14} />
                                    </button>
                                </div>
                            </motion.div>

                            {/* GOVERNANCE / ISO */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-[40px] bg-white/[0.02] border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-orange-500/10 rounded-2xl">
                                        <FileText className="text-orange-500" size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-[900] uppercase tracking-tight text-white">📜 GOVERNANCE / ISO & COMPLIANCE</h3>
                                        <p className="text-orange-500 font-bold text-xs mt-1">Build Secure Frameworks. Lead Compliance.</p>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    Security leadership requires governance expertise and global framework implementation.
                                </p>

                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">Ideal For:</h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {['Compliance Officers', 'Security Managers', 'Risk Consultants'].map((role, i) => (
                                            <span key={i} className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-white">
                                                {role}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-lh-purple mb-3">Certifications:</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { code: 'CSCA-CPISLI', name: 'ISO 27001 Lead Implementer' },
                                                    { code: 'CSCA-CPISLA', name: 'ISO 27001 Lead Auditor' }
                                                ].map((cert, i) => (
                                                    <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                        <div className="font-black text-white text-xs">{cert.code}</div>
                                                        <div className="text-[10px] text-gray-500 mt-1">{cert.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => checkAuthAndExecute(() => setShowGovernanceModal(true))}
                                            className="w-full py-3 px-6 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-black uppercase tracking-widest text-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            View GRC Roadmap <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Career Path Visual/Progression */}
                    <motion.div
                        ref={roadmapRef}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 p-12 rounded-[40px] bg-gradient-to-br from-lh-purple/5 to-blue-500/5 border border-white/10"
                    >
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-[900] uppercase tracking-tight mb-4">
                                <span className="text-lh-purple">Career Progression</span> Pathways
                            </h3>
                            <p className="text-gray-400">Entry Level → Mid-Level → Advanced → Leadership</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Blue Team Path */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Shield className="inline-block text-blue-500 mb-2" size={32} />
                                    <h4 className="font-black text-white uppercase text-sm">Blue Team Path</h4>
                                </div>
                                <div className="space-y-3">
                                    {['CVS-SOC', 'CVS-TMDR', 'CVS-DFIR'].map((cert, i) => (
                                        <div key={i} className="relative">
                                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-center">
                                                <div className="font-black text-white text-sm">{cert}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    {i === 0 && 'Entry Level'}
                                                    {i === 1 && 'Mid-Level'}
                                                    {i === 2 && 'Advanced'}
                                                </div>
                                            </div>
                                            {i < 2 && (
                                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-blue-500">
                                                    <ChevronRight className="rotate-90" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Red Team Path */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Target className="inline-block text-red-500 mb-2" size={32} />
                                    <h4 className="font-black text-white uppercase text-sm">Red Team Path</h4>
                                </div>
                                <div className="space-y-3">
                                    {['CVS-WAPT', 'CVS-APT', 'CVS-RTO'].map((cert, i) => (
                                        <div key={i} className="relative">
                                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
                                                <div className="font-black text-white text-sm">{cert}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    {i === 0 && 'Entry Level'}
                                                    {i === 1 && 'Mid-Level'}
                                                    {i === 2 && 'Advanced'}
                                                </div>
                                            </div>
                                            {i < 2 && (
                                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-red-500">
                                                    <ChevronRight className="rotate-90" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cloud Path */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Cloud className="inline-block text-cyan-500 mb-2" size={32} />
                                    <h4 className="font-black text-white uppercase text-sm">Cloud & Governance Path</h4>
                                </div>
                                <div className="space-y-3">
                                    {['CPCS', 'CPDSO', 'ISO Lead'].map((cert, i) => (
                                        <div key={i} className="relative">
                                            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-center">
                                                <div className="font-black text-white text-sm">{cert}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    {i === 0 && 'Entry Level'}
                                                    {i === 1 && 'Mid-Level'}
                                                    {i === 2 && 'Leadership'}
                                                </div>
                                            </div>
                                            {i < 2 && (
                                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-cyan-500">
                                                    <ChevronRight className="rotate-90" size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => checkAuthAndExecute(() => setShowFinalPathsModal(true))}
                                className="px-8 py-4 border border-lh-purple/30 bg-lh-purple/5 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-lh-purple hover:text-white transition-all shadow-[0_0_20px_rgba(188,19,254,0.1)] inline-flex items-center gap-3"
                            >
                                <Briefcase size={16} /> View Final Career Paths
                            </button>
                            <button
                                onClick={() => checkAuthAndExecute(downloadRoadmap)}
                                className="px-8 py-4 bg-lh-purple text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(188,19,254,0.3)] inline-flex items-center gap-3"
                            >
                                <Download size={16} /> Download Full Roadmap
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Career Sectors Grid --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-4">
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-4xl font-[900] tracking-tighter uppercase leading-none">
                                Curated <span className="text-lh-purple">Paths</span> <br />
                                For Every Level
                            </h2>
                        </div>
                        <p className="text-gray-400 font-medium max-w-sm">
                            Our roadmap ensures you're ready for industry demand, not just an exam.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {careerSectors.map((sector, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`group bg-white/[0.03] backdrop-blur-md border ${sector.border} p-10 rounded-[40px] flex flex-col justify-between min-h-[450px] transition-all duration-500 hover:bg-[#0a0a0a] hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
                            >
                                <div className="space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div className="p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-lh-purple/20 transition-all duration-500">
                                            {sector.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-lh-purple py-1 px-3 bg-lh-purple/10 rounded-full border border-lh-purple/20">
                                            {sector.stats}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-[900] tracking-tight leading-tight uppercase">{sector.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-semibold">
                                        {sector.desc}
                                    </p>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Link to={sector.link} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white group-hover:text-lh-purple transition-all duration-500">
                                        Learn more <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Roadmap Modals --- */}
            <AnimatePresence>
                <RoadmapModal
                    isOpen={showFoundationModal}
                    onClose={() => setShowFoundationModal(false)}
                    data={universalFoundationData}
                />
                <RoadmapModal
                    isOpen={showRedTeamModal}
                    onClose={() => setShowRedTeamModal(false)}
                    data={{ ...redTeamRoadmapData, color: 'red' }}
                />
                <RoadmapModal
                    isOpen={showBlueTeamModal}
                    onClose={() => setShowBlueTeamModal(false)}
                    data={blueTeamRoadmapData}
                />
                <RoadmapModal
                    isOpen={showCloudModal}
                    onClose={() => setShowCloudModal(false)}
                    data={cloudRoadmapData}
                />
                <RoadmapModal
                    isOpen={showDevSecOpsModal}
                    onClose={() => setShowDevSecOpsModal(false)}
                    data={devSecOpsRoadmapData}
                />
                <RoadmapModal
                    isOpen={showAIModal}
                    onClose={() => setShowAIModal(false)}
                    data={aiRoadmapData}
                />
                <RoadmapModal
                    isOpen={showGovernanceModal}
                    onClose={() => setShowGovernanceModal(false)}
                    data={governanceRoadmapData}
                />
                <RoadmapModal
                    isOpen={showFinalPathsModal}
                    onClose={() => setShowFinalPathsModal(false)}
                    data={finalCareerPathsData}
                />

                <AuthPromptModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Careers;
