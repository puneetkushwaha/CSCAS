import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    GraduationCap,
    Building2,
    Briefcase,
    Cpu,
    Percent,
    BookOpen,
    Ticket,
    Globe,
    Megaphone,
    Terminal,
    Scan,
    ArrowRight,
    Server,
    Layers,
    Settings,
    Code,
    ArrowLeft,
    CheckCircle2,
    X,
    User,
    Mail,
    Phone,
    Link2,
    MessageSquare,
    Zap,
    MapPin,
    Users,
    Activity
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ngdPic from '../assets/images/ngd-pic.png';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PartnersEcosystem = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        organizationName: '',
        websiteUrl: '',
        country: '',
        partnerType: '',
        yearsInBusiness: '',
        estimatedStudentsPerYear: '',
        contactPersonName: '',
        officialEmail: '',
        phoneNumber: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.organizationName || !formData.country || !formData.partnerType || !formData.contactPersonName || !formData.officialEmail || !formData.phoneNumber) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/partnerships', formData);
            if (response.data.success) {
                toast.success('Application submitted successfully!');
                setIsFormOpen(false);
                setFormData({
                    organizationName: '',
                    websiteUrl: '',
                    country: '',
                    partnerType: '',
                    yearsInBusiness: '',
                    estimatedStudentsPerYear: '',
                    contactPersonName: '',
                    officialEmail: '',
                    phoneNumber: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    const partnershipBenefits = [
        {
            title: "Revenue Sharing Model",
            desc: "Competitive margins with scalable earning potential.",
            icon: <Percent size={24} />,
            color: "bg-purple-500/20"
        },
        {
            title: "Official Trainer Materials",
            desc: "Access to structured curriculum, lab manuals, and slide decks.",
            icon: <BookOpen size={24} />,
            color: "bg-blue-500/20"
        },
        {
            title: "Exam Vouchers",
            desc: "Discounted certification vouchers for your students.",
            icon: <Ticket size={24} />,
            color: "bg-emerald-500/20"
        },
        {
            title: "Global Recognition",
            desc: "Listed in the official CSCA Partner Directory.",
            icon: <Globe size={24} />,
            color: "bg-orange-500/20"
        },
        {
            title: "Marketing Support",
            desc: "Co-branded assets, social media kits, and launch support.",
            icon: <Megaphone size={24} />,
            color: "bg-rose-500/20"
        }
    ];

    const detailedPartnershipTypes = [
        {
            title: "Academic Partner",
            sub: "For universities, colleges, and institutions.",
            desc: "Integrating CSCA certifications into curriculum to prepare students for real-world cyber roles.",
            bestFor: "Engineering colleges, cybersecurity institutes, training academies",
            benefits: ["Curriculum integration", "Semester-based certification path", "Faculty onboarding support"],
            icon: <GraduationCap size={40} />,
            color: "border-blue-500/20 shadow-blue-500/5",
            iconColor: "text-blue-500"
        },
        {
            title: "Training Partner",
            sub: "For professional training centers and academies.",
            desc: "Enable your academy to deliver top-tier certifications with our official training roadmap.",
            bestFor: "EdTech companies, IT training institutes",
            benefits: ["Revenue share per batch", "Instructor enablement", "Marketing toolkit"],
            icon: <Users size={40} />,
            color: "border-lh-purple/20 shadow-lh-purple/5",
            iconColor: "text-lh-purple"
        },
        {
            title: "Technology Partner",
            sub: "For security vendors, SOC providers, and consulting firms.",
            desc: "Collaborate on custom certification tracks and align your tech stack with CSCA standards.",
            bestFor: "Security startups, MSSPs, consulting firms",
            benefits: ["Enterprise alignment", "Custom certification tracks", "Co-branded programs"],
            icon: <Settings size={40} />,
            color: "border-emerald-500/20 shadow-emerald-500/5",
            iconColor: "text-emerald-500"
        }
    ];

    const howItWorks = [
        { id: 1, title: "Submit Application", desc: "Fill out the detailed form to begin your partnership journey." },
        { id: 2, title: "Review & Approval", desc: "Our ecosystem experts review your business model and reach out." },
        { id: 3, title: "Onboarding & Agreement", desc: "Sign the agreement and receive your customized partner portal login." },
        { id: 4, title: "Access Materials & Portal", desc: "Get all curriculum, instructor kits, and marketing assets." },
        { id: 5, title: "Start Delivering Certifications", desc: "Launch your first batch and certify your students globally." }
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white font-plus-jakarta overflow-x-hidden selection:bg-lh-purple selection:text-white">
            <Navbar />

            {/* Modal Logic */}
            <AnimatePresence>
                {isFormOpen && (
                    <div key="partnership-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        ></motion.div>
                        <motion.div
                            key="modal-content"
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-[32px] p-8 md:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar"
                        >
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-8">
                                <h3 className="text-3xl font-[1000] uppercase tracking-tighter">Partner <span className="text-lh-purple">Application</span></h3>
                                <p className="text-gray-400 mt-2">Become a CSCA authorized partner and lead the change.</p>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                                {/* Org Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Organization Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="organizationName"
                                            value={formData.organizationName}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Your University/Academy"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Website */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Website URL</label>
                                    <div className="relative">
                                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="websiteUrl"
                                            value={formData.websiteUrl}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="https://example.com"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Country */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Country</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="e.g. India"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Partner Type */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Partner Type</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <select
                                            name="partnerType"
                                            value={formData.partnerType}
                                            onChange={handleChange}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="" className="bg-[#0f0f0f]">Select Type</option>
                                            <option value="Academic Partner" className="bg-[#0f0f0f]">Academic Partner</option>
                                            <option value="Training Partner" className="bg-[#0f0f0f]">Training Partner</option>
                                            <option value="Technology Partner" className="bg-[#0f0f0f]">Technology Partner</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Years in Biz */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Years in Business</label>
                                    <div className="relative">
                                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="yearsInBusiness"
                                            value={formData.yearsInBusiness}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="e.g. 5"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Estimated Students */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Est. Students / Year</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="estimatedStudentsPerYear"
                                            value={formData.estimatedStudentsPerYear}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="e.g. 500"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Contact Person */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Contact Person Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="contactPersonName"
                                            value={formData.contactPersonName}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Official Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="officialEmail"
                                            value={formData.officialEmail}
                                            onChange={handleChange}
                                            type="email"
                                            placeholder="john@company.com"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Phone */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                        <input
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Message */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lh-purple px-1">Message / Business Model</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 text-white/30" size={18} />
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Briefly describe your business model..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-lh-purple/50 transition-all text-sm resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex items-center gap-3 py-2">
                                    <input type="checkbox" id="terms" className="w-5 h-5 accent-lh-purple rounded-md cursor-pointer border-white/20" />
                                    <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">I agree to the <span className="text-lh-purple font-bold">CSCA partnership terms & conditions</span>.</label>
                                </div>

                                <button
                                    className={`md:col-span-2 w-full py-5 font-[1000] uppercase tracking-[0.3em] text-xs rounded-2xl transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.1)] ${isSubmitting ? 'bg-gray-500 cursor-not-allowed text-white' : 'bg-white text-black hover:bg-lh-purple hover:text-white'}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- Section 1: Hero --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lh-purple/20 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 relative z-10"
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-lh-purple hover:text-white uppercase text-[10px] tracking-[0.4em] font-black group mb-4"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <div className="flex items-center gap-3 text-lh-purple">
                            <Zap size={20} className="animate-pulse" />
                            <span className="uppercase tracking-[0.4em] text-[11px] font-black">Join the Ecosystem</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-[1000] leading-[1] tracking-tighter uppercase max-w-4xl">
                            Why <span className="text-lh-purple">Partner</span> <br />
                            With CSCA?
                        </h1>

                        <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                            Scale your business with industry-recognized certifications. From official curriculum to revenue sharing, we provide everything you need to succeed.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-lh-purple hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center gap-4 group"
                            >
                                Apply to Partner <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative flex justify-center items-center h-[500px] lg:h-[600px] order-first lg:order-last"
                    >
                        <div className="absolute inset-0 bg-lh-purple/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
                        <div className="absolute w-[80%] h-[70%] bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[60px] transform rotate-3"></div>
                        <img
                            src={ngdPic}
                            alt="CSCA Partner Mascot"
                            className="relative z-10 w-full max-w-[420px] animate-float-glow drop-shadow-[0_0_50px_rgba(188,19,254,0.3)] object-contain"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Section 2: Why Partner Benefits --- */}
            <section className="py-24 px-6 relative z-10 border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-[1300px] mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-lh-purple text-xs font-black uppercase tracking-[0.6em] block">Benefits</span>
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase leading-none">Why Choose <span className="text-lh-purple">Partnership?</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {partnershipBenefits.map((benefit, idx) => (
                            <motion.div
                                key={`benefit-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 bg-white/[0.03] border border-white/10 rounded-[32px] hover:border-lh-purple/30 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform mx-auto`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-tight mb-3 text-center">{benefit.title}</h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed text-center group-hover:text-gray-300 transition-colors">
                                    {benefit.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Section 3: Detailed Partnership Types --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1300px] mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-lh-purple text-xs font-black uppercase tracking-[0.6em] block">Tracks</span>
                        <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase leading-none">Partnership <span className="text-lh-purple">Types</span></h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {detailedPartnershipTypes.map((type, idx) => (
                            <motion.div
                                key={`type-${idx}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className={`p-10 bg-white/[0.02] backdrop-blur-xl border ${type.color} rounded-[40px] flex flex-col justify-between transition-all duration-500 group relative border shadow-2xl`}
                            >
                                <div className="space-y-6">
                                    <div className={`p-5 bg-white/5 w-fit rounded-[24px] ${type.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                                        {type.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-[1000] uppercase tracking-tight leading-none">{type.title}</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{type.sub}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium leading-relaxed italic border-l-2 border-white/10 pl-4">{type.desc}</p>

                                    <div className="space-y-4 pt-4">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-lh-purple">Best For:</span>
                                            <p className="text-xs text-white/70 mt-1 font-bold">{type.bestFor}</p>
                                        </div>
                                        <div className="pt-4 space-y-3">
                                            {type.benefits.map((benefit, i) => (
                                                <div key={`type-benefit-${idx}-${i}`} className="flex items-center gap-3 text-xs text-gray-400">
                                                    <CheckCircle2 size={14} className={type.iconColor} />
                                                    <span className="font-medium">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Section 4: How It Works --- */}
            <section className="py-24 px-6 relative z-10 bg-white/[0.01]">
                <div className="max-w-[1300px] mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase mb-20 leading-none">How It <span className="text-lh-purple">Works</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[25%] left-0 w-full h-px bg-white/10 z-0"></div>

                        {howItWorks.map((step, idx) => (
                            <motion.div
                                key={`step-${step.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="relative z-10 space-y-6"
                            >
                                <div className="w-12 h-12 bg-lh-purple text-white rounded-full mx-auto flex items-center justify-center font-black shadow-[0_0_30px_rgba(188,19,254,0.4)]">
                                    {step.id}
                                </div>
                                <div className="space-y-2 px-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white">{step.title}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Section 5: Testimonial Trust Section --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-[1000px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-12 md:p-20 bg-white/[0.02] border border-white/10 rounded-[60px] relative overflow-hidden text-center"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <MessageSquare size={120} className="text-lh-purple" />
                        </div>
                        <p className="text-2xl md:text-3xl lg:text-4xl font-black text-white italic leading-tight relative z-10">
                            “Partnering with CSCA increased our cybersecurity enrollment by <span className="text-lh-purple">40% within 6 months.</span>”
                        </p>
                        <div className="mt-10 space-y-1 relative z-10">
                            <span className="text-white font-black uppercase text-sm tracking-widest">Director</span>
                            <p className="text-lh-purple font-bold text-xs">XYZ Cyber Academy</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- Section 6: Final CTA --- */}
            <section className="py-24 px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-[1300px] mx-auto rounded-[60px] p-10 md:p-20 bg-gradient-to-br from-lh-purple/20 via-black to-black border border-white/10 relative overflow-hidden text-center"
                >
                    <div className="absolute inset-0 bg-lh-purple/5 blur-[100px] animate-pulse" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-[1000] tracking-tighter uppercase leading-[0.9]">
                            Ready to <span className="text-lh-purple">Scale</span> <br /> Your Academy?
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto italic">
                            "The cybersecurity landscape changes every minute. We empower our partners to lead that change."
                        </p>
                        <div className="pt-6">
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-16 py-6 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.3em] hover:bg-lh-purple hover:text-white transition-all transform hover:scale-105 duration-500 shadow-[0_0_60px_rgba(255,255,255,0.2)]"
                            >
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default PartnersEcosystem;
