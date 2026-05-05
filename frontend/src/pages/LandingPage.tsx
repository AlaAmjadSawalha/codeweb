import { Icons } from "@/components/icons";
import { ArrowRight, CheckCircle2, LayoutTemplate, Star, FileText, Share2, Layers, Cpu, DollarSign, PenTool, Home } from "lucide-react";

interface LandingPageProps {
    setPage: (page: string) => void;
}

export default function LandingPage({ setPage }: LandingPageProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950/40 dark:via-background dark:to-background"></div>
                <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/3"></div>

                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                        <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-900/30 px-3 py-1 text-sm font-medium text-indigo-800 dark:text-indigo-300 backdrop-blur-sm mx-auto lg:mx-0">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
                                SmartPlan AI 2.0 is now live
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-tight">
                                Design Smarter <br className="hidden lg:block" />
                                Spaces with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">AI</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-balance">
                                The ultimate AI-powered platform that analyzes architectural blueprints or room photos and intelligently generates optimized interior layout suggestions based on your budget, style, and usage.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                <button
                                    onClick={() => setPage("auth")}
                                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-50 px-8 text-sm font-medium text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 dark:hover:bg-slate-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                                >
                                    Start Designing
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm px-8 text-sm font-medium text-slate-900 dark:text-slate-100 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                                >
                                    See How It Works
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                            <div className="relative rounded-2xl md:rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 bg-white/10 dark:bg-black/10 p-2 md:p-4 backdrop-blur-md shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5 rounded-2xl md:rounded-[2rem]"></div>
                                <img
                                    src="/auth-bg.png"
                                    alt="AI Interior Planning Visual"
                                    className="w-full h-auto rounded-xl md:rounded-[1.5rem] object-cover shadow-inner aspect-[4/3]"
                                />

                                {/* Floating UI Elements */}
                                <div className="absolute -left-6 top-1/4 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-medium">Layout Optimized</div>
                                        <div className="text-sm font-bold">Space Efficiency: 96%</div>
                                    </div>
                                </div>

                                <div className="absolute -right-6 bottom-1/4 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground font-medium">AI Generating</div>
                                        <div className="text-sm font-bold">3 Variations Ready</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. How It Works (3 Steps) */}
            <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">From Blueprint to Reality in Minutes</h2>
                        <p className="text-lg text-muted-foreground">Our intelligent pipeline turns your raw space data into beautiful, actionable layout plans through a simple three-step process.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-slate-200 via-indigo-300 to-slate-200 dark:from-slate-800 dark:via-indigo-800 dark:to-slate-800 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                                <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Icons.upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Upload Your Space</h3>
                            <p className="text-muted-foreground">Simply upload your architectural blueprint (PDF/CAD) or snap photos of your empty room to give the AI context.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                                <div className="w-16 h-16 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Icons.settings className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Customize Preferences</h3>
                            <p className="text-muted-foreground">Define your constraints. Select your budget range, preferred design style (e.g. Minimalist, Industrial), layout type, and core usage.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                                <div className="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <Icons.brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Get AI Designs</h3>
                            <p className="text-muted-foreground">Within seconds, our engine generates multiple spatial layout options complete with descriptive explanations and rough cost estimates.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Example Design Outputs */}
            <section className="py-24">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Stunning Outputs, Instantly</h2>
                            <p className="text-lg text-muted-foreground">See how SmartPlan AI transforms raw architectural constraints into beautiful, livable design concepts.</p>
                        </div>
                        <button
                            onClick={() => setPage("auth")}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            View Gallery <ArrowRight className="ml-1 w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Example Card 1 */}
                        <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src="/layout-output.png"
                                    alt="Modern minimalist living room layout generated by AI"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-md text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> High Efficiency
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">Layout Variation A • Minimalist</div>
                                <h3 className="text-xl font-bold mb-2">Open Concept Living</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    AI opted to remove the non-load bearing separation wall to maximize natural light from the south-facing windows. Furniture is arranged to create distinct zones without physical barriers.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm">
                                    <span className="text-muted-foreground">Est. Cost: $12k - $15k</span>
                                    <span className="font-medium">92% Space Util</span>
                                </div>
                            </div>
                        </div>

                        {/* Example Card 2 */}
                        <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900 flex">
                                <div className="w-1/2 h-full border-r-2 border-dashed border-white dark:border-black relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        <Icons.fileIcon className="w-12 h-12 opacity-50" />
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-xs px-2 py-0.5 rounded">Before Blueprint</div>
                                </div>
                                <div className="w-1/2 h-full relative">
                                    <img src="/layout-output.png" alt="After AI Design" className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply dark:mix-blend-screen" />
                                    <div className="absolute bottom-2 right-2 bg-indigo-600/90 text-white text-xs px-2 py-0.5 rounded">After AI Layout</div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">Before / After Comparison</div>
                                <h3 className="text-xl font-bold mb-2">Master Suite Redesign</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    Transformed a cramped 1990s bedroom blueprint into a modern master suite by repurposing dead hallway space into a walk-in closet.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm">
                                    <span className="text-muted-foreground">Est. Cost: $8k - $11k</span>
                                    <span className="font-medium">+40 sq ft gained</span>
                                </div>
                            </div>
                        </div>

                        {/* Example Card 3 */}
                        <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col lg:col-span-1 md:col-span-2 lg:block">
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src="/layout-output.png"
                                    alt="Industrial kitchen layout"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 hue-rotate-15"
                                />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs font-medium text-amber-600 dark:text-amber-500 mb-2">Interior Concept • Industrial</div>
                                <h3 className="text-xl font-bold mb-2">Chef's Kitchen Flow</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1">
                                    Optimized the classic work triangle based on user preference for heavy cooking. Island size increased to support dining, replacing the formal table.
                                </p>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm">
                                    <span className="text-muted-foreground">Est. Cost: $25k - $32k</span>
                                    <span className="font-medium">High Traffic Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Key Features Section */}
            <section className="py-24 bg-slate-950 text-slate-50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Everything You Need to Plan Masterpieces</h2>
                        <p className="text-lg text-slate-400">SmartPlan AI combines raw computational layout generation with intuitive user tools designed for both professionals and homeowners.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                    <Layers className="w-5 h-5 text-indigo-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Multiple Variations</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Never settle for one idea. The AI generates 3-5 fundamentally different spatial arrangements for every upload so you can thoroughly explore the potential of your space.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <DollarSign className="w-5 h-5 text-emerald-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Smart Cost Estimation</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Integrated market data analyzes the structural changes, materials, and labor required for each generated layout to provide realistic budgetary boundaries.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                    <PenTool className="w-5 h-5 text-blue-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Personalized Preferences</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Dial in the AI constraints. Need a home office? A larger master bath? Strictly mid-century modern? The engine strictly adheres to your specific lifestyle rules.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                    <LayoutTemplate className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Side-by-Side Comparison</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Our split-view tool lets you overlay different layouts to instantly see where walls move, where flow improves, and how light propagation changes.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                                    <FileText className="w-5 h-5 text-orange-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">PDF Export & Reports</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Generate beautiful, standardized PDF presentations of your chosen layouts, complete with floor plans, 3D renders, and cost breakdowns ready for your contractor.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                                    <Share2 className="w-5 h-5 text-pink-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Team Collaboration</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Share secure view links with clients, partners, or spouses. Gather comments, annotations, and approvals directly on the generated layouts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Pricing Plans */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/10">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-muted-foreground">Whether you're remodeling your first home or running an architectural firm, we have a plan designed for you.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold mb-2">Homeowner</h3>
                                <p className="text-muted-foreground text-sm">Perfect for visualizing your personal space.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">$0</span>
                                <span className="text-muted-foreground font-medium">/forever</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> 1 project workspace</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> 1 AI design generation</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> Basic layout analysis</li>
                                <li className="flex items-center text-sm text-muted-foreground decoration-slate-300"><CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-700 mr-3 shrink-0" /> No PDF exports</li>
                            </ul>
                            <button
                                onClick={() => setPage("auth")}
                                className="w-full h-12 rounded-xl font-medium border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                            >
                                Get Started Free
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="rounded-3xl bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 border-2 border-indigo-500 p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
                            <div className="absolute top-0 right-8 -translate-y-1/2">
                                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-xl font-bold mb-2">Designer Pro</h3>
                                <p className="text-slate-400 dark:text-slate-500 text-sm">For interior designers and active flippers.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">$49</span>
                                <span className="text-slate-400 dark:text-slate-500 font-medium">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-400 dark:text-indigo-600 mr-3 shrink-0" /> Unlimited projects</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-400 dark:text-indigo-600 mr-3 shrink-0" /> 5-10 layout variations per run</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-400 dark:text-indigo-600 mr-3 shrink-0" /> High-res PDF exports & reports</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-400 dark:text-indigo-600 mr-3 shrink-0" /> Detailed cost analysis tooling</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-indigo-400 dark:text-indigo-600 mr-3 shrink-0" /> Split-view comparison</li>
                            </ul>
                            <button
                                onClick={() => setPage("auth")}
                                className="w-full h-12 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                            >
                                Subscribe to Pro
                            </button>
                        </div>

                        {/* Business Plan */}
                        <div className="rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold mb-2">Architecture Firm</h3>
                                <p className="text-muted-foreground text-sm">Scale your agency's drafting power.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">$199</span>
                                <span className="text-muted-foreground font-medium">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> Everything in Designer Pro</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> 5 Team seats included</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> Team collaboration & sharing</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> CAD/DWG export options</li>
                                <li className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-slate-100 mr-3 shrink-0" /> Workflow API access</li>
                            </ul>
                            <button
                                onClick={() => setPage("auth")}
                                className="w-full h-12 rounded-xl font-medium border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                            >
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Testimonials / Use Cases */}
            <section className="py-24 overflow-hidden relative">
                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted by the best in the business</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex text-yellow-400 mb-6">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-8 flex-1">"SmartPlan AI completely changed our renovation approach. Instead of guessing, we visualized four different ways to reconfigure our apartment. It saved us thousands in architectural fees."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800" />
                                <div>
                                    <div className="font-bold text-sm">Elena Rodriguez</div>
                                    <div className="text-xs text-muted-foreground">Homeowner, Chicago</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex text-yellow-400 mb-6">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-8 flex-1">"As a solo designer, this tool acts like a team of junior draftsmen. I upload the As-Builts on Friday and review 10 generated AI concepts on Monday. Incredible productivity multiplier."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800" />
                                <div>
                                    <div className="font-bold text-sm">Marcus Chen</div>
                                    <div className="text-xs text-muted-foreground">Interior Designer</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex text-yellow-400 mb-6">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-8 flex-1">"We use SmartPlan AI for our pitch meetings. Generating instant layouts 'on the fly' based on client feedback during a meeting wins us the project almost every single time. It's magic."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?img=68" alt="Avatar" className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800" />
                                <div>
                                    <div className="font-bold text-sm">Sarah Jenkins</div>
                                    <div className="text-xs text-muted-foreground">Principal Architect</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Call to Action (Final Section) */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 mix-blend-overlay"></div>
                </div>

                <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Start Designing Your Space with AI Today</h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of homeowners and professionals who are creating optimal, beautiful spaces in a fraction of the time.</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => setPage("auth")}
                            className="inline-flex h-12 items-center justify-center rounded-full bg-blue-500 px-8 text-sm font-medium text-white shadow-lg transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Start Designing
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPage("auth")}
                            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            </section>

            {/* 8. Footer */}
            <footer className="bg-background border-t border-border pt-16 pb-8">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-2 mb-6">
                                <Home className="h-6 w-6 text-indigo-500" />
                                <span className="font-bold text-xl tracking-wider">SmartPlan AI</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                The leading AI interior layout generator. Designing smarter, healthier, and more efficient spaces for everyone.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Gallery</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/40 gap-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} SmartPlan AI Inc. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Icons.twitter className="w-5 h-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Icons.gitHub className="w-5 h-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
