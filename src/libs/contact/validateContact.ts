/**
 * お問い合わせフォームの入力ルール。
 * クライアント（ContactForm）とサーバー（POST /api/contact）で共有し、ルールの乖離を防ぐ。
 */
// replyTo に渡すため、アドレス区切りや表示名として解釈されうる , < > " も除外する
export const CONTACT_EMAIL_PATTERN = /^[^\s@,<>"]+@[^\s@,<>"]+\.[^\s@,<>"]+$/;

export const CONTACT_MAX_LENGTH = {
  name: 100,
  // RFC 5321 のアドレス長上限
  email: 254,
  subject: 200,
  message: 2000,
} as const;

// 件名・送信者名などはメールヘッダー相当の位置に埋め込まれるため改行を許可しない
const LINE_BREAK_PATTERN = /[\r\n\u0085\u2028\u2029]/;

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; error: string };

const FIELDS = [
  'name',
  'email',
  'subject',
  'message',
] as const satisfies readonly (keyof ContactInput)[];
const SINGLE_LINE_FIELDS: ReadonlySet<keyof ContactInput> = new Set(['name', 'email', 'subject']);

/**
 * 未検証のリクエストボディをお問い合わせ入力として検証する。
 * エラーメッセージには入力値を含めない。
 */
export const validateContact = (body: unknown): ContactValidationResult => {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, error: 'Invalid request body' };
  }

  const record = body as Record<string, unknown>;
  const value: ContactInput = { name: '', email: '', subject: '', message: '' };

  for (const field of FIELDS) {
    const raw = record[field];
    if (typeof raw !== 'string' || !raw.trim()) {
      return { ok: false, error: 'All fields are required' };
    }
    if (raw.length > CONTACT_MAX_LENGTH[field]) {
      return { ok: false, error: `${field} is too long` };
    }
    if (SINGLE_LINE_FIELDS.has(field) && LINE_BREAK_PATTERN.test(raw)) {
      return { ok: false, error: `${field} must not contain line breaks` };
    }
    value[field] = raw;
  }

  if (!CONTACT_EMAIL_PATTERN.test(value.email)) {
    return { ok: false, error: 'Invalid email format' };
  }

  return { ok: true, value };
};
