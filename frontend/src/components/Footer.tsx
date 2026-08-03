import React from 'react';

interface FooterProps {
  onOpenDocs: () => void;
  onOpenLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, onOpenLogin }) => {
  return (
    <footer className="bg-[#F1F4F3] border-t border-[#C4C6D0] py-6 px-6 lg:px-10 w-full mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        {/* Left Brand */}
        <div className="flex items-center gap-4">
          <span className="font-headline font-bold text-lg text-[#000A1F]">
            EcoLink
          </span>
          <span className="text-[#44474F] font-body text-sm border-l border-[#747780] pl-4">
            Industrial Sustainability
          </span>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-body text-[#44474F]">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="hover:underline text-[#006A6A] font-semibold transition-colors cursor-pointer"
            >
              Portal Sign In
            </button>
          )}
          <button
            onClick={onOpenDocs}
            className="hover:underline hover:text-[#006A6A] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenDocs}
            className="hover:underline hover:text-[#006A6A] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={onOpenDocs}
            className="hover:underline hover:text-[#006A6A] transition-colors cursor-pointer"
          >
            Environmental Commitment
          </button>
        </div>

        {/* Right Copyright */}
        <p className="font-body text-sm text-[#44474F]">
          © 2026 EcoLink Industrial. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
