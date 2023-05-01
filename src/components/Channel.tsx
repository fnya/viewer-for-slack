/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { ChannelEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ChannelEntity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faLock } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../stores/UserStore';

export const Channel = (props: any) => {
  // グローバル状態管理
  const currentChannel = useUserStore((state) => state.currentChannel);
  const setCurrentChannel = useUserStore((state) => state.setCurrentChannel);
  const setShowReplies = useUserStore((state) => state.setShowReplies);

  // props
  const channel: ChannelEntity = props.channel;

  // css
  const channelStyle = css`
    width: 100%;
    height: 40px;
    padding: 4px 10px;	

    /** マウスオーバー時 */
    :hover {
      color: #ffffff;
      background-color: #350d36;
      border-radius: 6px;
      cursor: pointer;
    }
  }`;

  const selectedChannelStyle = css`
    color: white;
    background-color: #1164a3;
    border-radius: 3px;
    margin: 5px;
    padding: 5px;

    /** マウスオーバー時 */
    :hover {
      color: white;
      background-color: #1164a3;
      cursor: pointer;
    }
  `;

  const iconStyle = css`
    padding-right: 10px;
    font-size: 0.8rem;
  }`;

  return (
    <div
      css={
        channel.id === currentChannel.id ? selectedChannelStyle : channelStyle
      }
      onClick={() => {
        setCurrentChannel(channel), setShowReplies(false);
      }}
    >
      {channel.isPrivate ? (
        <FontAwesomeIcon icon={faLock} css={iconStyle} />
      ) : (
        <FontAwesomeIcon icon={faHashtag} css={iconStyle} />
      )}
      <span>{channel.name}</span>
    </div>
  );
};
