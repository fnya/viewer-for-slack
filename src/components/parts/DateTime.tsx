/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { toDateTimeString } from '../../utils/DateTimeUtil';

export const DateTime = (props: any) => {
  const styleClass = css`
    margin-left: 10px;
    padding-top: 3px;
    font-size: 80%; /* 標準フォントサイズの80%に指定 */
  `;

  return <div css={styleClass}>{toDateTimeString(props.ts)}</div>;
};
