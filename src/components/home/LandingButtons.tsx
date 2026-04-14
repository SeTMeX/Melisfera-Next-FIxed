"use client";

interface ButtonProps {
    text: string;
    className?: string
    onClick?: () => void;
}
const Button = ({ text, className}: ButtonProps) => {
    return (
        <div className='flex flex-row '>
            <button className={`h-9 w-21 border-0 rounded-4xl bg-blue-950 text-white ${className}`}>
                {text}
            </button>
        </div>
    )
}

export default Button