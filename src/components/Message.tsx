/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { convertTextToElements } from '../utils/ElementUtil';
import { DateTime } from './parts/DateTime';
import { Edited } from './parts/Edited';
import { Files } from './parts/Files';
import { MesssageEntity } from '@fnya/common-entity-for-slack/entity/response/entity/MesssageEntity';
import { ReplyCount } from './parts/ReplyCount';
import { User } from './parts/User';
import { useUserStore } from '../stores/UserStore';

export const Message = (props: any) => {
  // グローバル状態管理
  const setCurrentMessage = useUserStore((state) => state.setCurrentMessage);
  const setShowReplies = useUserStore((state) => state.setShowReplies);

  // props
  const message: MesssageEntity = props.message;

  // css
  const messageStyle = css`
    margin: 8px;
    border-bottom: 1px solid #e6e6fa;
    width: 98%;
    padding-bottom: 20px;

    :hover {
      background-color: #f5f5f5;
      border-radius: 6px;
    }
  `;

  const messageHeader = css`
    display: flex;
  `;

  return (
    <div css={messageStyle}>
      <div css={messageHeader}>
        <User userName={message.userName} />
        <DateTime ts={message.ts} />
      </div>

      {convertTextToElements(message.text, message.ts)}

      <Edited edited={message.isEdited} />

      <Files files={message.files} />

      <ReplyCount
        message={message}
        onClick={() => {
          setCurrentMessage(message), setShowReplies(true);
        }}
      />
    </div>
  );
};
