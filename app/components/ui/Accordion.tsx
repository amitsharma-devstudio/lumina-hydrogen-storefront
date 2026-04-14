import { useState } from 'react';

export function Accordion({title, children}: {title: string; children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex w-full items-center justify-between py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-bold uppercase tracking-widest text-black">
          {title}
        </span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 4.5L6 9.5L11 4.5" stroke="black" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-sm leading-relaxed text-gray-600 prose prose-sm">
          {children}
        </div>
      </div>
    </div>
  );
}