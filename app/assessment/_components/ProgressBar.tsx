interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percent = (current / total) * 100;

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-beige/20 z-[60]">
            <div
                className="h-full bg-orange-light transition-all duration-700"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}
