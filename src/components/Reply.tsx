/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { convertTextToElements } from '../utils/ElementUtil';
import { DateTime } from './parts/DateTime';
import { Edited } from './parts/Edited';
import { Files } from './parts/Files';
import { ReplyEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ReplyEntity';
import { User } from './parts/User';

export const Reply = (props: any) => {
  // props
  const reply: ReplyEntity = props.reply;

  // css
  const replyStyle = css`
    margin: 8px;
    border-bottom: 1px solid #e6e6fa;
    width: 98%;
    padding-bottom: 20px;

    :hover {
      background-color: #f5f5f5;
      border-radius: 6px;
    }
  `;

  const replyHeader = css`
    display: flex;
  `;

  return (
    <div css={replyStyle}>
      <div css={replyHeader}>
        <User userName={reply.userName} />
        <DateTime ts={reply.ts} />
      </div>

      {convertTextToElements(reply.text, reply.ts)}

      <Edited edited={reply.isEdited} />

      <Files files={reply.files} />
    </div>
  );
};
