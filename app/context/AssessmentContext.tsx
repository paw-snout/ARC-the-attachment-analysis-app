"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { FinalResults } from "@/app/lib/scoring";

interface AssessmentContextType {
    results: FinalResults | null;
    setResults: (results: FinalResults) => void;
    clearResults: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
    const [results, setResultsState] = useState<FinalResults | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("assessmentResults");
        if (stored) {
            try {
                setResultsState(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored results", e);
            }
        }
    }, []);

    const setResults = (newResults: FinalResults) => {
        setResultsState(newResults);
        sessionStorage.setItem("assessmentResults", JSON.stringify(newResults));
    };

    const clearResults = () => {
        setResultsState(null);
        sessionStorage.removeItem("assessmentResults");
    };

    return (
        <AssessmentContext.Provider value={{ results, setResults, clearResults }}>
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    const context = useContext(AssessmentContext);
    if (context === undefined) {
        throw new Error("useAssessment must be used within an AssessmentProvider");
    }
    return context;
}
