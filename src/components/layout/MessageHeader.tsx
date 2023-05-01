/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faLock } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../../stores/UserStore';

export const MessageHeader = () => {
  // グローバル状態管理
  const currentChannel = useUserStore((state) => state.currentChannel);

  // css
  const channelStyle = css`
    width: 100%;
    height: 100%;
    padding-top: 5px;
    padding-left: 10px;	
  }`;

  const iconStyle = css`
    padding-right: 10px;
    font-size: 0.8rem;
  }`;

  return (
    <div css={channelStyle}>
      {currentChannel.isPrivate ? (
        <FontAwesomeIcon icon={faLock} css={iconStyle} />
      ) : (
        <FontAwesomeIcon icon={faHashtag} css={iconStyle} />
      )}
      <span>{currentChannel.name}</span>
    </div>
  );
};
