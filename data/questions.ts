export type Dimension = "abandonment" | "intimacy" | "conflict" | "autonomy";

export interface Question {
    id: number;
    text: string;
    dimension: Dimension;
    reverse: boolean;
}

export const questions: Question[] = [
    // Fear of Abandonment (7)
    { id: 1, text: "I feel uneasy when a partner takes longer than usual to respond to my messages.", dimension: "abandonment", reverse: false },
    { id: 2, text: "I feel secure even when my partner spends time independently without me.", dimension: "abandonment", reverse: true },
    { id: 3, text: "I often seek verbal reassurance that my partner values our relationship.", dimension: "abandonment", reverse: false },
    { id: 4, text: "Small changes in a partner's tone or mood make me question the stability of our relationship.", dimension: "abandonment", reverse: false },
    { id: 5, text: "I trust that a partner being busy does not mean they are losing interest in me.", dimension: "abandonment", reverse: true },
    { id: 6, text: "I frequently revisit recent interactions to check whether everything is still okay between us.", dimension: "abandonment", reverse: false },
    { id: 7, text: "I remain emotionally steady even when my partner is temporarily unavailable.", dimension: "abandonment", reverse: true },

    // Comfort with Intimacy (6)
    { id: 8, text: "I find it easy to share my deeper thoughts and emotions with a partner.", dimension: "intimacy", reverse: false },
    { id: 9, text: "I sometimes feel the urge to distance myself when a relationship becomes very close.", dimension: "intimacy", reverse: true },
    { id: 10, text: "Expressing vulnerability feels natural and important in building closeness.", dimension: "intimacy", reverse: false },
    { id: 11, text: "I prefer to keep many of my personal emotions private, even in committed relationships.", dimension: "intimacy", reverse: true },
    { id: 12, text: "Emotional closeness makes me feel supported rather than overwhelmed.", dimension: "intimacy", reverse: false },
    { id: 13, text: "I am comfortable relying on a partner for support during stressful times.", dimension: "intimacy", reverse: false },

    // Response to Conflict (6)
    { id: 14, text: "During disagreements, I feel a strong need to resolve the issue immediately.", dimension: "conflict", reverse: false },
    { id: 15, text: "Taking space before continuing a difficult conversation helps me respond more calmly.", dimension: "conflict", reverse: true },
    { id: 16, text: "I withdraw or become silent when conflict feels intense.", dimension: "conflict", reverse: true },
    { id: 17, text: "I can clearly express my needs during relationship stress.", dimension: "conflict", reverse: false },
    { id: 18, text: "I worry that major disagreements signal the end of the relationship.", dimension: "conflict", reverse: false },
    { id: 19, text: "I find it easy to take responsibility and apologize when necessary.", dimension: "conflict", reverse: true },

    // Need for Autonomy (6)
    { id: 20, text: "I strongly value maintaining my independence within a relationship.", dimension: "autonomy", reverse: false },
    { id: 21, text: "I feel comfortable integrating a partner into most areas of my daily life.", dimension: "autonomy", reverse: true },
    { id: 22, text: "Keeping separate social or personal space from my partner is important to me.", dimension: "autonomy", reverse: false },
    { id: 23, text: "A partner's need for closeness sometimes feels restrictive to my freedom.", dimension: "autonomy", reverse: false },
    { id: 24, text: "I am comfortable being emotionally dependent on someone I trust.", dimension: "autonomy", reverse: true },
    { id: 25, text: "I prefer solving personal problems independently rather than seeking support.", dimension: "autonomy", reverse: false },
];
