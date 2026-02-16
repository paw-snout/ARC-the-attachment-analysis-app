import { Message } from './whatsappParser';

export type ParticipantStats = {
    name: string;
    totalMessages: number;
    messageShare: number;
    initiations: number;
    medianResponseTime: number; // in minutes
    doubleTextCount: number;
    consecutiveTurns: number;
    totalTurns: number;
    avgConsecutiveMessages: number;
    repairPhraseCount: number;
    burstContribution: number;
};

export type RhythmBucket = {
    label: string;
    messageCount: number;
    avgResponseTime: number;
    initiationCount: number;
};

export type RelationalSignal = {
    title: string;
    observation: string;
    note: string;
    icon: string;
};

export type EmojiCount = {
    emoji: string;
    count: number;
};

export type AnalysisResult = {
    participants: ParticipantStats[];
    globalInitiationRatio: string; // e.g. "48% --- 52%"
    burstDensity: 'Low' | 'Medium' | 'High';
    repairPhraseCount: number;
    totalMessages: number;
    totalDays: number;
    dateRange: string;
    sentiment: {
        positive: number;
        neutral: number;
        negative: number;
        positiveCount: number;
        neutralCount: number;
        negativeCount: number;
    };
    rhythm: {
        daily: RhythmBucket[];
        weekly: RhythmBucket[];
        hourly: RhythmBucket[];
        weekday: RhythmBucket[];
    };
    signals: RelationalSignal[];
    emojiFrequency: EmojiCount[];
};

const REPAIR_PHRASES = [
    'sorry', 'my bad', "didn't mean to", 'i understand', "it's okay",
    'forgive me', 'apologize', 'my mistake', 'my fault', 'let me clarify'
];

const POSITIVE_WORDS = [
    'love', 'happy', 'proud', 'appreciate', 'thank you', 'amazing', 'great', 'wonderful',
    'beautiful', 'excellent', 'excited', 'good', 'perfect', 'awesome', 'kind', 'sweet',
    'thanks', 'best', 'joy', 'smile', 'glad', 'yay', 'hooray', 'delighted'
];
const NEGATIVE_WORDS = [
    'angry', 'upset', 'hurt', 'ignore', 'annoyed', 'tired', 'hate', 'sad', 'disappointed',
    'frustrated', 'bad', 'wrong', 'awful', 'terrible', 'mad', 'unhappy', 'lonely', 'stress',
    'worry', 'anxious', 'scared', 'pain', 'bitter', 'guilt', 'regret'
];

export function getUniqueParticipants(messages: Message[]): string[] {
    const participants = new Set<string>();
    messages.forEach(m => participants.add(m.sender));
    return Array.from(participants);
}

