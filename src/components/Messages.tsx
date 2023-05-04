/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { getMessages } from '../features/Message';
import { GetMessagesResponse } from '@fnya/common-entity-for-slack/entity/response/GetMessagesResponse';
import { Message } from './Message';
import { MesssageEntity } from '@fnya/common-entity-for-slack/entity/response/entity/MesssageEntity';
import { refreshAccessToken } from '../utils/AuthUtil';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export const Messages = () => {
  // 定数
  const GET_MESSAGES_ERROR_MESSAGE = 'メッセージ一覧の取得に失敗しました。';

  // ローカル状態管理
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messages, setMessages] = useState<MesssageEntity[]>([]);
  const [oldestMessageTs, setOldestMessageTs] = useState('');
  const [loadingOldMessages, setLoadingOldMessages] = useState<boolean>(false);
  const [showOldMessagesButton, setShowOldMessagesButton] =
    useState<boolean>(false);

  // グローバル状態管理
  const accessToken = useUserStore((state) => state.accessToken);
  const accessTokenExpires = useUserStore((state) => state.accessTokenExpires);
  const appName = useUserStore((state) => state.appName);
  const countPerRequest = useUserStore((state) => state.countPerRequest);
  const currentChannel = useUserStore((state) => state.currentChannel);
  const refreshToken = useUserStore((state) => state.refreshToken);
  const refreshTokenExpires = useUserStore(
    (state) => state.refreshTokenExpires
  );
  const userId = useUserStore((state) => state.userId);
  const webApiUrl = useUserStore((state) => state.webApiUrl);
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setAccessTokenExpires = useUserStore(
    (state) => state.setAccessTokenExpires
  );
  const setErrorMessage = useUserStore((state) => state.setErrorMessage);

  // React Router
  const navigate = useNavigate();

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

    // アクセストークンが有効期限切れの場合はリフレッシュする
    const refreshResult = await refreshAccessToken(
      webApiUrl,
      userId,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
      appName
    );

    // リフレッシュトークンが期限切れの場合はログイン画面に遷移する
    if (refreshResult.shouldMoveToLogin === true) {
      navigate('/login');
      return;
    }

    // アクセストークンが更新された場合はグローバル状態を更新する
    if (refreshResult.refreshed === true) {
      setAccessToken(refreshResult.refreshResponse?.accessToken!);
      setAccessTokenExpires(refreshResult.refreshResponse?.accessTokenExpires!);
    }

    // メッセージ一覧を取得する
    let messagesResponse: GetMessagesResponse;
    try {
      messagesResponse = await getMessages(
        webApiUrl,
        currentChannel.id,
        accessToken,
        countPerRequest,
        oldestMessageTs
      );
    } catch (e) {
      console.error(GET_MESSAGES_ERROR_MESSAGE);
      console.error(e);
      setErrorMessage(GET_MESSAGES_ERROR_MESSAGE);
      return;
    }
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

      // アクセストークンが有効期限切れの場合はリフレッシュする
      const refreshResult = await refreshAccessToken(
        webApiUrl,
        userId,
        accessTokenExpires,
        refreshToken,
        refreshTokenExpires,
        appName
      );

      // リフレッシュトークンが期限切れの場合はログイン画面に遷移する
      if (refreshResult.shouldMoveToLogin === true) {
        navigate('/login');
        return;
      }

      // アクセストークンが更新された場合はグローバル状態を更新する
      if (refreshResult.refreshed === true) {
        setAccessToken(refreshResult.refreshResponse?.accessToken!);
        setAccessTokenExpires(
          refreshResult.refreshResponse?.accessTokenExpires!
        );
      }

      // メッセージ一覧を取得する
      let messagesResponse: GetMessagesResponse;
      try {
        messagesResponse = await getMessages(
          webApiUrl,
          currentChannel.id,
          accessToken,
          countPerRequest
        );
      } catch (e) {
        console.error(GET_MESSAGES_ERROR_MESSAGE);
        console.error(e);
        setErrorMessage(GET_MESSAGES_ERROR_MESSAGE);
        return;
      }
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
          古い投稿を取得する
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
