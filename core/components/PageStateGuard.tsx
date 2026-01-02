import React, { ReactNode } from 'react';

interface PageStateGuardProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  loadingFallback?: ReactNode;
  emptyFallback?: ReactNode;
  children: ReactNode;
}

/**
 * A minimal wrapper to ensure consistent page-level state handling.
 * Only renders fallbacks when state is explicitly invalid.
 */
const PageStateGuard: React.FC<PageStateGuardProps> = ({ 
  isLoading, 
  isEmpty, 
  loadingFallback, 
  emptyFallback, 
  children 
}) => {
  if (isLoading && loadingFallback) {
    return <>{loadingFallback}</>;
  }

  if (isEmpty && emptyFallback) {
    return <>{emptyFallback}</>;
  }

  return <>{children}</>;
};

export default PageStateGuard;