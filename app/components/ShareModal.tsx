"use client";

import { useState, useRef } from "react";
import { X, Link as LinkIcon, Download, Loader2, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import ShareCard from "./ShareCard";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    attachmentStyle: string;
    resultId: string;
    dominant_tendency?: string;
    percentage?: number;
    userName?: string;
}

export default function ShareModal({
    isOpen,
    onClose,
    attachmentStyle,
    resultId,
    dominant_tendency,
    percentage,
    userName,
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Generate shareable link
    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/results/${resultId}`
        : "";

    // Viral-optimized share messages
    const messages = {
        default: `I just discovered I have a ${attachmentStyle} attachment style! 💭✨ Understanding your attachment style can transform your relationships. What's yours? Take the quiz now! 👇`,
        short: `My attachment style: ${attachmentStyle} 💫 What's yours?`,
        curiosity: `I never knew this about myself... 😮 Just found out I'm ${attachmentStyle}. This explains SO much! What's your attachment style?`,
        cta: `🎯 ${attachmentStyle} - that's my attachment style! Take this 5-min quiz to discover yours. You'll be surprised! 👀`,
    };

    // Generate card image
    const generateImage = async () => {
        if (!cardRef.current) return null;

        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: "#FFF9E8",
            });
            setIsGenerating(false);
            return dataUrl;
        } catch (err) {
            console.error("Failed to generate image:", err);
            setIsGenerating(false);
            return null;
        }
    };

    // Download image
    const downloadImage = async () => {
        const dataUrl = await generateImage();
        if (!dataUrl) return;

        const link = document.createElement("a");
        link.download = `${attachmentStyle.toLowerCase().replace(/\s+/g, "-")}-attachment-style.png`;
        link.href = dataUrl;
        link.click();
    };

    // Copy link
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Share functions
    const shareToWhatsApp = () => {
        const text = `${messages.default}\n\n${shareUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    const shareToTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.default)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank");
    };

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(messages.default)}`;
        window.open(url, "_blank");
    };

    const shareToLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank");
    };

    const shareToTelegram = () => {
        const text = `${messages.default}\n${shareUrl}`;
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(messages.default)}`;
        window.open(url, "_blank");
    };

    const shareViaEmail = () => {
        const subject = `Check out my attachment style: ${attachmentStyle}!`;
        const body = `${messages.default}\n\n${shareUrl}`;
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
    };

    // For Instagram: Download image and prompt user
    const shareToInstagram = async () => {
        await downloadImage();
        alert("Image downloaded! 📸\n\nTo share on Instagram:\n1. Open Instagram app\n2. Create a new post/story\n3. Select the downloaded image\n4. Add the quiz link in your bio or story!");
    };

    // Native share (mobile)
    const shareNative = async () => {
        const dataUrl = await generateImage();

        if (typeof navigator.share === 'function') {
            try {
                // Try sharing with image
                if (dataUrl) {
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], "attachment-style.png", { type: "image/png" });

                    await navigator.share({
                        title: "My Attachment Style Results",
                        text: messages.short,
                        files: [file],
                        url: shareUrl,
                    });
                } else {
                    // Fallback without image
                    await navigator.share({
                        title: "My Attachment Style Results",
                        text: messages.default,
                        url: shareUrl,
                    });
                }
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    // Silent failure for share cancellation
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Hidden card for image generation */}
            <div className="fixed -left-[9999px] top-0">
                <div ref={cardRef}>
                    <ShareCard
                        attachmentStyle={attachmentStyle}
                        dominant_tendency={dominant_tendency}
                        percentage={percentage}
                        userName={userName}
                    />
                </div>
            </div>

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="relative w-full max-w-lg bg-cream rounded-3xl shadow-2xl border-2 border-orange-light overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-text-secondary hover:text-text transition-all hover:rotate-90 duration-300"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#FFF5E8] to-[#FFE8D1] p-8 text-center relative overflow-hidden shrink-0">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10">
                            <div className="inline-block mb-3">
                                <div className="text-5xl animate-bounce">🎉</div>
                            </div>
                            <h2 className="text-3xl font-family-heading font-semibold text-text mb-2 tracking-wide">
                                Share Your Results
                            </h2>
                            <p className="text-text-secondary font-family-body text-sm">
                                Help your friends discover their attachment style!
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                        {/* Mini results preview */}
                        <div className="bg-gradient-to-br from-white to-butter rounded-2xl p-6 border-2 border-beige shadow-md text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-light to-orange-coral mb-3 shadow-lg">
                                <span className="text-3xl">💭</span>
                            </div>
                            <h3 className="text-2xl font-family-heading font-semibold text-text mb-1">
                                {attachmentStyle}
                            </h3>
                            <p className="text-sm text-text-secondary font-family-body">
                                Your Attachment Style
                            </p>
                        </div>

                        {/* Download card button */}
                        <button
                            onClick={downloadImage}
                            disabled={isGenerating}
                            className="w-full py-4 bg-gradient-to-r from-orange-light to-orange-coral text-text rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download size={20} className="group-hover:animate-bounce" />
                                    Download Shareable Card
                                </>
                            )}
                        </button>

                        {/* Copy link section */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-text font-family-body">
                                📎 Your Unique Link:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-4 py-3 bg-white border-2 border-beige rounded-xl text-sm text-text-secondary font-family-body focus:outline-none focus:ring-2 focus:ring-orange-light focus:border-orange-light transition-all"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-5 py-3 bg-white border-2 border-orange-light text-text rounded-xl font-semibold hover:bg-orange-light hover:text-white transition-all duration-300 flex items-center gap-2"
                                >
                                    <LinkIcon size={18} />
                                    {copied ? "✓" : "Copy"}
                                </button>
                            </div>
                        </div>

                        {/* Social share buttons */}
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-text font-family-body flex items-center gap-2">
                                <span className="text-lg">📱</span> Share On:
                            </p>

                            <div className="grid grid-cols-2 gap-3">

                                {/* WhatsApp */}
                                <button
                                    onClick={shareToWhatsApp}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-beige rounded-xl hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-[#25D366]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-text group-hover:text-[#25D366]">WhatsApp</span>
                                </button>

                                {/* Telegram */}
                                <button
                                    onClick={shareToTelegram}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-beige rounded-xl hover:border-[#0088cc] hover:bg-[#0088cc]/5 transition-all group"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-[#0088cc]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-text group-hover:text-[#0088cc]">Telegram</span>
                                </button>

                                {/* Twitter */}
                                <button
                                    onClick={shareToTwitter}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-beige rounded-xl hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/5 transition-all group"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-[#1DA1F2]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-text group-hover:text-[#1DA1F2]">Twitter</span>
                                </button>

                                {/* Facebook */}
                                <button
                                    onClick={shareToFacebook}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-beige rounded-xl hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all group"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-[#1877F2]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-text group-hover:text-[#1877F2]">Facebook</span>
                                </button>

                                {/* LinkedIn */}
                                <button
                                    onClick={shareToLinkedIn}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-beige rounded-xl hover:border-[#0A66C2] hover:bg-[#0A66C2]/5 transition-all group"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-[#0A66C2]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-text group-hover:text-[#0A66C2]">LinkedIn</span>
                                </button>

                                {/* Instagram (Download) */}
                                <button
                                    onClick={shareToInstagram}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-beige rounded-xl hover:border-orange-light hover:bg-butter transition-all group"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" style={{ stopColor: '#FFB84D', stopOpacity: 1 }} />
                                                    <stop offset="100%" style={{ stopColor: '#FF9966', stopOpacity: 1 }} />
                                                </linearGradient>
                                            </defs>
                                            <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-text group-hover:text-orange-light">Instagram</span>
                                </button>

                                {/* Email */}
                                <button
                                    onClick={shareViaEmail}
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-beige rounded-xl hover:border-orange-light hover:bg-butter transition-all group"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-text-secondary group-hover:text-orange-light">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-text group-hover:text-orange-light">Email</span>
                                </button>

                                {/* Native Share (Mobile) */}
                                {typeof navigator !== "undefined" && typeof navigator.share === 'function' && (
                                    <button
                                        onClick={shareNative}
                                        className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-light to-orange-coral text-text rounded-xl font-semibold hover:shadow-lg transition-all group border-2 border-transparent"
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center text-text">
                                            <Share2 size={20} />
                                        </div>
                                        <span className="text-sm font-semibold">More Options</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Pro tip */}
                        <div className="bg-gradient-to-r from-butter to-peach/30 rounded-xl p-4 border border-beige">
                            <p className="text-xs text-text-secondary font-family-body flex items-start gap-2">
                                <span className="text-base">💡</span>
                                <span><strong>Pro Tip:</strong> Download the card for the best visual impact on Instagram Stories & Facebook! The card includes your results and makes people curious to take the quiz.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
