"use client";


export type ArrowsProps = {
    onPrev: () => void;
    onNext: () => void;
};

const Arrows = ({ onPrev, onNext }: ArrowsProps) => {
    return (
        <div className="arrows">
            <button className="arrow" onClick={onPrev}>
                &#8249;
            </button>

            <button className="arrow" onClick={onNext}>
                &#8250;
            </button>
        </div>
    );
};

export default Arrows;