import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low py-space-xl mt-auto border-t border-outline-variant/30">
      <div className="max-w-[1380px] mx-auto px-margin flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[16px]">vital_signs</span>
          </div>
          <span className="font-headline-md text-headline-md text-on-surface opacity-80 tracking-tight">
            PulseFit
          </span>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
          © 2026 PulseFit Technologies Inc. Precision computer vision & mindful kinetic performance.
        </p>

        <div className="flex items-center gap-space-lg">
          <a
            href="#privacy"
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#support"
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
