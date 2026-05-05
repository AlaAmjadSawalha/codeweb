import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Chrome, ArrowRight, ShieldCheck } from "lucide-react";

interface SignUpFormProps {
    onSwitchToLogin: () => void;
    onSignUpSuccess: () => void;
}

export function SignUpForm({ onSwitchToLogin, onSignUpSuccess }: SignUpFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Homeowner",
        acceptTerms: false
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!formData.acceptTerms) {
            setError("You must accept the Terms & Privacy Policy to continue.");
            return;
        }
        setError("");
        // Simulate sign up
        setTimeout(() => {
            onSignUpSuccess();
        }, 1000);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Join SmartPlan AI and start designing today.
                </p>
            </div>

            <div className="mt-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-500/20 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="flex w-full h-11 px-3 py-2 pl-10 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder="Jane Doe"
                            />
                        </div>
                    </div>

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
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="flex w-full h-11 px-3 py-2 pl-10 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="flex w-full h-11 px-3 py-2 pl-10 pr-9 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                Confirm
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="flex w-full h-11 px-3 py-2 pl-10 pr-9 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                            I am a
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="flex w-full h-11 px-3 py-2 text-sm bg-transparent border rounded-md border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-950 transition-colors"
                        >
                            <option value="Homeowner">Homeowner</option>
                            <option value="Architect">Architect</option>
                            <option value="Designer">Interior Designer</option>
                        </select>
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:ring-offset-slate-950 dark:focus:ring-slate-300"
                        />
                        <label
                            htmlFor="acceptTerms"
                            className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
                        >
                            I agree to the <a href="#" className="font-medium text-slate-900 dark:text-slate-100 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-slate-900 dark:text-slate-100 hover:underline">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center w-full h-11 px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white transition-colors rounded-md bg-slate-900 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300"
                    >
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                            Or sign up with
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
                Already have an account?{" "}
                <button
                    onClick={onSwitchToLogin}
                    className="font-medium text-slate-900 hover:underline dark:text-slate-100 focus:outline-none"
                >
                    Sign in
                </button>
            </p>
        </div>
    );
}
