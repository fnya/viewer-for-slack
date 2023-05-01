/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { MesssageEntity } from '@fnya/common-entity-for-slack/entity/response/entity/MesssageEntity';
import { useUserStore } from '../../stores/UserStore';

export const ReplyCount = (props: any) => {
  // グローバル状態管理
  const setCurrentMessage = useUserStore((state) => state.setCurrentMessage);
  const setShowReplies = useUserStore((state) => state.setShowReplies);

  // props
  const message: MesssageEntity = props.message;

  // css
  const replyCountStyle = css`
    color: #191970;
    margin: 0;
    padding: 0;
    font-size: 85%; /* 標準フォントサイズの85%に指定 */
    font-weight: bold;

    /** マウスオーバー時 */
    :hover {
      cursor: pointer;
    }
  `;

  return message.replyCount === 0 ? (
    <></>
  ) : (
    <div
      css={replyCountStyle}
      onClick={() => {
        setShowReplies(true), setCurrentMessage(message);
      }}
    >
      {message.replyCount} 件の返信
    </div>
  );
};
