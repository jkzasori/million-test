'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    const html = document.documentElement;
    
    function showPage() {
      html.classList.add('fonts-loaded');
      html.style.visibility = 'visible';
      html.style.opacity = '1';
    }
    
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(showPage);
    } else {
      setTimeout(showPage, 100);
    }
    
    // Fallback timeout
    const fallbackTimeout = setTimeout(showPage, 500);
    
    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return null;
}