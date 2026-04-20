'use client';

import React, { useEffect } from 'react';

export default function WithSmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add smooth scroll behavior to the html element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return <>{children}</>;
}
