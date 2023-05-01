/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { faHashtag, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUserStore } from '../../stores/UserStore';
import CloseButton from 'react-bootstrap/CloseButton';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export const ReplyHeader = () => {
  // グローバル状態管理
  const currentChannel = useUserStore((state) => state.currentChannel);
  const setShowReplies = useUserStore((state) => state.setShowReplies);

  // css
  const headerStyle = css`
    color: black;
    margin: 0;
    padding: 0;
    font-weight: bold;
    padding-top: 5px;
    padding-left: 20px;
    text-align: left;
  `;

  const containerStyle = css`
    padding: 0;
    margin: 0;
    text-align: left;
    background-color: white;
    overflow-wrap: anywhere; // 強制改行
  `;

  const titleStyle = css`
    text-align: left;
    font-size: 100%;
    padding-top: 5px;
    padding-left: 20px;
  `;

  const iconStyle = css`
    color: silver;
  }`;

  const channelStyle = css`
    color: silver;
    padding-left: 10px;
    text-align: left;
    font-size: 90%;
  }`;

  const closeButtonStyle = css`
    text-align: right;
    font-size: 60%;
    padding-top: 10px;
    padding-left: 15px;
  `;

  return (
    <Container css={containerStyle}>
      <Row>
        <Col css={[headerStyle, titleStyle]} xs={3}>
          スレッド
        </Col>
        <Col css={headerStyle}>
          {currentChannel.isPrivate ? (
            <FontAwesomeIcon icon={faLock} css={iconStyle} />
          ) : (
            <FontAwesomeIcon icon={faHashtag} css={iconStyle} />
          )}
          <span css={channelStyle}>{currentChannel.name}</span>
        </Col>
        <Col xs={2} css={closeButtonStyle}>
          <CloseButton onClick={() => setShowReplies(false)} />
        </Col>
      </Row>
    </Container>
  );
};
