/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { useUserStore } from '../../stores/UserStore';

export const WorkSpace = () => {
  // グローバル状態管理
  const workSpaceName = useUserStore((state) => state.workSpaceName);

  // css
  const workSpaceStyle = css`
    padding-top: 5px;
    padding-left: 10px;
    font-size: 90%; /* 標準フォントサイズの90%に指定 */
  `;

  return <div css={workSpaceStyle}>{workSpaceName}</div>;
};
