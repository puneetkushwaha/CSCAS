import React from 'react';
import {
    Shield, Globe, Cpu, Lock, Terminal, BarChart, Database, Server,
    Cloud, ClipboardCheck, Zap, Target, Monitor,
    ShieldCheck, Award, Laptop, Skull, Search, Activity,
    ShieldAlert
} from 'lucide-react';

const placeholderImg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800";

export const certifications = [
    // RED TEAM / OFFENSIVE SECURITY
    {
        id: 'csca-apt',
        title: 'CSCA-APT – Advanced Penetration Tester',
        code: 'APT',
        image: placeholderImg,
        level: 'Advanced',
        description:
            "CSCA-APT prepares professionals to conduct advanced exploitation and high-impact penetration testing in enterprise environments. Focuses on adversary simulation and stealth operations.",
        category: 'RED TEAM / OFFENSIVE SECURITY',
        icon: <Target className="w-8 h-8 text-white" />,
        color: 'from-red-600 to-red-800',
        price: 399,
    },
    {
        id: 'csca-wapt',
        title: 'CSCA-WAPT – Web Application Penetration Tester',
        code: 'WAPT',
        image: placeholderImg,
        level: 'Specialist',
        description:
            "Provides deep expertise in identifying and exploiting critical vulnerabilities in modern web applications, including API hacking and advanced logic flaws.",
        category: 'RED TEAM / OFFENSIVE SECURITY',
        icon: <Globe className="w-8 h-8 text-white" />,
        color: 'from-red-600 to-red-800',
        price: 399,
    },
    {
        id: 'csca-mapt',
        title: 'CSCA-MAPT – Mobile Application Penetration Tester',
        code: 'MAPT',
        image: placeholderImg,
        level: 'Specialist',
        description:
            "Trains students to attack Android and iOS applications with both static and dynamic analysis techniques, covering reverse engineering and SSL pinning bypass.",
        category: 'RED TEAM / OFFENSIVE SECURITY',
        icon: <Laptop className="w-8 h-8 text-white" />,
        color: 'from-red-600 to-red-800',
        price: 399,
    },
    {
        id: 'csca-rto',
        title: 'CSCA-RTO – Red Team Operations',
        code: 'RTO',
        image: placeholderImg,
        level: 'Expert',
        description:
            "Complete training in full-scope red team engagements. Learn stealthy initial access, OPSEC, persistence, and command-and-control setup.",
        category: 'RED TEAM / OFFENSIVE SECURITY',
        icon: <Skull className="w-8 h-8 text-white" />,
        color: 'from-red-600 to-red-800',
        popular: true,
        price: 399,
    },

    // BLUE TEAM / DEFENSIVE SECURITY
    {
        id: 'csca-soc',
        title: 'CSCA-SOC – SOC Analyst Professional',
        code: 'SOC',
        image: placeholderImg,
        level: 'Associate',
        description:
            "Introduces students to real SOC environments. Build a strong foundation in SIEM monitoring, alert triage, and log analysis workflows.",
        category: 'BLUE TEAM / DEFENSIVE SECURITY',
        icon: <Monitor className="w-8 h-8 text-white" />,
        color: 'from-blue-600 to-indigo-800',
        popular: true,
        price: 399,
    },
    {
        id: 'csca-tmdr',
        title: 'CSCA-TMDR – Threat Monitoring & Detection Response',
        code: 'TMDR',
        image: placeholderImg,
        level: 'Professional',
        description:
            "Develop advanced skills in detection engineering. Design alert pipelines, correlate logs, and hunt for hidden threats mapped to MITRE ATT&CK.",
        category: 'BLUE TEAM / DEFENSIVE SECURITY',
        icon: <Activity className="w-8 h-8 text-white" />,
        color: 'from-blue-600 to-indigo-800',
        price: 399,
    },
    {
        id: 'csca-dfir',
        title: 'CSCA-DFIR – Digital Forensics & Incident Response',
        code: 'DFIR',
        image: placeholderImg,
        level: 'Specialist',
        description:
            "Teaches the complete investigation cycle of digital evidence. Practice memory forensics, disk analysis, and malware triage.",
        category: 'BLUE TEAM / DEFENSIVE SECURITY',
        icon: <Search className="w-8 h-8 text-white" />,
        color: 'from-blue-600 to-indigo-800',
        price: 399,
    },
    {
        id: 'csca-map',
        title: 'CSCA-MAP – Malware Analysis Professional',
        code: 'MAP',
        image: placeholderImg,
        level: 'Professional',
        description:
            "Build strong skills in understanding malicious software behavior. Explore static/dynamic analysis, sandboxing, and basic reverse engineering.",
        category: 'BLUE TEAM / DEFENSIVE SECURITY',
        icon: <ShieldAlert className="w-8 h-8 text-white" />,
        color: 'from-blue-600 to-indigo-800',
        price: 399,
    },

    // CLOUD & DEVSECOPS
    {
        id: 'csca-cpcs',
        title: 'CSCA-CPCS – Certified Cloud Security Specialist',
        code: 'CPCS',
        image: placeholderImg,
        level: 'Specialist',
        description:
            "Secure workloads across AWS, Azure, and GCP. Focuses on IAM protection, cloud networking, and misconfiguration defense.",
        category: 'CLOUD & DEVSECOPS',
        icon: <Cloud className="w-8 h-8 text-white" />,
        color: 'from-cyan-500 to-blue-700',
        price: 399,
    },
    {
        id: 'csca-cpdso',
        title: 'CSCA-CPDSO – Certified DevSecOps Professional',
        code: 'CPDSO',
        image: placeholderImg,
        level: 'Professional',
        description:
            "Integrate security into the modern DevOps lifecycle. Study CI/CD security, automation frameworks, and container protection.",
        category: 'CLOUD & DEVSECOPS',
        icon: <Zap className="w-8 h-8 text-white" />,
        color: 'from-cyan-500 to-blue-700',
        price: 399,
    },

    // AI & EMERGING TECH
    {
        id: 'csca-aisec',
        title: 'CSCA-AISEC – AI Security Professional',
        code: 'AISEC',
        image: placeholderImg,
        level: 'Specialist',
        description:
            "Secure AI systems and protect ML models. Covers prompt attacks, adversarial inputs, and data poisoning mitigation.",
        category: 'AI & EMERGING TECH',
        icon: <Cpu className="w-8 h-8 text-white" />,
        color: 'from-purple-500 to-pink-700',
        price: 399,
    },

    // GOVERNANCE / ISO
    {
        id: 'csca-cpisli',
        title: 'CSCA-CPISLI – ISO 27001 Lead Implementer',
        code: 'CPISLI',
        image: placeholderImg,
        level: 'Professional',
        description:
            "Teaches the full implementation process of an ISO 27001-aligned ISMS. Study risk assessments and policy frameworks.",
        category: 'GOVERNANCE / ISO',
        icon: <ClipboardCheck className="w-8 h-8 text-white" />,
        color: 'from-yellow-500 to-orange-600',
        price: 399,
    },
    {
        id: 'csca-cpisla',
        title: 'CSCA-CPISLA – ISO 27001 Lead Auditor',
        code: 'CPISLA',
        image: placeholderImg,
        level: 'Professional',
        description:
            "Prepare to conduct internal and external audits. Learn audit planning, evidence collection, and gap identification.",
        category: 'GOVERNANCE / ISO',
        icon: <Award className="w-8 h-8 text-white" />,
        color: 'from-yellow-500 to-orange-600',
        price: 399,
    },

    // NETWORK SECURITY
    {
        id: 'csca-snp',
        title: 'CSCA-SNP – Security Network Professional',
        code: 'SNP',
        image: placeholderImg,
        level: 'Professional',
        description:
            "Enterprise network security architecture and defense. Learn firewall rules, VPN setup, and protocol hardening.",
        category: 'NETWORK SECURITY',
        icon: <Server className="w-8 h-8 text-white" />,
        color: 'from-green-600 to-emerald-700',
        price: 399,
    },

    // INCIDENT RESPONSE
    {
        id: 'csca-ir',
        title: 'CSCA-IR – Incident Response Specialist',
        code: 'IR',
        image: placeholderImg,
        level: 'Specialist',
        description:
            "Structured and effective response to cyber incidents. Practice triage, containment, and system recovery procedures.",
        category: 'INCIDENT RESPONSE',
        icon: <ShieldCheck className="w-8 h-8 text-white" />,
        color: 'from-orange-500 to-red-700',
        price: 399,
    },

    // BIG DATA ENGINEERING
    {
        id: 'csca-bde',
        title: 'CSCA-BDE – Big Data Engineering Professional',
        code: 'BDE',
        image: placeholderImg,
        level: 'Professional',
        description:
            "Manage and secure large-scale data environments. Covers pipelines, distributed systems, and cluster architecture.",
        category: 'BIG DATA ENGINEERING',
        icon: <Database className="w-8 h-8 text-white" />,
        color: 'from-pink-500 to-rose-700',
        price: 399,
    },
];
