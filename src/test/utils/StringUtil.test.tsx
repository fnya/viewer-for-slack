import { describe, test, beforeEach, expect } from '@jest/globals';
import {
  splitPostText,
  splitCodeBlock,
  splitMention,
  fixMarkdownError,
  fixUrlError,
  splitCode,
} from '../../utils/StringUtil';
import { TextType } from '../../constants/TextType';

describe('StringUtil のテスト', () => {
  describe('splitPostText のテスト', () => {
    test('投稿の分割が正しく行われること', () => {
      // 準備
      const text = `<!channel> \`\`\`コードブロック\`\`\`===マッチ後===<https://example.com|htps://example.com>`;
      const expected = [
        { text: `<!channel>`, textType: TextType.Mention },
        { text: ` `, textType: TextType.Normal },
        {
          text: `コードブロック`,
          textType: TextType.CodeBlock,
        },
        {
          text: `＝マッチ後＝[https://example.com](https://example.com)`,
          textType: TextType.Normal,
        },
      ];

      // 実行
      const actual = splitPostText(text);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('splitCodeBlock のテスト', () => {
    test('コードブロックが単独の場合に正しく変換が行われること', () => {
      // 準備
      const text = `コードブロック単独マッチ\n\`\`\`\nコードブロックマッチ部分\n\`\`\`\nマッチ後`;
      const expected = [
        { text: `コードブロック単独マッチ\n`, textType: TextType.Normal },
        {
          text: `\nコードブロックマッチ部分\n`,
          textType: TextType.CodeBlock,
        },
        { text: `\nマッチ後`, textType: TextType.Normal },
      ];

      // 実行
      const actual = splitCodeBlock(text);

      // 検証
      expect(actual).toEqual(expected);
    });

    test('コードブロックが複数の場合に正しく変換が行われること', () => {
      // 準備
      const text = `コードブロック単独マッチ\n\`\`\`\nコードブロックマッチ部分\n\`\`\`\nマッチ後\`\`\`\nコードブロック2つ目のマッチ部分\n\`\`\``;
      const expected = [
        { text: `コードブロック単独マッチ\n`, textType: TextType.Normal },
        {
          text: `\nコードブロックマッチ部分\n`,
          textType: TextType.CodeBlock,
        },
        { text: `\nマッチ後`, textType: TextType.Normal },
        {
          text: `\nコードブロック2つ目のマッチ部分\n`,
          textType: TextType.CodeBlock,
        },
      ];

      // 実行
      const actual = splitCodeBlock(text);

      // 検証
      expect(actual).toEqual(expected);
    });

    test('コードブロックが存在しない場合は Normal が作成されること', () => {
      // 準備
      const text = `コードブロックなし`;
      const expected = [
        { text: `コードブロックなし`, textType: TextType.Normal },
      ];

      // 実行
      const actual = splitCodeBlock(text);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('splitMention のテスト', () => {
    test('メンションが正しく変換が行われること', () => {
      // 準備
      const text = [
        {
          text: `メンションあり<!channel> <!here> <@U0123456789> <@U01234ABCDE>\n\n\n<@UABCDE01234>abc`,
          textType: TextType.Normal,
        },
        {
          text: `\`\`\`コードブロックマッチ部分\`\`\``,
          textType: TextType.CodeBlock,
        },
        { text: `メンションなし`, textType: TextType.Normal },
      ];

      const expected = [
        {
          text: `メンションあり`,
          textType: TextType.Normal,
        },
        {
          text: `<!channel>`,
          textType: TextType.Mention,
        },
        {
          text: ` `,
          textType: TextType.Normal,
        },
        {
          text: `<!here>`,
          textType: TextType.Mention,
        },
        {
          text: ` `,
          textType: TextType.Normal,
        },
        {
          text: `<@U0123456789>`,
          textType: TextType.Mention,
        },
        {
          text: ` `,
          textType: TextType.Normal,
        },
        {
          text: `<@U01234ABCDE>`,
          textType: TextType.Mention,
        },
        {
          text: `\n\n\n`,
          textType: TextType.Normal,
        },
        {
          text: `<@UABCDE01234>`,
          textType: TextType.Mention,
        },
        {
          text: `abc`,
          textType: TextType.Normal,
        },
        {
          text: `\`\`\`コードブロックマッチ部分\`\`\``,
          textType: TextType.CodeBlock,
        },
        { text: `メンションなし`, textType: TextType.Normal },
      ];

      // 実行
      const actual = splitMention(text);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('splitCode のテスト', () => {
    test('コードが正しく分割される', () => {
      // 準備
      const text = [
        {
          text: `コード以外1\`コード1\`\n\n\nコード以外2\`コード2\`コード以外3`,
          textType: TextType.Normal,
        },
        { text: `コードなし`, textType: TextType.Normal },
      ];

      const expected = [
        {
          text: `コード以外1`,
          textType: TextType.Normal,
        },
        {
          text: `コード1`,
          textType: TextType.Code,
        },
        {
          text: `\n\n\nコード以外2`,
          textType: TextType.Normal,
        },
        {
          text: `コード2`,
          textType: TextType.Code,
        },
        {
          text: `コード以外3`,
          textType: TextType.Normal,
        },
        { text: `コードなし`, textType: TextType.Normal },
      ];

      // 実行
      const actual = splitCode(text);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('fixMarkdownError のテスト', () => {
    test('Markdown のエラー対応が正しく行われること', () => {
      // 準備
      const text = [
        {
          text: `=== == =\n--- -- -\n1.ABC\n 2. CDE`,
          textType: TextType.Normal,
        },
        {
          text: `<@UABCDE01234>`,
          textType: TextType.Mention,
        },
        {
          text: `\`\`\`コードブロックマッチ部分\`\`\``,
          textType: TextType.CodeBlock,
        },
        {
          text: `**Normal`,
          textType: TextType.Normal,
        },
        {
          text: `Normal**`,
          textType: TextType.Normal,
        },
        {
          text: `*Normal`,
          textType: TextType.Normal,
        },
        {
          text: `Normal*`,
          textType: TextType.Normal,
        },
        { text: `変換対象外`, textType: TextType.Normal },
      ];
      const expected = [
        {
          text: `＝ ＝ =\nー ー -\n1.ABC\n _2.CDE`,
          textType: TextType.Normal,
        },
        {
          text: `<@UABCDE01234>`,
          textType: TextType.Mention,
        },
        {
          text: `\`\`\`コードブロックマッチ部分\`\`\``,
          textType: TextType.CodeBlock,
        },
        {
          text: `Normal`,
          textType: TextType.Normal,
        },
        {
          text: `Normal`,
          textType: TextType.Normal,
        },
        {
          text: `Normal`,
          textType: TextType.Normal,
        },
        {
          text: `Normal`,
          textType: TextType.Normal,
        },
        { text: `変換対象外`, textType: TextType.Normal },
      ];

      // 実行
      const actual = fixMarkdownError(text);

      // 検証
      expect(actual).toEqual(expected);
    });

    describe('fixUrlError のテスト', () => {
      test('URL のエラー対応が正しく行われること', () => {
        // 準備
        const text = [
          {
            text: ` <https://example.com/test1|https://example.com/test1>\n\nhttps://example.com/test2 <https://example.com/test3>`,
            textType: TextType.Normal,
          },

          {
            text: `<@UABCDE01234>`,
            textType: TextType.Mention,
          },
          {
            text: `\`\`\`コードブロックマッチ部分\`\`\``,
            textType: TextType.CodeBlock,
          },
          { text: `変換対象外`, textType: TextType.Normal },
        ];
        const expected = [
          {
            text: ` [https://example.com/test1](https://example.com/test1)\n\nhttps://example.com/test2 [https://example.com/test3](https://example.com/test3)`,
            textType: TextType.Normal,
          },
          {
            text: `<@UABCDE01234>`,
            textType: TextType.Mention,
          },
          {
            text: `\`\`\`コードブロックマッチ部分\`\`\``,
            textType: TextType.CodeBlock,
          },
          { text: `変換対象外`, textType: TextType.Normal },
        ];

        // 実行
        const actual = fixUrlError(text);

        // 検証
        expect(actual).toEqual(expected);
      });
    });
  });
});
