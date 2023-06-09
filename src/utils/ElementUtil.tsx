/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { Code } from '../components/parts/Code';
import { CodeBlock } from '../components/parts/CodeBlock';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { Mention } from '../components/parts/Mention';
import { splitPostText } from './StringUtil';
import { TextType } from '../constants/TextType';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; // HTML パーサー

// css
const markdownStyle = css`
  text-align: left;
  white-space: pre-line; /* 改行を反映 */
  display: inline;
`;

/**
 * テキストを要素に変換する
 *
 * @param text テキスト
 * @param ts タイムスタンプ
 * @returns 要素
 */
export const convertTextToElements = (text: string, ts: string) => {
  // レスポンスを作成する
  const elements: EmotionJSX.Element[] = [];

  // 投稿を分割する
  const texts = splitPostText(text);

  // テキストを要素に変換する
  texts.forEach((text, index) => {
    if (text.textType === TextType.Code) {
      elements.push(
        <Code
          key={`${ts}-${index}`}
          text={text.text}
          codeKey={`${ts}-${index}-code`}
        />
      );
    } else if (text.textType === TextType.CodeBlock) {
      elements.push(
        <CodeBlock
          key={`${ts}-${index}`}
          text={text.text}
          codeBlockKey={`${ts}-${index}-code-block`}
        />
      );
    } else if (text.textType === TextType.Mention) {
      elements.push(
        <Mention
          key={`${ts}-${index}`}
          text={text.text}
          mentionKey={`${ts}-${index}-mention`}
        />
      );
    } else {
      // Normal
      elements.push(
        <ReactMarkdown
          linkTarget="_blank"
          css={markdownStyle}
          rehypePlugins={[rehypeRaw]}
          key={`${ts}-${index}`}
        >
          {text.text}
        </ReactMarkdown>
      );
    }
  });

  return elements;
};
