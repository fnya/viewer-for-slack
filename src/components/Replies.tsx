/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { getReplies } from '../features/Reply';
import { GetRepliesResponse } from '@fnya/common-entity-for-slack/entity/response/GetRepliesResponse';
import { MessageForReply } from './MessageForReply';
import { refreshAccessToken } from '../utils/AuthUtil';
import { Reply } from './Reply';
import { ReplyEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ReplyEntity';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';
import Spinner from 'react-bootstrap/Spinner';

export const Replies = (props: any) => {
  // 定数
  const GET_REPLIES_ERROR_MESSAGE = 'リプライ一覧の取得に失敗しました。';

  // ローカル状態管理
  const [loadingReplies, setLoadingReplies] = useState<boolean>(false);
  const [replies, setReplies] = useState<ReplyEntity[]>([]);

  // グローバル状態管理
  const accessToken = useUserStore((state) => state.accessToken);
  const accessTokenExpires = useUserStore((state) => state.accessTokenExpires);
  const appName = useUserStore((state) => state.appName);
  const currentChannel = useUserStore((state) => state.currentChannel);
  const currentMessage = useUserStore((state) => state.currentMessage);
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

  const loadingStyle = css``;

  useEffect(() => {
    const loadReplies = async () => {
      if (currentMessage.ts === '') {
        return;
      }

      console.log('リプライ一覧を取得します。');
      setLoadingReplies(true);

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

      // リプライ一覧を取得する
      let repliesResponse: GetRepliesResponse;

      try {
        repliesResponse = await getReplies(
          webApiUrl,
          currentChannel.id,
          currentMessage.ts,
          accessToken
        );
      } catch (e) {
        console.error(GET_REPLIES_ERROR_MESSAGE);
        console.error(e);
        setErrorMessage(GET_REPLIES_ERROR_MESSAGE);
        return;
      }
      setReplies(repliesResponse.replies);

      console.log('リプライ一覧を取得しました。');

      // リプライ一覧取得処理完了
      setLoadingReplies(false);
    };

    void loadReplies();
  }, [currentMessage.ts]);

  return (
    <>
      <div css={loadingReplies ? noDisplayStyle : displayBlockStyle}>
        <MessageForReply message={currentMessage} />
        {replies?.map((reply) => {
          return <Reply key={reply.ts} reply={reply} />;
        })}
      </div>
      <div css={loadingReplies ? loadingStyle : noDisplayStyle}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Now loading...</span>
        </Spinner>
      </div>
    </>
  );
};
