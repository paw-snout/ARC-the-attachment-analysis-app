"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { calculateScores } from "@/app/lib/scoring";
import { useAssessment } from "@/app/context/AssessmentContext";
import ProgressBar from "./_components/ProgressBar";
import QuestionCard from "./_components/QuestionCard";
import LikertScale from "./_components/LikertScale";
import QuestionNav from "./_components/QuestionNav";

export default function AssessmentPage() {
    const router = useRouter();
    const { setResults } = useAssessment();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | undefined)[]>(
        new Array(questions.length).fill(undefined)
    );

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === questions.length - 1;
    const canProceed = currentAnswer !== undefined;

    const [isAdvancing, setIsAdvancing] = useState(false);
    const [showIntroModal, setShowIntroModal] = useState(false);
    const [learnMore, setLearnMore] = useState(false);

    const handleLevelChange = (val: number) => {
        if (isAdvancing) return;

        const newAnswers = [...answers];
        newAnswers[currentIndex] = val;
        setAnswers(newAnswers);
        setIsAdvancing(true);

        setTimeout(() => {
            if (isLast) {
                const finalResults = calculateScores(newAnswers);
                setResults(finalResults);
                setShowIntroModal(true);
            } else {
                setCurrentIndex((prev) => prev + 1);
                setIsAdvancing(false);
            }
        }, 400);
    };

    const handlePrevious = () => {
        if (!isFirst && !isAdvancing) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <div className="bg-butter font-inter text-text antialiased h-screen flex flex-col overflow-y-auto relative">
            <ProgressBar current={currentIndex + 1} total={questions.length} />

            <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-12 relative">
                <div className="w-full max-w-4xl flex flex-col items-center">
                    <QuestionCard
                        question={currentQuestion}
                        current={currentIndex + 1}
                        total={questions.length}
                    />

                    <div className="w-full mt-4 md:mt-8">
                        <LikertScale value={currentAnswer} onChange={handleLevelChange} />
                    </div>
                </div>

                {/* Global Glow */}
                <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,184,77,0.15)_0%,_transparent_70%)]"></div>
                </div>
            </main>

            {/* Footer Area */}
            <div className="w-full max-w-[1200px] mx-auto">
                <QuestionNav
                    onPrevious={handlePrevious}
                    isFirst={isFirst}
                    isLast={isLast}
                />
            </div>

            {/* Fixed bottom label */}
            <div className="pb-4 pt-2 text-center opacity-30 cursor-default hidden md:block">
                <div className="flex items-center justify-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-orange-light"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted">Behavioral Assessment</span>
                </div>
            </div>

            {/* Post-Assessment Intro Modal */}
            {showIntroModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-text/40 backdrop-blur-md" onClick={() => router.push("/results")}></div>
                    <div className="relative w-full max-w-3xl bg-cream rounded-[2.5rem] shadow-2xl border border-beige overflow-hidden animate-in fade-in zoom-in duration-500">
                        <div className="p-8 md:p-12 lg:p-16 overflow-y-auto max-h-[85vh]">
                            <div className="flex justify-between items-start mb-8 md:mb-10">
                                <h2 className="text-3xl md:text-4xl font-family-heading font-semibold text-text">Understanding Attachment</h2>
                                <button
                                    onClick={() => router.push("/results")}
                                    className="p-2 -mr-2 text-text-muted hover:text-text transition-colors"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                            </div>

                            <p className="text-lg text-text-secondary leading-relaxed font-light mb-10 italic">
                                Before viewing your results, you may want to understand how attachment patterns form and how they influence behavior.
                            </p>

                            {!learnMore ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => setLearnMore(true)}
                                        className="flex-1 bg-text text-cream py-4 rounded-2xl font-medium transition-all hover:bg-text-secondary active:scale-95 shadow-lg shadow-text/10"
                                    >
                                        Learn First
                                    </button>
                                    <button
                                        onClick={() => router.push("/results")}
                                        className="flex-1 border-2 border-beige text-text py-4 rounded-2xl font-medium transition-all hover:bg-butter active:scale-95"
                                    >
                                        View Results
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="space-y-4 text-text-secondary leading-relaxed text-sm md:text-base">
                                        <p>You can think of attachment as your brain’s internal “relationship GPS.”</p>
                                        <p>It’s a built-in system designed to monitor emotional safety and availability. When connection feels steady, the system stays quiet. When connection feels uncertain, it activates—prompting you to move closer, pull away, or protect yourself.</p>
                                        <p>This system evolved because human survival depended on staying connected to trusted others. Today, it still tracks closeness—just in emotional rather than physical terms.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted mb-6">How it forms</h3>
                                        <div className="space-y-4 text-text-secondary leading-relaxed text-sm md:text-base">
                                            <p>Your attachment “settings” develop early through repeated relational experiences.</p>
                                            <ul className="space-y-3">
                                                <li className="flex gap-3 font-light">
                                                    <span className="text-orange-light font-bold">•</span>
                                                    <span>When caregivers are consistently responsive, the system learns that closeness is safe.</span>
                                                </li>
                                                <li className="flex gap-3 font-light">
                                                    <span className="text-orange-light font-bold">•</span>
                                                    <span>When care is unpredictable, the system becomes more alert to shifts in availability.</span>
                                                </li>
                                                <li className="flex gap-3 font-light">
                                                    <span className="text-orange-light font-bold">•</span>
                                                    <span>When independence is discouraged or closeness feels intrusive, the system may prioritize autonomy.</span>
                                                </li>
                                                <li className="flex gap-3 font-light">
                                                    <span className="text-orange-light font-bold">•</span>
                                                    <span>When neglect or trauma is present, uncertainty can trigger stronger protective responses.</span>
                                                </li>
                                            </ul>
                                            <p className="pt-2 font-light italic">Temperament may influence sensitivity, but attachment patterns are shaped primarily through interaction and experience.</p>
                                            <p className="font-medium text-text">They are adaptive strategies—not permanent identities.</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-beige italic">
                                        <p className="text-sm text-text-muted leading-relaxed">
                                            Research shows that the ability to depend securely on others often increases independence. A stable “secure base” supports exploration—not dependence.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.push("/results")}
                                        className="w-full bg-gradient-to-br from-orange-light to-orange-coral text-text py-4 rounded-2xl font-bold transition-all hover:to-orange-coral/90 active:scale-95 shadow-xl shadow-orange-light/20 border border-orange-light/30"
                                    >
                                        Continue to Results
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
