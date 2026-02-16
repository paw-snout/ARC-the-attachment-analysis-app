interface QuestionCardProps {
    question: { id: number; text: string };
    current: number;
    total: number;
}

export default function QuestionCard({ question, current, total }: QuestionCardProps) {
    return (
        <div className="text-center w-full max-w-4xl mx-auto relative">
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted font-semibold mb-6">
                Question {current} of {total}
            </p>
            <h1 className="text-xl md:text-2xl lg:text-[28px] font-family-heading font-normal leading-relaxed md:leading-[1.4] text-text">
                &ldquo;{question.text}&rdquo;
            </h1>
        </div>
    );
}
