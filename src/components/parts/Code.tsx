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

  return (
    <span key={props.codeKey} css={codeStyle}>
      {props.text}
    </span>
  );
};
