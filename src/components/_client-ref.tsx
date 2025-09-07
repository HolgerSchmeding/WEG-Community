'use client';

import { useState, useEffect } from 'react';

export default function ClientRef() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force client-side hydration
  if (typeof window !== 'undefined') {
    return null;
  }

  return null;
}
