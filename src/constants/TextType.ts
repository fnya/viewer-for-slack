/**
 * 投稿分割後のテキストの種類
 */
export const TextType = {
  Code: 'Code',
  CodeBlock: 'CodeBlock',
  Mention: 'Mention',
  Normal: 'Normal',
} as const;

export type TextType = (typeof TextType)[keyof typeof TextType];
