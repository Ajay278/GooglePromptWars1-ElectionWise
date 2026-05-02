import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("flex flex-col h-full max-h-screen overflow-hidden", className)}>
      {children}
    </div>
  );
}
