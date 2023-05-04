/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; // HTML パーサー

export const CodeBlock = (props: any) => {
  const markdownStyle = css`
    text-align: left;
    white-space: pre-line; /* 改行を反映 */
    background-color: #dcdcdc;
    border-radius: 6px;
    padding: 10px;
    width: 98%;
  `;

  return (
    <ReactMarkdown
      linkTarget="_blank"
      css={markdownStyle}
      rehypePlugins={[rehypeRaw]}
      key={props.codeBlockKey}
      components={{ p: 'span' }}
    >
      {props.text}
    </ReactMarkdown>
  );
};
