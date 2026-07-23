/**
 * A second authentication factor. `TOTP` is a time based one-time password, as produced by an
 * authenticator app; `NONE` stands for no second factor at all.
 */
export type MFAKind = 'NONE' | 'TOTP';
