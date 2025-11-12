import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume - Ivan D. Ivanov',
  description:
    'View and download the resume of Ivan D. Ivanov, Front-End Developer specializing in React, TypeScript, and Next.js',
  openGraph: {
    title: 'Resume - Ivan D. Ivanov',
    description:
      'View and download the resume of Ivan D. Ivanov, Front-End Developer',
    type: 'website',
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
