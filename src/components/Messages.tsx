/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { getMessages } from '../features/Message';
import { Message } from './Message';
import { MesssageEntity } from '@fnya/common-entity-for-slack/entity/response/entity/MesssageEntity';
import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/UserStore';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export const Messages = () => {
  // ローカル状態管理
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messages, setMessages] = useState<MesssageEntity[]>([]);
  const [oldestMessageTs, setOldestMessageTs] = useState('');
  const [loadingOldMessages, setLoadingOldMessages] = useState<boolean>(false);
  const [showOldMessagesButton, setShowOldMessagesButton] =
    useState<boolean>(false);

  // グローバル状態管理
  const currentChannel = useUserStore((state) => state.currentChannel);
  const webApiUrl = useUserStore((state) => state.webApiUrl);
  const countPerRequest = useUserStore((state) => state.countPerRequest);
  const accessToken = useUserStore((state) => state.accessToken);

  // css
  const noDisplayStyle = css`
    display: none;
  `;

  const displayBlockStyle = css`
    display: block;
  `;

  const loadingStyle = css`
    width: 80vw;
    height: 90vh;
  `;

  const loadingOldMessagesStyle = css`
    width: 80vw;
    height: 10vh;
  `;

  const buttonStyle = css`
    text-align: left;
    font-size: 0.9rem;
    width: 100%;
    height: 40px;
  `;

  // 古いメッセージ一覧を取得する
  const loadOldMessages = async () => {
    console.log('古いメッセージ一覧を取得します。');
    setLoadingOldMessages(true);

    // メッセージ一覧を取得する
    const messagesResponse = await getMessages(
      webApiUrl,
      currentChannel.id,
      accessToken,
      countPerRequest,
      oldestMessageTs
    );
    setMessages([...messagesResponse.messages, ...messages]);

    if (messagesResponse.messages.length === 0) {
      setShowOldMessagesButton(false);
    } else {
      setOldestMessageTs(messagesResponse.messages[0].ts);
    }

    console.log('古いメッセージ一覧を取得しました。');

    // 古いメッセージ一覧取得処理完了
    setLoadingOldMessages(false);
  };

  // チャンネル ID が変わったらメッセージ一覧を取得する
  useEffect(() => {
    // メッセージ一覧を取得する
    const loadMessages = async () => {
      if (currentChannel.id === '') {
        return;
      }

      console.log('メッセージ一覧を取得します。');
      setLoadingMessages(true);

      // メッセージ一覧を取得する
      const messagesResponse = await getMessages(
        webApiUrl,
        currentChannel.id,
        accessToken,
        countPerRequest
      );
      setMessages(messagesResponse.messages);

      // メッセージが0件の場合はボタンを表示しない
      if (messagesResponse.messages.length === 0) {
        setShowOldMessagesButton(false);
      } else {
        setShowOldMessagesButton(true);
        setOldestMessageTs(messagesResponse.messages[0].ts);
      }

      console.log('メッセージ一覧を取得しました。');

      // メッセージ一覧取得処理完了
      setLoadingMessages(false);
    };

    void loadMessages();
  }, [currentChannel.id]);

  return (
    <>
      <div css={loadingMessages ? noDisplayStyle : displayBlockStyle}>
        <div
          css={loadingOldMessages ? loadingOldMessagesStyle : noDisplayStyle}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Now loading...</span>
          </Spinner>
        </div>
        <Button
          css={showOldMessagesButton ? buttonStyle : noDisplayStyle}
          disabled={loadingOldMessages}
          variant="link"
          onClick={() => {
            loadOldMessages();
          }}
        >
          古いメッセージを取得する
        </Button>

        {messages?.map((message) => {
          return <Message key={message.ts} message={message} />;
        })}
      </div>
      <div css={loadingMessages ? loadingStyle : noDisplayStyle}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Now loading...</span>
        </Spinner>
      </div>
    </>
  );
};
