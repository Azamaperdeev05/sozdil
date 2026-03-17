import React from 'react';
import { LetterStatus } from '../types';

const ExampleRow: React.FC<{
    word: string;
    statuses: LetterStatus[];
    description?: React.ReactNode;
}> = ({ word, statuses, description }) => {
    const baseClasses = 'w-10 h-10 flex items-center justify-center border-2 rounded-lg font-bold text-xl';
    
    const getTileStyle = (s: LetterStatus) => {
        switch(s) {
            case 'correct': return 'bg-correct text-white border-transparent';
            case 'present': return 'bg-present text-white border-transparent';
            case 'absent': return 'bg-absent text-white border-transparent';
            default: return 'bg-surface border-border text-text'; 
        }
    };
    
    return (
        <div className="space-y-2">
            <div className="flex justify-center gap-1.5">
                {word.split('').map((letter, index) => (
                    <div key={index} className={`${baseClasses} ${getTileStyle(statuses[index] || 'default')}`}>
                        {letter}
                    </div>
                ))}
            </div>
            {description && <p className="text-center text-sm text-muted px-4">{description}</p>}
        </div>
    );
};

export default ExampleRow;
