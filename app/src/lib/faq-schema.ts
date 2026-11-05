export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * A FAQPage JSON-LD node for a route's `schema`. Build it from the same array
 * the page's <FaqList> renders, so only visible questions are in the markup.
 * Plain .ts (no JSX) so src/routes.ts can import it under `node --test`.
 */
export function faqSchemaNode(items: readonly FaqItem[], pageUrl: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
