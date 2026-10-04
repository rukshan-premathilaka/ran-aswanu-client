// Two-column section layout that keeps the mobile order: text -> visual -> button.
// On large screens the text + button sit in one column and the visual in the other.
export default function SplitLayout({ text, visual, cta, visualLeft = false, className = "" }) {
    const textCol = visualLeft ? "lg:col-start-2" : "lg:col-start-1";
    const visualCol = visualLeft ? "lg:col-start-1" : "lg:col-start-2";
    return (
        <div className={`grid gap-x-14 gap-y-8 lg:grid-cols-2 items-center ${className}`}>
            <div className={`${textCol} lg:row-start-1 lg:self-end`}>{text}</div>
            <div className={`${visualCol} lg:row-start-1 lg:row-span-2 lg:self-center`}>{visual}</div>
            {cta && <div className={`${textCol} lg:row-start-2 lg:self-start`}>{cta}</div>}
        </div>
    );
}
