import DOMPurify from 'dompurify';

/**
 * Utilitário centralizado para prevenção de XSS (OWASP WSTG-CLNT-001)
 * Limpa strings HTML permitindo apenas formatação básica de texto.
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'li', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};