export function analyzeChat(messages: Message[], selfName: string, partnerName: string): AnalysisResult {
    if (messages.length === 0) throw new Error('No messages found');

    const stats: Record<string, ParticipantStats> = {
        [selfName]: createInitialStats(selfName),
        [partnerName]: createInitialStats(partnerName)
    };

    let repairPhraseCount = 0;
    let totalBursts = 0;
    let sentimentScores = { positive: 0, neutral: 0, negative: 0 };
    const emojiCounts: Record<string, number> = {};

    const responseTimes: Record<string, number[]> = { [selfName]: [], [partnerName]: [] };

    // Rhythmic buckets
    const dailyMap: Record<string, { count: number, responses: number[], initiations: number }> = {};
    const weeklyMap: Record<string, { count: number, responses: number[], initiations: number }> = {};
    const hourlyMap: Record<number, { count: number, responses: number[], initiations: number }> = {};
    const weekdayMap: Record<number, { count: number, responses: number[], initiations: number }> = {};

    // Initialize hourly (0-23) and weekday (0-6) maps
    for (let i = 0; i < 24; i++) hourlyMap[i] = { count: 0, responses: [], initiations: 0 };
    for (let i = 0; i < 7; i++) weekdayMap[i] = { count: 0, responses: [], initiations: 0 };

    const EIGHT_HOURS = 8 * 60 * 60 * 1000;
    let lastMessageTime = 0;

    const FIVE_MINUTES = 5 * 60 * 1000;
    let burstStartTime = messages[0].timestamp.getTime();
    let currentBurstSize = 0;
    let currentBurstMessages: Message[] = [];

    let minTime = messages[0].timestamp.getTime();
    let maxTime = messages[0].timestamp.getTime();

    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const sender = msg.sender;
        const time = msg.timestamp.getTime();
        const text = msg.text.toLowerCase();
        const dateObj = msg.timestamp;

        // Bucket Keys
        const dKey = dateObj.toISOString().split('T')[0];
        const wKey = getWeekKey(dateObj);
        const hKey = dateObj.getHours();
        const wdKey = dateObj.getDay(); // 0 is Sunday

        if (!dailyMap[dKey]) dailyMap[dKey] = { count: 0, responses: [], initiations: 0 };
        if (!weeklyMap[wKey]) weeklyMap[wKey] = { count: 0, responses: [], initiations: 0 };

        if (time < minTime) minTime = time;
        if (time > maxTime) maxTime = time;

        if (!stats[sender]) continue;

        stats[sender].totalMessages++;
        dailyMap[dKey].count++;
        weeklyMap[wKey].count++;
        hourlyMap[hKey].count++;
        weekdayMap[wdKey].count++;

        // Emoji Frequency
        const emojis = msg.text.match(emojiRegex);
        if (emojis) {
            emojis.forEach(e => {
                emojiCounts[e] = (emojiCounts[e] || 0) + 1;
            });
        }

        // Initiation
        if (i === 0 || (time - lastMessageTime > EIGHT_HOURS)) {
            stats[sender].initiations++;
            dailyMap[dKey].initiations++;
            weeklyMap[wKey].initiations++;
            hourlyMap[hKey].initiations++;
            weekdayMap[wdKey].initiations++;
        }
        lastMessageTime = time;

        // Response Time
        if (i > 0) {
            const prevMsg = messages[i - 1];
            if (prevMsg.sender !== sender) {
                const gap = time - prevMsg.timestamp.getTime();
                if (gap < 24 * 60 * 60 * 1000) {
                    const gapMin = gap / (60 * 1000);
                    responseTimes[sender].push(gapMin);
                    dailyMap[dKey].responses.push(gapMin);
                    weeklyMap[wKey].responses.push(gapMin);
                    hourlyMap[hKey].responses.push(gapMin);
                    weekdayMap[wdKey].responses.push(gapMin);
                }
            } else {
                stats[sender].doubleTextCount++;
            }
        }

        // Turns
        if (i === 0 || messages[i - 1].sender !== sender) {
            stats[sender].totalTurns++;
        }
        stats[sender].consecutiveTurns++;

        // Burst
        if (time - burstStartTime < FIVE_MINUTES) {
            currentBurstSize++;
            currentBurstMessages.push(msg);
        } else {
            if (currentBurstSize > 5) {
                totalBursts++;
                currentBurstMessages.forEach(m => {
                    if (stats[m.sender]) stats[m.sender].burstContribution++;
                });
            }
            burstStartTime = time;
            currentBurstSize = 1;
            currentBurstMessages = [msg];
        }

        // Repair
        if (REPAIR_PHRASES.some(phrase => text.includes(phrase))) {
            repairPhraseCount++;
            stats[sender].repairPhraseCount++;
        }

        // Sentiment
        let scored = false;
        if (POSITIVE_WORDS.some(word => text.includes(word))) {
            sentimentScores.positive++;
            scored = true;
        }
        if (NEGATIVE_WORDS.some(word => text.includes(word))) {
            sentimentScores.negative++;
            scored = true;
        }
        if (!scored) sentimentScores.neutral++;
    }

    if (currentBurstSize > 5) {
        totalBursts++;
        currentBurstMessages.forEach(m => {
            if (stats[m.sender]) stats[m.sender].burstContribution++;
        });
    }

    const totalBurstMessages = [selfName, partnerName].reduce((acc, name) => acc + stats[name].burstContribution, 0);

    const participants = [selfName, partnerName].map(name => {
        const s = stats[name];
        s.messageShare = Math.round((s.totalMessages / messages.length) * 100);
        s.avgConsecutiveMessages = s.totalTurns > 0 ? Number((s.consecutiveTurns / s.totalTurns).toFixed(1)) : 0;
        s.medianResponseTime = calculateMedian(responseTimes[name]);
        s.burstContribution = totalBurstMessages > 0 ? Math.round((s.burstContribution / totalBurstMessages) * 100) : 0;
        return s;
    });

    const totalInitiations = participants[0].initiations + participants[1].initiations;
    const initRatioA = totalInitiations > 0 ? Math.round((participants[0].initiations / totalInitiations) * 100) : 50;

    const totalDaysCount = Math.max(1, Math.ceil((maxTime - minTime) / (1000 * 60 * 60 * 24)));
    const startDateStr = new Date(minTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDateStr = new Date(maxTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return {
        participants,
        globalInitiationRatio: `${initRatioA}% --- ${100 - initRatioA}%`,
        burstDensity: totalBursts > (messages.length / 500) ? 'High' : totalBursts > (messages.length / 2000) ? 'Medium' : 'Low',
        repairPhraseCount,
        totalMessages: messages.length,
        totalDays: totalDaysCount,
        dateRange: `${startDateStr} - ${endDateStr}`,
        sentiment: {
            positive: Math.round((sentimentScores.positive / messages.length) * 100),
            neutral: Math.round((sentimentScores.neutral / messages.length) * 100),
            negative: Math.round((sentimentScores.negative / messages.length) * 100),
            positiveCount: sentimentScores.positive,
            neutralCount: sentimentScores.neutral,
            negativeCount: sentimentScores.negative
        },
        rhythm: {
            daily: Object.entries(dailyMap).map(([label, data]) => ({
                label,
                messageCount: data.count,
                avgResponseTime: Math.round(data.responses.length > 0 ? data.responses.reduce((a, b) => a + b, 0) / data.responses.length : 0),
                initiationCount: data.initiations
            })).sort((a, b) => a.label.localeCompare(b.label)).slice(-14),
            weekly: Object.entries(weeklyMap).map(([label, data]) => ({
                label,
                messageCount: data.count,
                avgResponseTime: Math.round(data.responses.length > 0 ? data.responses.reduce((a, b) => a + b, 0) / data.responses.length : 0),
                initiationCount: data.initiations
            })).sort((a, b) => a.label.localeCompare(b.label)).slice(-8),
            hourly: Object.entries(hourlyMap).map(([hour, data]) => ({
                label: `${hour}:00`,
                messageCount: data.count,
                avgResponseTime: Math.round(data.responses.length > 0 ? data.responses.reduce((a, b) => a + b, 0) / data.responses.length : 0),
                initiationCount: data.initiations
            })),
            weekday: Object.entries(weekdayMap).map(([dayIdx, data]) => ({
                label: weekdayLabels[parseInt(dayIdx)],
                messageCount: data.count,
                avgResponseTime: Math.round(data.responses.length > 0 ? data.responses.reduce((a, b) => a + b, 0) / data.responses.length : 0),
                initiationCount: data.initiations
            }))
        },
        signals: generateSignals(participants, totalBursts, messages.length),
        emojiFrequency: Object.entries(emojiCounts)
            .map(([emoji, count]) => ({ emoji, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
    };
}

function getWeekKey(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
}

function createInitialStats(name: string): ParticipantStats {
    return {
        name,
        totalMessages: 0,
        messageShare: 0,
        initiations: 0,
        medianResponseTime: 0,
        doubleTextCount: 0,
        consecutiveTurns: 0,
        totalTurns: 0,
        avgConsecutiveMessages: 0,
        repairPhraseCount: 0,
        burstContribution: 0
    };
}

function calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[half];
    return (sorted[half - 1] + sorted[half]) / 2.0;
}

function generateSignals(participants: ParticipantStats[], burstCount: number, totalMessages: number): RelationalSignal[] {
    const signals: RelationalSignal[] = [];

    // Initiation Balance
    const initDiff = Math.abs(participants[0].initiations - participants[1].initiations);
    if (initDiff < totalMessages * 0.05) {
        signals.push({
            title: "Balanced Engagement",
            observation: "Conversations are initiated almost equally by both of you.",
            note: "This suggests a healthy mutual interest and shared responsibility in maintaining connection.",
            icon: "sync_alt"
        });
    } else {
        const initiator = participants[0].initiations > participants[1].initiations ? participants[0] : participants[1];
        signals.push({
            title: "Primary Initiator",
            observation: `${initiator.name} tends to start most conversations.`,
            note: "One person often takes the lead in outreach, which may reflect different daily rhythms or communication styles.",
            icon: "arrow_forward"
        });
    }

    // Response Dynamics
    if (participants[0].medianResponseTime < 5 && participants[1].medianResponseTime < 5) {
        signals.push({
            title: "High Synchronicity",
            observation: "Both of you typically respond within minutes.",
            note: "Your communication style is highly responsive, resembling real-time conversation.",
            icon: "bolt"
        });
    }

    // Emotional Repair
    const totalRepair = participants[0].repairPhraseCount + participants[1].repairPhraseCount;
    if (totalRepair > 0) {
        signals.push({
            title: "Repair Awareness",
            observation: "We detected several instances of softening or clarifying language.",
            note: "Using 'repair phrases' is a strong indicator of relational intelligence and conflict de-escalation.",
            icon: "eco"
        });
    }

    // Message Bursts
    if (burstCount > (totalMessages / 1000)) {
        signals.push({
            title: "Urgency Peaks",
            observation: "Frequent clusters of rapid-fire messages detected.",
            note: "These bursts often coincide with high emotional excitement or time-sensitive coordination.",
            icon: "waves"
        });
    }

    return signals.slice(0, 3);
}
