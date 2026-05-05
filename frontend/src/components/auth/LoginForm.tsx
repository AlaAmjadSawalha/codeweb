import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Chrome, ArrowRight } from "lucide-react";

interface LoginFormProps {
    onSwitchToSignUp: () => void;
    onLoginSuccess: () => void;
}

export function LoginForm({ onSwitchToSignUp, onLoginSuccess }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setError("");
        // Simulate login
        setTimeout(() => {
            onLoginSuccess();
        }, 1000);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Sign in to your SmartPlan AI account to continue.
                </p>
            </div>

            <div className="mt-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex w-full h-11 px-3 py-2 pl-10 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex w-full h-11 px-3 py-2 pl-10 pr-10 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
                            >
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm font-medium text-slate-900 hover:underline dark:text-slate-100">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full h-11 px-4 py-2 text-sm font-medium tracking-wide text-white transition-colors rounded-md bg-slate-900 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300"
                    >
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center justify-center w-full h-11 px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md border-slate-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-slate-300"
                >
                    <Chrome className="w-5 h-5 mr-2" />
                    Google
                </button>
            </div>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <button
                    onClick={onSwitchToSignUp}
                    className="font-medium text-slate-900 hover:underline dark:text-slate-100 focus:outline-none"
                >
                    Create an account
                </button>
            </p>
        </div>
    );
}
