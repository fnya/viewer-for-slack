/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { getMessages } from '../features/Message';
import { Message } from './Message';
import { MesssageEntity } from '@fnya/common-entity-for-slack/entity/response/entity/MesssageEntity';
import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/UserStore';
import Spinner from 'react-bootstrap/Spinner';

export const Messages = () => {
  // ローカル状態管理
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messages, setMessages] = useState<MesssageEntity[]>([]);

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

  useEffect(() => {
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

      console.log('メッセージ一覧を取得しました。');

      // メッセージ一覧取得処理完了
      setLoadingMessages(false);
    };

    void loadMessages();
  }, [currentChannel.id]);

  return (
    <>
      <div css={loadingMessages ? noDisplayStyle : displayBlockStyle}>
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
