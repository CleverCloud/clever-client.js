/**
 * A message the console shows on one of its pages (a maintenance, specific rules, an incident),
 * already in the user's language.
 */
export interface Notice {
  /** Identifier of the notice. */
  id: string;
  /** Plain text title. */
  title: string;
  /** Plain text message. */
  message: string;
  /** How the notice should be presented. */
  intent: NoticeIntent;
}

/**
 * How a notice should be presented.
 */
export type NoticeIntent = 'info' | 'success' | 'warning' | 'danger';

/**
 * A notice of the add-on provider list, about one provider or about the whole list.
 */
export interface ProviderNotice extends Notice {
  /** Add-on provider the notice is about. Absent when the notice is about the whole list. */
  addonProviderId?: string;
}
