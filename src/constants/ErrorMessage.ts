export const ErrorMessage = {
  TOKEN_EXPIRED: 'token expired.',
  UNEXPECTED_ERROR: '予期せぬエラーが発生しました',
} as const;

// eslint-disable-next-line no-redeclare
export type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];
