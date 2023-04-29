/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { ChannelContent } from './ChannelContent';
import { ChannelHeader } from './ChannelHeader';
import { MessageContent } from './MessageContent';
import { MessageHeader } from './MessageHeader';
import { ReplyContent } from './ReplyContent';
import { ReplyHeader } from './ReplyHeader';
import { useUserStore } from '../../stores/UserStore';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

export const Viewer = () => {
  // グローバル状態管理
  const viewInitialized = useUserStore((state) => state.viewInitialized);
  const showReplies = useUserStore((state) => state.showReplies);

  // css
  const containerStyle = css`
    background-color: white;
    overflow-wrap: anywhere; // 強制改行
  `;

  const sideHeaderTheme = css`
    color: #ffffff;
    background-color: #350d36;
  `;

  const sideContentTheme = css`
    color: #e6e6fa;
    background-color: #3f0e40;
  `;

  const headerHeightStyle = css`
    height: 4vh;
  `;

  const contentHeightStyle = css`
    height: 96vh;
  `;

  const alignLeftStyle = css`
    text-align: left;
  `;

  const paddingZeroStyle = css`
    padding: 0;
  `;

  const boldStyle = css`
    font-weight: bold;
  `;

  const leftBorder = css`
    border-left: 1px solid #e6e6fa;
  `;

  const bottomBorder = css`
    border-bottom: 1px solid #e6e6fa;
  `;

  const sidebarWidth = css`
    width: 20%;
  `;

  const noDisplayStyle = css`
    display: none;
  `;

  const displayBlockStyle = css`
    display: block;
  `;

  const loadingStyle = css`
    width: 100vw;
    height: 100vh;
  `;

  return viewInitialized ? (
    <Container css={containerStyle} fluid>
      <Row>
        <Col
          xs={2}
          css={[
            alignLeftStyle,
            boldStyle,
            headerHeightStyle,
            paddingZeroStyle,
            sidebarWidth,
            sideHeaderTheme,
          ]}
        >
          <ChannelHeader />
        </Col>
        <Col
          xs={showReplies ? 6 : undefined}
          css={[
            alignLeftStyle,
            boldStyle,
            bottomBorder,
            headerHeightStyle,
            paddingZeroStyle,
          ]}
        >
          <MessageHeader />
        </Col>
        <Col
          xs={showReplies ? undefined : 0}
          css={
            showReplies
              ? [
                  alignLeftStyle,
                  bottomBorder,
                  headerHeightStyle,
                  leftBorder,
                  paddingZeroStyle,
                ]
              : noDisplayStyle
          }
        >
          <ReplyHeader />
        </Col>
      </Row>
      <Row>
        <Col
          xs={2}
          css={[
            alignLeftStyle,
            contentHeightStyle,
            paddingZeroStyle,
            sidebarWidth,
            sideContentTheme,
          ]}
        >
          <ChannelContent />
        </Col>
        <Col
          xs={showReplies ? 6 : undefined}
          css={[alignLeftStyle, contentHeightStyle, paddingZeroStyle]}
        >
          <MessageContent />
        </Col>
        <Col
          xs={showReplies ? undefined : 0}
          css={
            showReplies
              ? [
                  alignLeftStyle,
                  contentHeightStyle,
                  leftBorder,
                  paddingZeroStyle,
                ]
              : noDisplayStyle
          }
        >
          <ReplyContent />
        </Col>
      </Row>
    </Container>
  ) : (
    <div css={loadingStyle}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Now loading...</span>
      </Spinner>
    </div>
  );
};