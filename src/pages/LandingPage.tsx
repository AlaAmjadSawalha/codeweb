import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, CheckCircle2, LayoutTemplate, Star, FileText, Share2, Layers, Cpu, DollarSign, PenTool, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface LandingPageProps {
    setPage: (page: string) => void;
    isAuthenticated?: boolean;
    onShowToast?: (message: string) => void;
}

export default function LandingPage({ setPage, isAuthenticated = false, onShowToast }: LandingPageProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const [showAmazingMessage, setShowAmazingMessage] = useState(false);

    useEffect(() => {
        if (location.pathname === "/pricing") {
            document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [location.pathname]);

    const stats = [
        { value: "12,000+", label: "Designers & Homeowners" },
        { value: "50K+",    label: "Layouts Generated" },
        { value: "97%",     label: "Client Satisfaction" },
        { value: "< 30s",   label: "Avg. Generation Time" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">

            {/* ── 1. Hero ──────────────────────────────────────────────── */}
            <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
                {/* Dot grid */}
                <div
                    className="absolute inset-0 -z-20"
                    style={{
                        backgroundImage: "radial-gradient(hsl(var(--border)) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                {/* Violet radial glow */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.14),transparent)]" />
                {/* Decorative blobs */}
                <div className="absolute top-16 left-[8%] -z-10 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl" />
                <div className="absolute top-32 right-[4%] -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

                <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10">

                        {/* Left: copy */}
                        <div className="flex-1 text-center lg:text-left space-y-7 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {/* Pill badge */}
                            <button
                                onClick={() => setPage("/blog")}
                                className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 px-4 py-1.5 text-sm font-medium text-violet-700 dark:text-violet-300 hover:opacity-90 transition-opacity mx-auto lg:mx-0"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                                {t("landing.badge")}
                            </button>

                            {/* Headline */}
                            <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] xl:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
                                {t("landing.titleLine1")} <br className="hidden lg:block" />
                                {t("landing.titleLine2Prefix")}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300">
                                    {t("landing.titleAI")}
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 text-balance leading-relaxed">
                                {t("landing.subtitle")}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                                <button
                                    onClick={() => setPage(isAuthenticated ? "/dashboard" : "/auth/signup")}
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 transition-all shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
                                >
                                    {t("landing.ctaStart")}
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                                >
                                    {t("landing.ctaHow")}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAmazingMessage(true);
                                        onShowToast?.(t("landing.amazingToast"));
                                        setPage(isAuthenticated ? "/dashboard" : "/auth/signup");
                                    }}
                                    className="hidden sm:inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                                >
                                    {t("landing.ctaAmazing")}
                                </button>
                            </div>

                            {showAmazingMessage && (
                                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                                    {t("landing.amazingMessage")} 🔥
                                </p>
                            )}

                            {/* Social proof avatars */}
                            <div className="flex items-center gap-3 justify-center lg:justify-start pt-1">
                                <div className="flex -space-x-2">
                                    {["img=12", "img=33", "img=68", "img=15", "img=22"].map((q, i) => (
                                        <img
                                            key={i}
                                            src={`https://i.pravatar.cc/40?${q}`}
                                            className="h-8 w-8 rounded-full border-2 border-background object-cover"
                                            alt="user"
                                        />
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold text-foreground">12,000+</span>
                                    <span className="text-muted-foreground"> designers trust SmartPlan</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: hero visual */}
                        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-200 fill-mode-both">
                            {/* Browser-frame mockup */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-violet-500/5 overflow-hidden">
                                {/* Browser chrome */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                                    <span className="h-3 w-3 rounded-full bg-red-400" />
                                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <span className="h-3 w-3 rounded-full bg-green-400" />
                                    <div className="flex-1 mx-4 h-6 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center px-3">
                                        <span className="text-xs text-slate-400">smartplan.ai/design/project-12</span>
                                    </div>
                                </div>
                                {/* Image + gradient fallback */}
                                <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-50 via-indigo-50 to-slate-100 dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-slate-900 overflow-hidden">
                                    <img
                                        src="/auth-bg.png"
                                        alt="AI Interior Planning"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                    {/* Placeholder skeleton visible when image fails */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
                                        <div className="w-full max-w-xs space-y-3 opacity-50">
                                            <div className="h-3 w-3/4 rounded-full bg-violet-200 dark:bg-violet-800" />
                                            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <div className="h-2 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <div className="mt-5 grid grid-cols-3 gap-2">
                                                {[1, 2, 3].map((n) => (
                                                    <div key={n} className="aspect-square rounded-xl bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge – left */}
                            <div className="absolute -left-5 top-1/4 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-bounce" style={{ animationDuration: "3.5s" }}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Space Efficiency</div>
                                    <div className="text-sm font-semibold text-foreground">96% optimized</div>
                                </div>
                            </div>

                            {/* Floating badge – right */}
                            <div className="absolute -right-5 bottom-1/4 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/30">
                                    <Cpu className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">AI Generating</div>
                                    <div className="text-sm font-semibold text-foreground">3 Variations Ready</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats strip ──────────────────────────────────────────── */}
            <section className="border-y border-border bg-card/60">
                <div className="mx-auto max-w-6xl px-4 md:px-8 py-9">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-border">
                        {stats.map((s) => (
                            <div key={s.label} className="text-center px-4">
                                <div className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{s.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 2. How It Works ──────────────────────────────────────── */}
            <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="mx-auto max-w-6xl px-4 md:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">How It Works</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">From Blueprint to Reality in Minutes</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our intelligent pipeline turns your raw space data into beautiful, actionable layout plans.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { step: "01", icon: <Icons.upload className="h-6 w-6 text-white" />, title: "Upload Your Space", desc: "Upload your architectural blueprint (PDF/image) or snap photos of your empty room to give the AI context." },
                            { step: "02", icon: <Icons.settings className="h-6 w-6 text-white" />, title: "Customize Preferences", desc: "Define constraints — budget range, design style (Minimalist, Industrial…), layout type, and room usage." },
                            { step: "03", icon: <Icons.brain className="h-6 w-6 text-white" />, title: "Get AI Designs", desc: "In seconds our engine generates multiple layout options with explanations and rough cost estimates." },
                        ].map((s, i) => (
                            <div key={s.step} className="group relative flex flex-col items-center text-center bg-card rounded-2xl border border-border p-8 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg transition-all duration-300">
                                {/* Step connector arrow (desktop) */}
                                {i < 2 && (
                                    <div className="hidden md:block absolute -right-3 top-14 z-10">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800">
                                            <ArrowRight className="h-3 w-3 text-violet-500" />
                                        </div>
                                    </div>
                                )}
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-500/25 ring-8 ring-violet-100 dark:ring-violet-900/30 mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                                    {s.icon}
                                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-[10px] font-bold">
                                        {i + 1}
                                    </span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Step {s.step}</p>
                                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. Example Outputs ───────────────────────────────────── */}
            <section className="py-24">
                <div className="mx-auto max-w-6xl px-4 md:px-8">
                    <div className="text-center mb-14">
                        <p className="text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Design Outputs</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Stunning Outputs, Instantly</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
                            See how SmartPlan AI transforms raw architectural constraints into beautiful, livable design concepts.
                        </p>
                        <button
                            onClick={() => setPage("auth")}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline underline-offset-4"
                        >
                            View Gallery <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { tag: "Minimalist", tagColor: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300", title: "Open Concept Living", desc: "AI removed the non-load-bearing wall to maximize natural light and created distinct zones without physical barriers.", cost: "$12k – $15k", stat: "92% Space Util", gradient: "from-violet-100 via-purple-50 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40" },
                            { tag: "Before / After", tagColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", title: "Master Suite Redesign", desc: "Transformed a cramped 1990s bedroom into a modern master suite by repurposing dead hallway space into a walk-in closet.", cost: "$8k – $11k", stat: "+40 sq ft gained", gradient: "from-emerald-50 via-teal-50 to-cyan-100 dark:from-emerald-950/30 dark:to-teal-950/30" },
                            { tag: "Industrial", tagColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300", title: "Chef's Kitchen Flow", desc: "Optimized the classic work triangle for heavy cooking. Island size increased to support dining, replacing the formal table.", cost: "$25k – $32k", stat: "High Traffic Ready", gradient: "from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:to-orange-950/30" },
                        ].map((card) => (
                            <div key={card.title} className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-xl transition-all duration-300 flex flex-col">
                                <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${card.gradient}`}>
                                    <img
                                        src="/layout-output.png"
                                        alt={card.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                    {/* Stylized floor-plan placeholder */}
                                    <div className="absolute inset-0 flex items-end p-4 opacity-40 pointer-events-none">
                                        <div className="grid grid-cols-3 gap-1.5 w-full">
                                            <div className="col-span-2 rounded-lg bg-white/50 dark:bg-white/10 h-16" />
                                            <div className="space-y-1.5">
                                                <div className="rounded-lg bg-white/50 dark:bg-white/10 h-7" />
                                                <div className="rounded-lg bg-white/50 dark:bg-white/10 h-7" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> Top Pick
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full mb-3 self-start ${card.tagColor}`}>{card.tag}</span>
                                    <h3 className="text-base font-bold mb-2">{card.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{card.desc}</p>
                                    <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                                        <span className="text-muted-foreground">{card.cost}</span>
                                        <span className="font-semibold text-foreground">{card.stat}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. Key Features ──────────────────────────────────────── */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
                {/* Subtle violet tint */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(124,58,237,0.05),transparent)]" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Features</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Everything You Need to Plan Masterpieces
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            SmartPlan AI combines computational layout generation with intuitive tools designed for professionals and homeowners.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { color: "border-t-violet-500",  icon: <Layers         className="h-5 w-5 text-violet-600  dark:text-violet-400"  />, bg: "bg-violet-100  dark:bg-violet-500/10",  title: "Multiple Variations",      desc: "Generate 3–5 fundamentally different spatial arrangements for every upload so you can fully explore your space." },
                            { color: "border-t-emerald-500", icon: <DollarSign     className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-100 dark:bg-emerald-500/10", title: "Smart Cost Estimation",     desc: "Integrated market data analyzes structural changes, materials, and labor to provide realistic budgetary boundaries." },
                            { color: "border-t-blue-500",    icon: <PenTool        className="h-5 w-5 text-blue-600    dark:text-blue-400"    />, bg: "bg-blue-100    dark:bg-blue-500/10",    title: "Personalized Preferences", desc: "Need a home office? Mid-century modern? The engine strictly adheres to your lifestyle constraints." },
                            { color: "border-t-purple-500",  icon: <LayoutTemplate className="h-5 w-5 text-purple-600  dark:text-purple-400"  />, bg: "bg-purple-100  dark:bg-purple-500/10",  title: "Side-by-Side Comparison",  desc: "Overlay layouts to instantly see where walls move, how flow improves, and how light propagation changes." },
                            { color: "border-t-orange-500",  icon: <FileText       className="h-5 w-5 text-orange-600  dark:text-orange-400"  />, bg: "bg-orange-100  dark:bg-orange-500/10",  title: "PDF Export & Reports",     desc: "Generate standardized presentations with floor plans and cost breakdowns ready for your contractor." },
                            { color: "border-t-pink-500",    icon: <Share2         className="h-5 w-5 text-pink-600    dark:text-pink-400"    />, bg: "bg-pink-100    dark:bg-pink-500/10",    title: "Team Collaboration",       desc: "Share secure view links with clients or partners. Gather comments and approvals directly on the layouts." },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className={`rounded-2xl bg-card border border-border border-t-2 ${f.color} p-6 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 hover:-translate-y-0.5 transition-all duration-300`}
                            >
                                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} mb-4`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. Pricing ───────────────────────────────────────────── */}
            <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/20">
                <div className="mx-auto max-w-6xl px-4 md:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Pricing</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("landing.pricingTitle")}</h2>
                        <p className="text-lg text-muted-foreground">{t("landing.pricingSubtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
                        {/* Free */}
                        <div className="rounded-2xl bg-card border border-border p-7 flex flex-col hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300">
                            <h3 className="text-xl font-bold mb-1">Homeowner</h3>
                            <p className="text-sm text-muted-foreground mb-6">Perfect for visualizing your personal space.</p>
                            <div className="mb-7">
                                <span className="text-4xl font-extrabold">$0</span>
                                <span className="text-muted-foreground font-medium ml-1">/forever</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {["1 project workspace", "1 AI design generation", "Basic layout analysis"].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0" /> {f}
                                    </li>
                                ))}
                                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground/30 shrink-0" /> No PDF exports
                                </li>
                            </ul>
                            <button
                                onClick={() => setPage("auth")}
                                className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                Get Started Free
                            </button>
                        </div>

                        {/* Pro — featured */}
                        <div className="rounded-2xl bg-gradient-to-b from-violet-600 to-violet-700 text-white border-2 border-violet-500 p-7 flex flex-col relative shadow-2xl shadow-violet-500/25 md:-translate-y-5">
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                <span className="bg-white text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Most Popular</span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Designer Pro</h3>
                            <p className="text-sm text-violet-200 mb-6">For interior designers and active flippers.</p>
                            <div className="mb-7">
                                <span className="text-4xl font-extrabold">$49</span>
                                <span className="text-violet-200 font-medium ml-1">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {["Unlimited projects", "5–10 layout variations per run", "High-res PDF exports & reports", "Detailed cost analysis tooling", "Split-view comparison"].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-white">
                                        <CheckCircle2 className="h-4 w-4 text-violet-200 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setPage("auth")}
                                className="w-full py-2.5 rounded-xl bg-white text-violet-700 text-sm font-semibold hover:bg-violet-50 transition-colors shadow-md"
                            >
                                Subscribe to Pro
                            </button>
                        </div>

                        {/* Business */}
                        <div className="rounded-2xl bg-card border border-border p-7 flex flex-col hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300">
                            <h3 className="text-xl font-bold mb-1">Architecture Firm</h3>
                            <p className="text-sm text-muted-foreground mb-6">Scale your agency's drafting power.</p>
                            <div className="mb-7">
                                <span className="text-4xl font-extrabold">$199</span>
                                <span className="text-muted-foreground font-medium ml-1">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {["Everything in Designer Pro", "5 team seats included", "Team collaboration & sharing", "CAD/DWG export options", "Workflow API access"].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setPage("auth")}
                                className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. Testimonials ──────────────────────────────────────── */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(124,58,237,0.04),transparent)]" />
                <div className="mx-auto max-w-6xl px-4 md:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Testimonials</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trusted by the best in the business</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {[
                            { quote: "SmartPlan AI completely changed our renovation approach. Instead of guessing, we visualized four different ways to reconfigure our apartment. It saved us thousands in architectural fees.", name: "Elena Rodriguez", role: "Homeowner, Chicago",    img: "https://i.pravatar.cc/150?img=12" },
                            { quote: "As a solo designer, this tool acts like a team of junior draftsmen. I upload As-Builts on Friday and review 10 AI concepts on Monday. Incredible productivity multiplier.",                name: "Marcus Chen",      role: "Interior Designer",  img: "https://i.pravatar.cc/150?img=33" },
                            { quote: "We use SmartPlan AI for pitch meetings. Generating instant layouts 'on the fly' based on client feedback wins us the project almost every single time. It's magic.",                     name: "Sarah Jenkins",    role: "Principal Architect", img: "https://i.pravatar.cc/150?img=68" },
                        ].map((tm) => (
                            <div key={tm.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg transition-all duration-300">
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-base text-foreground leading-relaxed flex-1 mb-6">
                                    <span className="text-3xl text-violet-300 dark:text-violet-700 font-serif leading-none mr-1">"</span>
                                    {tm.quote}
                                    <span className="text-3xl text-violet-300 dark:text-violet-700 font-serif leading-none ml-1">"</span>
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-border">
                                    <img src={tm.img} alt={tm.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-violet-100 dark:ring-violet-900" />
                                    <div>
                                        <div className="text-sm font-semibold text-foreground">{tm.name}</div>
                                        <div className="text-xs text-muted-foreground">{tm.role}</div>
                                    </div>
                                    <div className="ml-auto">
                                        <CheckCircle2 className="h-4 w-4 text-violet-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. Final CTA ─────────────────────────────────────────── */}
            <section className="py-28 relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700">
                {/* Soft light radial overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(255,255,255,0.08),transparent)]" />
                {/* Dot texture */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
                />
                {/* Soft glow blobs */}
                <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white/90 mb-8">
                        <Sparkles className="h-3.5 w-3.5" />
                        Free to start — no credit card required
                    </div>
                    <h2 className="mb-5 text-4xl md:text-5xl font-bold tracking-tight text-white">Start Designing Your Space with AI Today</h2>
                    <p className="mb-10 text-lg text-violet-100 max-w-xl mx-auto">
                        Join thousands of homeowners and professionals creating optimal, beautiful spaces in a fraction of the time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setPage("auth")}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-violet-700 font-semibold hover:bg-violet-50 active:bg-violet-100 transition-all shadow-lg shadow-violet-900/20"
                        >
                            Start Designing <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPage("auth")}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all"
                        >
                            Create Free Account
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-violet-200/70 tracking-wide">
                        Trusted by 12,000+ designers · No credit card required · Cancel anytime
                    </p>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
