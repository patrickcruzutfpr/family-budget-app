import React from 'react';

export const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m16 16 3-8 3 8c-.8.9-2 1-3 1-1 0-2.2-.1-3-1z"></path>
        <path d="m2 16 3-8 3 8c-.8.9-2 1-3 1-1 0-2.2-.1-3-1z"></path>
        <path d="M7 21h10"></path>
        <path d="M12 3v18"></path>
        <path d="M3 7h18"></path>
    </svg>
);
