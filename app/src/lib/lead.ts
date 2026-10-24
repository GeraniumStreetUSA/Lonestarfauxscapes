import { z } from 'zod';

import { QUOTE } from '../data/home-content.ts';

/**
 * The homepage quote form: validation and the JSON the existing Pages
 * Function (`functions/api/contact.js`) expects:
 *
 *   { name, email, phone, location, service, message, website, turnstileToken }
 *
 * The API requires name, email and message. The form never asks for a message
 * outright, so `message` is composed: the visitor's details, plus the
 * estimator's numbers when they sent them; with neither, the system, project
 * type and place they picked. DOM-free so it is unit tested.
 */

export const SYSTEM_OPTIONS = QUOTE.systems;
export const PROJECT_TYPES = QUOTE.projectTypes;

export const quoteSchema = z.object({
  name: z.string().trim().min(1, QUOTE.errors.name).max(80, QUOTE.errors.name),
  email: z.string().trim().min(1, QUOTE.errors.email).max(254).email(QUOTE.errors.email),
  phone: z.string().trim().max(40),
  location: z.string().trim().min(1, QUOTE.errors.location).max(80, QUOTE.errors.location),
  system: z.string().refine((v) => (SYSTEM_OPTIONS as readonly string[]).includes(v), QUOTE.errors.system),
  projectType: z.string().refine((v) => (PROJECT_TYPES as readonly string[]).includes(v), QUOTE.errors.projectType),
  details: z.string().trim().max(2000),
  /** Honeypot. Real visitors never see or fill it. */
  website: z.string(),
});

export type QuoteValues = z.infer<typeof quoteSchema>;

export const EMPTY_QUOTE: QuoteValues = {
  name: '',
  email: '',
  phone: '',
  location: '',
  system: '',
  projectType: '',
  details: '',
  website: '',
};

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  message: string;
  website: string;
  turnstileToken: string;
}

/** "Artificial hedge / Residential": the chip label, a slash, the project type. */
export function serviceLine(system: string, projectType: string): string {
  return [system, projectType].filter(Boolean).join(' / ');
}

export function composeMessage(details: string, estimateSummary: string, service: string, location: string): string {
  const parts = [details.trim(), estimateSummary.trim()].filter(Boolean);
  if (parts.length > 0) return parts.join('\n\n');
  return [service, location.trim()].filter(Boolean).join(', ');
}

export function buildLeadPayload(
  values: QuoteValues,
  estimateSummary: string,
  turnstileToken: string,
): LeadPayload {
  const service = serviceLine(values.system, values.projectType);
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    location: values.location.trim(),
    service,
    message: composeMessage(values.details, estimateSummary, service, values.location),
    website: values.website,
    turnstileToken,
  };
}
