/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';

export const Code = (props: any) => {
  // css
  const codeStyle = css`
    background-color: #dcdcdc;
    border-radius: 6px;
    color: #ff3333;
    padding: 2px;
    display: inline;
  `;

  // 前後の ` を削除する
  const removeMarkdown = (text: string) => {
    return text.substring(1).slice(0, -1);
  };

  return (
    <span key={props.codeKey} css={codeStyle}>
      {removeMarkdown(props.text)}
    </span>
  );
};
