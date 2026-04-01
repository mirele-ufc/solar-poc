import React, { ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider as TanStackQueryProvider,
} from '@tanstack/react-query';

/**
 * Configuração de Query Client (TanStack Query)
 * Alinhado com RNF18 (Performance — caching inteligente)
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Refetch em foco da janela
      refetchOnWindowFocus: true,
      // Tentar refetch 3 vezes em erro
      retry: 3,
      // Delay de retry com backoff exponencial
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Tentar 1 vez por padrão (rápido falhar)
      retry: 1,
    },
  },
});

interface QueryClientProviderProps {
  children: ReactNode;
}

/**
 * Provider de QueryClient
 * Envolta a aplicação para usar TanStack Query queries e mutations
 *
 * Uso:
 * <QueryClientProvider>
 *   <App />
 * </QueryClientProvider>
 */
export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
}) => (
  <TanStackQueryProvider client={queryClient}>
    {children}
  </TanStackQueryProvider>
);

export { queryClient };
