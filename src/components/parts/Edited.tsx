/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';

export const Edited = (props: any) => {
  const styleClass = css`
    margin: 0;
    padding: 0;
    font-size: 90%; /* 標準フォントサイズの90%に指定 */
  `;

  return props.edited ? <div css={styleClass}>(編集済み)</div> : <></>;
};
