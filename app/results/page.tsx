"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/app/context/AssessmentContext";
import { useChatAnalysis } from "@/app/context/ChatAnalysisContext";
import CircularProgress from "./_components/CircularProgress";
import { Dimension } from "@/data/questions";
import Logo from "@/components/Logo";
import { parseWhatsAppChat, Message } from "@/utils/whatsappParser";
import { analyzeChat, getUniqueParticipants } from "@/utils/analysisEngine";

import { Share2 } from "lucide-react";
import ShareModal from "@/app/components/ShareModal";

export default function ResultsPage() {
    const { results } = useAssessment();
    const router = useRouter();
    const { setAnalysisData } = useChatAnalysis();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analysisError, setAnalysisError] = React.useState<string | null>(null);
    const [chatMessages, setChatMessages] = React.useState<Message[]>([]);
    const [availableParticipants, setAvailableParticipants] = React.useState<string[]>([]);
    const [showModal, setShowModal] = React.useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.name.endsWith('.txt')) {
            setAnalysisError("Invalid file type. Please upload a .txt file.");
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            setAnalysisError("File is too large (max 20MB).");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const content = await file.text();
            const messages = parseWhatsAppChat(content);

            if (messages.length === 0) {
                throw new Error("No valid messages found in file.");
            }

            const participants = getUniqueParticipants(messages);

            if (participants.length > 2) {
                throw new Error("This version supports one-to-one conversations only.");
            }

            if (participants.length < 2) {
                throw new Error("At least 2 participants are required for analysis.");
            }

            setChatMessages(messages);
            setAvailableParticipants(participants);
            setShowModal(true);
        } catch (err: any) {
            setAnalysisError(err.message || "Failed to analyze file.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleConfirmParticipants = (self: string) => {
        const partner = availableParticipants.find(p => p !== self)!;

        try {
            const results = analyzeChat(chatMessages, self, partner);
            setAnalysisData(results, self);
            router.push('/whatsapp-analysis');
        } catch (err: any) {
            setAnalysisError(err.message || "Analysis failed.");
        }
    };

    // Derived values for the 3 tendencies based on the 4 behavioral scores
    const { tendencyData, primaryKey, data: calculatedData } = useMemo(() => {
        if (!results) return { tendencyData: null };

        const { abandonment, intimacy, conflict, autonomy } = results.scores;

        // Formula for the 3 visual rings matching Stitch's focus
        const secure = Math.round((intimacy.normalized + conflict.normalized) / 2);
        const anxious = abandonment.normalized;
        const avoidant = Math.round((autonomy.normalized + (100 - intimacy.normalized)) / 2);

        const data = {
            secure: { percent: secure, label: "Secure", color: "#8B9556" },
            anxious: { percent: anxious, label: "Anxious", color: "#FFB84D" },
            avoidant: { percent: avoidant, label: "Avoidant", color: "#C4A57B" }
        };

        // Determine hierarchy based on raw values for labeling
        const sortedKeys = Object.entries(data).sort((a, b) => b[1].percent - a[1].percent);
        let primaryKey = sortedKeys[0][0] as keyof typeof data;
        let secondaryKey = sortedKeys[1][0] as keyof typeof data;
        let tertiaryKey = sortedKeys[2][0] as keyof typeof data;

        const ranks = {
            [primaryKey]: "Primary Style",
            [secondaryKey]: "Secondary",
            [tertiaryKey]: "Tertiary"
        };

        const unsortedTendencies = Object.entries(data).map(([key, val]) => ({
            ...val,
            rank: ranks[key as keyof typeof ranks]
        }));

        // Sort by percentage descending for display order
        const sortedTendencies = [...unsortedTendencies].sort((a, b) => b.percent - a.percent);

        // Scale mapping based on rank (1.0 for primary, 0.92 for secondary, 0.85 for tertiary)
        const scales = [1.0, 0.92, 0.85];

        // Reassign delays and apply scaling based on the new order
        const sortedWithVisuals = sortedTendencies.map((item, index) => ({
            ...item,
            delay: index * 150,
            scale: scales[index] || 0.85
        }));

        return {
            tendencyData: sortedWithVisuals,
            primaryKey,
            data
        };
    }, [results]);

    // Split insight calculation for cleaner dependencies
    const memoizedInsight = useMemo(() => {
        if (!results) return "";
        const dominant = results.tendency;
        if (dominant === "Secure") {
            return "Your profile indicates a predominantly secure attachment style, characterized by a balanced approach to intimacy and independence. You maintain consistent emotional engagement and demonstrate a robust capacity for maintaining healthy boundaries without sacrificing connection.";
        } else if (dominant === "Anxious") {
            return "Your results suggest an anxious attachment tendency, often marked by a high value on closeness and a sensitivity to relationship shifts. While this shows a deep capacity for intimacy, you may find yourself seeking frequent reassurance to feel secure in your connections.";
        } else if (dominant === "Avoidant") {
            return "Your profile shows significant avoidant markers, characterized by a strong preference for self-reliance and emotional independence. You may view excessive closeness as a potential loss of autonomy, leading to a habit of maintaining distance to stay comfortable.";
        }
        return "Your results show a unique blend of attachment markers. You likely adapt your style significantly based on your environment and the specific dynamics of your relationships, showing elements of multiple patterns.";
    }, [results]);

    if (!results || !tendencyData) {
        return (
            <div className="min-h-screen bg-butter p-8 flex items-center justify-center font-family-body text-text">
                <div className="text-center bg-cream p-12 rounded-[2.5rem] shadow-sm border border-beige">
                    <h1 className="text-2xl font-family-heading font-medium mb-4">No data available</h1>
                    <Link href="/assessment" className="text-orange-light font-medium hover:underline">Start Assessment</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-butter font-family-body selection:bg-orange-light/20 text-text">
            {/* STITCH HEADER */}
            <header className="w-full border-b border-beige bg-cream/80 backdrop-blur-md sticky top-0 z-50">
                <div className="w-full px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/assessment" className="p-2 -ml-2 text-text-muted hover:text-orange-light transition-colors">
                            <span className="material-icons text-xl">arrow_back</span>
                        </Link>
                        <Logo className="opacity-90" />
                        <div className="h-4 w-[1px] bg-beige hidden md:block"></div>
                        <h1 className="text-sm font-family-heading font-semibold uppercase tracking-wide text-text-muted hidden md:block">Results Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium px-3 py-1 bg-[#7ED321]/10 text-[#7ED321] rounded-full">Analysis Complete</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col lg:flex-row">
                {/* PROFILE SECTION */}
                <section className="flex-1 p-6 md:p-12 lg:border-r border-beige overflow-y-auto bg-butter">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div>
                            <h2 className="text-3xl font-family-heading font-semibold text-text mb-2">Your Attachment Profile</h2>
                            <p className="text-text-secondary">Detailed breakdown based on behavioral patterns and communication markers.</p>
                        </div>

                        {/* TENDENCY RINGS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {tendencyData.map((item) => (
                                <div key={item.label} className="flex flex-col items-center text-center p-6 rounded-2xl bg-cream shadow-sm border border-beige transition-all hover:shadow-md">
                                    <div
                                        className="relative w-32 h-32 mb-4 transition-transform duration-[300ms] ease-in-out"
                                        style={{ transform: `scale(${item.scale})` }}
                                    >
                                        <CircularProgress
                                            percentage={item.percent}
                                            color={item.color}
                                            delay={item.delay}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-text">{item.percent}%</span>
                                        </div>
                                    </div>
                                    <h3 className="font-family-heading font-semibold text-text">{item.label}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted mt-1">{item.rank}</p>
                                </div>
                            ))}
                        </div>

                        {/* INSIGHT SUMMARY */}
                        <div className="bg-cream rounded-2xl p-8 border border-beige shadow-inner">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-orange-light font-bold">insights</span>
                                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Insight Summary</h3>
                            </div>
                            <p className="text-lg text-text leading-relaxed font-light italic">
                                &ldquo;{memoizedInsight}&rdquo;
                            </p>
                            <div className="mt-8 grid grid-cols-2 gap-6 pt-8 border-t border-beige">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest text-text-muted mb-1">Mirroring Score</span>
                                    <span className="text-xl font-medium text-text">{results.scores.intimacy.normalized}/100</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest text-text-muted mb-1">Consistency</span>
                                    <span className="text-xl font-medium text-text">
                                        {results.scores.conflict.normalized > 70 ? "High" : results.scores.conflict.normalized > 40 ? "Moderate" : "Low"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DIMENSION BREAKDOWN */}
                        <div className="pt-4">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted mb-8">Behavioral Dimensions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(Object.entries(results.scores) as [Dimension, import("@/app/lib/scoring").DimensionScore][]).map(([dim, score]) => (
                                    <div key={dim} className="bg-cream rounded-2xl p-6 border border-beige shadow-sm">
                                        <div className="flex justify-between items-end mb-3">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{dim}</span>
                                            <span className="text-xl font-bold text-text">{score.normalized}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-beige/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-orange-light transition-all duration-1000"
                                                style={{ width: `${score.normalized}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* DEEPER ANALYSIS (WHATSAPP) */}
                <section className="lg:w-[450px] bg-cream flex flex-col border-l border-beige overflow-y-auto">
                    <div className="p-6 md:p-10 flex flex-col h-full">
                        <div className="mb-8 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-orange-light/10 flex items-center justify-center text-orange-light shrink-0">
                                <span className="material-symbols-outlined text-3xl">psychology_alt</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-family-heading font-semibold text-text">Deeper Analysis</h2>
                                <p className="text-text-muted text-xs mt-1 uppercase tracking-widest font-medium">Chat Intelligence</p>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".txt"
                            className="hidden"
                        />

                        <div className="flex-1 flex flex-col">
                            <div className="group relative border-2 border-dashed border-beige rounded-3xl p-8 text-center bg-butter/50 hover:border-orange-coral transition-all duration-300">
                                <div className="mb-6 inline-flex w-16 h-16 rounded-full bg-cream shadow-sm items-center justify-center">
                                    <span className="material-icons text-3xl text-beige group-hover:text-orange-light transition-colors">description</span>
                                </div>
                                <h3 className="text-base font-semibold text-text mb-2">Upload Chat Export</h3>
                                <p className="text-xs text-text-muted mb-8">Format: .txt (Plain Text)</p>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isAnalyzing}
                                    className="w-full bg-orange-light text-text hover:bg-orange-coral py-4 rounded-xl text-sm font-semibold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
                                >
                                    {isAnalyzing ? (
                                        <span className="animate-spin material-icons">sync</span>
                                    ) : (
                                        <span className="material-icons text-lg">add_circle_outline</span>
                                    )}
                                    {isAnalyzing ? "Processing..." : "Select Chat File"}
                                </button>

                                {analysisError && (
                                    <p className="text-xs text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{analysisError}</p>
                                )}

                                <div className="bg-cream p-4 rounded-2xl border border-beige shadow-sm">
                                    <div className="flex items-start gap-3 text-left">
                                        <span className="material-symbols-outlined text-orange-light text-lg">verified_user</span>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted mb-1">Processed locally</p>
                                            <p className="text-[11px] text-text-muted leading-normal">
                                                Analysis happens entirely in your browser. Data is never uploaded or visible to our servers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-8 text-center">
                            <a
                                className="text-[11px] text-orange-coral hover:underline font-medium inline-flex items-center gap-1"
                                href="https://faq.whatsapp.com/1180414079177245/?cms_platform=iphone"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                How to export your chat? <span className="material-icons text-[14px]">open_in_new</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* PARTICIPANT SELECTION MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-text/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowModal(false)}
                    ></div>
                    <div className="relative w-full max-w-lg bg-cream rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-beige">
                        <div className="p-10 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-orange-light/10 flex items-center justify-center text-orange-light">
                                    <span className="material-symbols-outlined">person_search</span>
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Who are you?</h3>
                            </div>

                            <p className="text-sm text-text-secondary mb-8 leading-relaxed italic">
                                We detected {availableParticipants.length} participants in this chat. Please select your name to calibrate the metrics accurately.
                            </p>

                            <div className="space-y-4">
                                {availableParticipants.map(name => (
                                    <button
                                        key={name}
                                        onClick={() => handleConfirmParticipants(name)}
                                        className="w-full p-6 text-left border border-beige bg-butter/50 rounded-2xl hover:border-orange-coral hover:bg-orange-light/5 transition-all group flex items-center justify-between"
                                    >
                                        <span className="text-text font-semibold">{name}</span>
                                        <span className="material-icons text-beige group-hover:text-orange-light opacity-0 group-hover:opacity-100 transition-all font-light">arrow_forward</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-8 w-full text-xs text-text-muted hover:text-text font-medium transition-colors"
                            >
                                Cancel and try another file
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RADIAL GLOSS BACKGROUNDS */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-orange-light/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-orange-light/5 rounded-full blur-[120px] -ml-80 -mb-80 pointer-events-none"></div>
            {/* Share Button */}
            <button
                onClick={() => setIsShareModalOpen(true)}
                className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-light to-orange-coral text-text rounded-full font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group z-40 border border-transparent"
            >
                <Share2 size={20} className="group-hover:rotate-12 transition-transform color-text" />
                <span>Share Results</span>
            </button>

            {/* Share Modal */}
            {/* Share Modal */}
            {primaryKey && calculatedData && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    attachmentStyle={primaryKey.charAt(0).toUpperCase() + primaryKey.slice(1)}
                    resultId={btoa(JSON.stringify({ style: primaryKey, score: calculatedData[primaryKey].percent }))}
                    dominant_tendency="Primary Style"
                    percentage={calculatedData[primaryKey].percent}
                    userName="My"
                />
            )}
        </div>
    );
}
