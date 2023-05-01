/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { useUserStore } from '../../stores/UserStore';

export const Mention = (props: any) => {
  // グローバル状態管理
  const members = useUserStore((state) => state.members);

  // css
  const channelStyle = css`
    background-color: #f0e68c;
    padding: 3px;
    margin: 2px;
  `;

  const hereStyle = css`
    background-color: #f0e68c;
    padding: 3px;
    margin: 2px;
  `;

  const userStyle = css`
    color: #4169e1;
    background-color: #e0ffff;
    padding: 3px;
    margin: 2px;
  `;

  const convertToElement = (text: string) => {
    // @channel の置換
    if (text === '<!channel>') {
      return (
        <span key={props.mentionKey} css={channelStyle}>
          @channel
        </span>
      );
    }

    // @here の置換
    if (text === '<!here>') {
      return (
        <span key={props.mentionKey} css={hereStyle}>
          @here
        </span>
      );
    }

    // @user の置換
    const member = members.find((member) => `<@${member.id}>` === text);

    return (
      <span key={props.mentionKey} css={userStyle}>
        @{member?.name}
      </span>
    );
  };

  return <>{convertToElement(props.text)}</>;
};
