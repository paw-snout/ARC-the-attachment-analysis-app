"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChatAnalysis } from "@/app/context/ChatAnalysisContext";
import Logo from "@/components/Logo";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { gemoji } from "gemoji";

export default function WhatsAppAnalysisPage() {
    const router = useRouter();
    const { analysisResult, selectedSelf } = useChatAnalysis();
    const [viewMode, setViewMode] = useState<'day' | 'week'>('week');

    useEffect(() => {
        if (!analysisResult) {
            router.push("/results");
        }
    }, [analysisResult, router]);

    if (!analysisResult) return null;

    const self = analysisResult.participants.find(p => p.name === selectedSelf)!;
    const partner = analysisResult.participants.find(p => p.name !== selectedSelf)!;

    const metricsA = [
        { label: "Total Messages Sent", value: self.totalMessages.toLocaleString() },
        { label: "% Message Share", value: `${self.messageShare}%` },
        { label: "Median Reply Time", value: self.medianResponseTime < 1 ? "< 1m" : `${Math.round(self.medianResponseTime)}m` },
        { label: "Double Text %", value: `${Math.round((self.doubleTextCount / self.totalMessages) * 100)}%` },
        { label: "Avg Consecutive Messages", value: self.avgConsecutiveMessages },
        { label: "Repair Phrase Count", value: self.repairPhraseCount },
        { label: "Burst Contribution %", value: `${self.burstContribution}%` }
    ];

    const metricsB = [
        { label: "Total Messages Sent", value: partner.totalMessages.toLocaleString() },
        { label: "% Message Share", value: `${partner.messageShare}%` },
        { label: "Median Reply Time", value: partner.medianResponseTime < 1 ? "< 1m" : `${Math.round(partner.medianResponseTime)}m` },
        { label: "Double Text %", value: `${Math.round((partner.doubleTextCount / partner.totalMessages) * 100)}%` },
        { label: "Avg Consecutive Messages", value: partner.avgConsecutiveMessages },
        { label: "Repair Phrase Count", value: partner.repairPhraseCount },
        { label: "Burst Contribution %", value: `${partner.burstContribution}%` }
    ];

    const chartData = useMemo(() => {
        return viewMode === 'day' ? analysisResult.rhythm.hourly : analysisResult.rhythm.weekday;
    }, [viewMode, analysisResult.rhythm]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-text p-3 rounded-xl shadow-xl border border-beige/20 text-cream text-[10px]">
                    <p className="font-bold mb-2 uppercase tracking-widest text-[10px] text-orange-light">{label}</p>
                    <div className="space-y-1.5">
                        <div className="flex justify-between gap-4">
                            <span className="opacity-70">Messages:</span>
                            <span className="font-bold">{data.messageCount}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="opacity-70">Avg Response:</span>
                            <span className="font-bold">{data.avgResponseTime}m</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="opacity-70">Initiations:</span>
                            <span className="font-bold">{data.initiationCount}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!analysisResult) {
        return (
            <div className="min-h-screen bg-butter flex items-center justify-center p-8 font-family-body text-text">
                <div className="text-center bg-cream p-12 rounded-[2.5rem] shadow-sm border border-beige">
                    <h2 className="text-2xl font-family-heading font-semibold mb-4">Waiting for Analysis...</h2>
                    <Link href="/results" className="text-orange-light font-medium hover:underline">Return to Results</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-butter text-text min-h-screen font-family-body selection:bg-orange-light/20 pb-20 overflow-x-hidden">
            <div className="max-w-[1200px] mx-auto px-6 py-4">
                {/* Top Navigation */}
                <header className="flex items-center justify-between py-6 mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/results" className="p-2 -ml-2 text-text-muted hover:bg-text/5 rounded-full transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <Logo className="h-10 w-auto opacity-80" />
                    </div>
                </header>

                {/* Privacy Banner */}
                <div className="mb-12 p-6 bg-cream border border-beige rounded-2xl flex items-center justify-between gap-6 shadow-md relative group">
                    <div className="flex items-center gap-5">
                        <div className="bg-orange-light/10 p-2.5 rounded-xl text-orange-light shrink-0">
                            <span className="material-symbols-outlined">shield_lock</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-text font-bold text-base whitespace-nowrap">Privacy Protected</span>
                            <span className="text-beige hidden sm:inline">—</span>
                            <p className="text-text-muted text-sm font-normal leading-relaxed">
                                Your chat file is processed entirely in your browser. No data leaves your device.
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-orange-light/5 text-orange-coral rounded-full border border-orange-light/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-coral animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    <div className="bg-cream p-6 border border-beige rounded-2xl shadow-md transition-all hover:shadow-lg">
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-2">Total Messages</p>
                        <p className="text-3xl font-family-heading font-semibold text-text">{analysisResult.totalMessages.toLocaleString()}</p>
                    </div>
                    <div className="bg-cream p-6 border border-beige rounded-2xl shadow-md transition-all hover:shadow-lg">
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-2">Date Range</p>
                        <p className="text-2xl font-family-heading font-semibold text-text">{analysisResult.dateRange}</p>
                    </div>
                    <div className="bg-cream p-6 border border-beige rounded-2xl shadow-md transition-all hover:shadow-lg">
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-2">Total Days Covered</p>
                        <p className="text-3xl font-family-heading font-semibold text-text">{analysisResult.totalDays} Days</p>
                    </div>
                    <div className="bg-cream p-6 border border-beige rounded-2xl shadow-md transition-all hover:shadow-lg">
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-wide mb-2">Overall Initiation Ratio</p>
                        <p className="text-3xl font-family-heading font-semibold text-text">
                            {analysisResult.globalInitiationRatio.split(' --- ')[0]}
                            <span className="text-text-muted font-normal text-lg mx-1">---</span>
                            {analysisResult.globalInitiationRatio.split(' --- ')[1]}
                        </p>
                    </div>
                </div>

                {/* Two-Column Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-16 relative">
                    {/* Left Column: Participant A (You) */}
                    <div className="md:pr-12 md:pb-0 pb-12 relative flex flex-col">
                        <div className="absolute right-0 top-[10%] bottom-[10%] w-[1px] bg-beige hidden md:block"></div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-3 rounded-full bg-orange-light"></div>
                            <h2 className="text-xl font-family-heading font-semibold text-text">{self.name} <span className="text-text-muted font-normal">(You)</span></h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {metricsA.map((row, i) => (
                                <div key={i} className="bg-cream p-5 border border-beige rounded-2xl shadow-md flex justify-between items-center transition-all hover:bg-butter/50">
                                    <span className="text-text-muted text-sm">{row.label}</span>
                                    <span className="font-bold text-text">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Participant B (Partner) */}
                    <div className="md:pl-12 flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-3 rounded-full bg-text-muted"></div>
                            <h2 className="text-xl font-family-heading font-semibold text-text">{partner.name} <span className="text-text-muted font-normal">(Partner)</span></h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {metricsB.map((row, i) => (
                                <div key={i} className="bg-cream p-5 border border-beige rounded-2xl shadow-md flex justify-between items-center transition-all hover:bg-butter/50">
                                    <span className="text-text-muted text-sm">{row.label}</span>
                                    <span className="font-bold text-text">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 1: Interactive Response Rhythm (Recharts) */}
                <section className="bg-cream p-8 border border-beige rounded-2xl shadow-md mb-16 relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Interactive Response Rhythm</h3>
                                <div className="group relative inline-flex items-center">
                                    <span className="material-symbols-outlined text-text-muted/40 text-base cursor-help hover:text-orange-light transition-colors leading-none">info</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-text text-cream text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 leading-relaxed font-normal">
                                        Activity peaks indicate periods of high message volume and rapid response exchange.
                                        <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-text"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-text text-lg font-medium">Activity trends by {viewMode === 'day' ? 'hour of day' : 'day of week'}.</p>
                        </div>
                        <div className="flex p-1 bg-butter rounded-xl border border-beige relative z-10">
                            <button
                                onClick={() => setViewMode('day')}
                                className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'day' ? 'bg-cream shadow-sm text-text' : 'text-text-muted'}`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => setViewMode('week')}
                                className={`px-5 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'week' ? 'bg-cream shadow-sm text-text' : 'text-text-muted'}`}
                            >
                                Week
                            </button>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DCC4" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 184, 77, 0.05)' }} />
                                <Bar
                                    dataKey="messageCount"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                >
                                    {chartData.map((entry, index) => {
                                        const CHART_COLORS = ['#FFB84D', '#FF9966', '#8B9556', '#C4A57B', '#D4816B', '#FFCC99'];
                                        return (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.8} />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Section 2: Relational Signals */}
                <div className="mb-20">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Relational Signals</h3>
                            <div className="group relative inline-flex items-center">
                                <span className="material-symbols-outlined text-text-muted/40 text-base cursor-help hover:text-orange-light transition-colors leading-none">info</span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-text text-cream text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 leading-relaxed font-normal">
                                    Pattern-based insights derived from message timing, initiation balance, and emotional repair dynamics.
                                    <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-text"></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-text text-lg font-medium">Behavioral observations based on communication architecture.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysisResult.signals.map((signal, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="bg-cream p-6 border border-beige rounded-2xl shadow-md hover:border-orange-light/30 transition-all group"
                            >
                                <div className="size-10 rounded-xl bg-orange-light/10 flex items-center justify-center text-orange-light mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-xl">{signal.icon}</span>
                                </div>
                                <h4 className="text-base font-bold text-text mb-3">{signal.title}</h4>
                                <p className="text-sm text-text opacity-90 leading-relaxed mb-4">
                                    {signal.observation}
                                </p>
                                <div className="bg-butter p-4 rounded-xl border border-beige/50">
                                    <p className="text-xs text-text-muted leading-relaxed italic">
                                        "{signal.note}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Sentiment & Emojis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {/* Sentiment Analysis */}
                    <section className="lg:col-span-2 bg-cream p-8 border border-beige rounded-2xl shadow-md">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Sentiment Distribution</h3>
                                <div className="group relative inline-flex items-center">
                                    <span className="material-symbols-outlined text-text-muted/40 text-base cursor-help hover:text-orange-light transition-colors leading-none">info</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-text text-cream text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 leading-relaxed font-normal">
                                        Sentiment classification is algorithmic and context-sensitive.
                                        <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-text"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-text text-lg font-medium">Emotional tone composition.</p>
                        </div>

                        <div className="mb-8 relative h-12 w-full rounded-2xl overflow-hidden shadow-inner border border-beige flex">
                            {[
                                { color: "#FFB84D", percent: analysisResult.sentiment.positive, label: "Positive", count: analysisResult.sentiment.positiveCount },
                                { color: "#C4A57B", percent: analysisResult.sentiment.neutral, label: "Neutral", count: analysisResult.sentiment.neutralCount },
                                { color: "#E8DCC4", percent: analysisResult.sentiment.negative, label: "Low Activation", count: analysisResult.sentiment.negativeCount }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.percent}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full relative group cursor-default"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-2 bg-text text-cream text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-lg pointer-events-none">
                                        {item.label}: {item.count} ({item.percent}%)
                                        <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-text"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-orange-light"></div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Positive ({analysisResult.sentiment.positive}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-clay"></div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Neutral ({analysisResult.sentiment.neutral}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-beige"></div>
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Low Activation ({analysisResult.sentiment.negative}%)</span>
                            </div>
                        </div>
                    </section>

                    {/* Emoji Frequency */}
                    <section className="bg-cream p-8 border border-beige rounded-2xl shadow-md">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">Emoji Frequency</h3>
                                <div className="group relative inline-flex items-center">
                                    <span className="material-symbols-outlined text-text-muted/40 text-base cursor-help hover:text-orange-light transition-colors leading-none">info</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-text text-cream text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 leading-relaxed font-normal">
                                        Counts the occurrence of the top 8 symbols used in your chat history.
                                        <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-text"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-text text-lg font-medium">Favorite symbols.</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {analysisResult.emojiFrequency.slice(0, 8).map((item, idx) => {
                                const colors = [
                                    'bg-orange-light/20',
                                    'bg-peach/20',
                                    'bg-coral-orange/20',
                                    'bg-clay/20',
                                    'bg-beige/20',
                                    'bg-olive/20'
                                ];

                                // Automated emoji description lookup
                                const emojiData = gemoji.find(g => g.emoji === item.emoji);
                                const description = emojiData
                                    ? emojiData.description.charAt(0).toUpperCase() + emojiData.description.slice(1)
                                    : 'Emoji';

                                return (
                                    <div key={idx} className="flex flex-col items-center gap-2 group relative">
                                        <div className={`size-14 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform cursor-help`}>
                                            <span className="select-none">{item.emoji}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-text-muted opacity-60">
                                            {item.count}
                                        </span>

                                        {/* Emoji Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 bg-text text-cream text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
                                            {description}
                                            <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-text"></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {analysisResult.emojiFrequency.length === 0 && (
                                <p className="text-xs text-text-muted italic text-center py-10 w-full">No emojis detected.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Neutral Clarification Text */}
                <div className="max-w-2xl mx-auto text-center mt-16 mb-8">
                    <p className="text-text-muted text-sm italic leading-relaxed px-6">
                        "Differences in these metrics often reflect schedule, workload, or communication preference. They are not measures of care or commitment."
                    </p>
                </div>

                {/* Footer */}
                <footer className="py-12 border-t border-beige flex flex-col items-center gap-8">
                    <p className="text-text-muted text-[10px] font-medium tracking-wide">All data remains private and processed locally.</p>
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-text-muted text-sm">Made with ❤️ for your privacy by pranjall :)</p>
                        <a
                            href="mailto:pranjallyadavv@gmail.com"
                            className="text-orange-coral text-xs font-bold hover:underline transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">mail</span>
                            Contact: pranjallyadavv@gmail.com
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
