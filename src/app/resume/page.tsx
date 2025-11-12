'use client';

import React from 'react';
import { ResumeViewer } from '@/components/sections/about/ResumeViewer';
import { useRouter } from 'next/navigation';

export default function ResumePage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/#about');
  };

  return <ResumeViewer isOpen={true} onClose={handleClose} />;
}
