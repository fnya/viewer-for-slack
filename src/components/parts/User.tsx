/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';

export const User = (props: any) => {
  const styleClass = css`
    font-weight: bold;
  `;

  return <div css={styleClass}>{props.userName}</div>;
};
