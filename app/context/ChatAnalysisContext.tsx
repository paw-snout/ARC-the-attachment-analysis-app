"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult } from '@/utils/analysisEngine';

interface ChatAnalysisContextType {
    analysisResult: AnalysisResult | null;
    selectedSelf: string | null;
    setAnalysisData: (result: AnalysisResult, self: string) => void;
    clearAnalysisData: () => void;
}

const ChatAnalysisContext = createContext<ChatAnalysisContextType | undefined>(undefined);

export const ChatAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [selectedSelf, setSelectedSelf] = useState<string | null>(null);

    const setAnalysisData = (result: AnalysisResult, self: string) => {
        setAnalysisResult(result);
        setSelectedSelf(self);
    };

    const clearAnalysisData = () => {
        setAnalysisResult(null);
        setSelectedSelf(null);
    };

    return (
        <ChatAnalysisContext.Provider value={{ analysisResult, selectedSelf, setAnalysisData, clearAnalysisData }}>
            {children}
        </ChatAnalysisContext.Provider>
    );
};

export const useChatAnalysis = () => {
    const context = useContext(ChatAnalysisContext);
    if (context === undefined) {
        throw new Error('useChatAnalysis must be used within a ChatAnalysisProvider');
    }
    return context;
};
