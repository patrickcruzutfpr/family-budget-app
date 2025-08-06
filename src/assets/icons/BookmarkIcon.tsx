import React from 'react';

interface BookmarkIconProps {
  className?: string;
  filled?: boolean;
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({ className = 'w-5 h-5', filled = false }) => {
  if (filled) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2a2 2 0 00-2 2v16l8-4 8 4V4a2 2 0 00-2-2H6z" />
      </svg>
    );
  }
  
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
};
