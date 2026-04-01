import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { QueryClientProvider } from './QueryClientProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composição de todos os providers da aplicação
 * Ordem importa: ErrorBoundary mais externo, QueryClient mais interno
 *
 * Uso em main.tsx ou App.tsx:
 * <AppProviders>
 *   <App />
 * </AppProviders>
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <ErrorBoundary>
    <QueryClientProvider>
      {children}
    </QueryClientProvider>
  </ErrorBoundary>
);

export { QueryClientProvider, ErrorBoundary };
