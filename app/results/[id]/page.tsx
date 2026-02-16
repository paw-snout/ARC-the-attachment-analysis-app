import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SharedResultPage({
    params,
}: {
    params: { id: string };
}) {
    // In a real app, you would fetch from DB. 
    // For this demo, we'll decode the base64 ID or fallback to mock.
    let result = {
        attachmentStyle: "Unknown",
        percentage: 0,
    };

    try {
        const decoded = JSON.parse(atob(params.id));
        result = {
            attachmentStyle: decoded.style || "Secure",
            percentage: Math.round(decoded.score || 0),
        };
    } catch (e) {
        // Fallback for invalid IDs
        // notFound(); 
        result = {
            attachmentStyle: "Secure",
            percentage: 85
        }
    }

    return (
        <div className="min-h-screen bg-butter py-12 px-4 font-inter text-text">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-family-heading font-semibold text-text mb-4">
                        Shared Results: {result.attachmentStyle}
                    </h1>
                    <p className="text-lg text-text-secondary">
                        Top {result.percentage}% Match
                    </p>
                    <p className="text-lg text-text-muted mt-2">
                        Want to discover your own attachment style?
                    </p>
                </div>

                {/* Show their results preview */}
                <div className="bg-cream rounded-2xl p-8 mb-8 border-2 border-orange-light shadow-lg w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-light to-orange-coral mb-6 shadow-xl text-4xl">
                        🌟
                    </div>
                    <h2 className="text-3xl font-family-heading font-bold mb-2">
                        {result.attachmentStyle}
                    </h2>
                    <p className="text-text-secondary italic">
                        "Understanding your attachment style is the first step to healthier relationships"
                    </p>
                </div>

                {/* CTA to take the quiz */}
                <div className="text-center">
                    <Link
                        href="/assessment"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-light to-orange-coral text-text rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
                    >
                        Take the Quiz Yourself 🚀
                    </Link>
                </div>
            </div>
        </div>
    );
}
