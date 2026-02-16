import { Dimension, questions } from "@/data/questions";

export interface DimensionScore {
    raw: number;
    normalized: number;
}

export type ScoredResult = Record<Dimension, DimensionScore>;

export type AttachmentTendency = "Secure" | "Anxious" | "Avoidant" | "Inconclusive";

export interface FinalResults {
    scores: ScoredResult;
    tendency: AttachmentTendency;
}

const QUESTIONS_PER_DIMENSION: Record<Dimension, number> = {
    abandonment: 7,
    intimacy: 6,
    conflict: 6,
    autonomy: 6,
};

export function calculateScores(answers: (number | undefined)[]): FinalResults {
    const rawScores: Record<Dimension, number> = {
        abandonment: 0,
        intimacy: 0,
        conflict: 0,
        autonomy: 0,
    };

    questions.forEach((q, index) => {
        const answer = answers[index];
        if (answer === undefined) return;

        const value = q.reverse ? 6 - answer : answer;
        rawScores[q.dimension] += value;
    });

    const scoredResult: Partial<ScoredResult> = {};

    (Object.keys(rawScores) as Dimension[]).forEach((dimension) => {
        const raw = rawScores[dimension];
        const numQuestions = QUESTIONS_PER_DIMENSION[dimension];
        const maxPossible = numQuestions * 5;
        // Normalize to 0-100
        const normalized = Math.round((raw / maxPossible) * 100);

        scoredResult[dimension] = { raw, normalized };
    });

    const finalScores = scoredResult as ScoredResult;

    // Compute Tendency
    // Secure = High Intimacy + High Conflict (low avoidance/anxiety)
    // Anxious = High Abandonment
    // Avoidant = High Autonomy + Low Intimacy

    let tendency: AttachmentTendency = "Inconclusive";

    const { abandonment, intimacy, conflict, autonomy } = finalScores;

    if (abandonment.normalized > 60) {
        tendency = "Anxious";
    } else if (autonomy.normalized > 60 && intimacy.normalized < 40) {
        tendency = "Avoidant";
    } else if (intimacy.normalized > 60 && conflict.normalized > 60) {
        tendency = "Secure";
    }

    return {
        scores: finalScores,
        tendency,
    };
}
