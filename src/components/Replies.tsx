/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { getReplies } from '../features/Reply';
import { MessageForReply } from './MessageForReply';
import { Reply } from './Reply';
import { ReplyEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ReplyEntity';
import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/UserStore';
import Spinner from 'react-bootstrap/Spinner';

export const Replies = (props: any) => {
  // ローカル状態管理
  const [loadingReplies, setLoadingReplies] = useState<boolean>(false);
  const [replies, setReplies] = useState<ReplyEntity[]>([]);

  // グローバル状態管理
  const currentChannel = useUserStore((state) => state.currentChannel);
  const currentMessage = useUserStore((state) => state.currentMessage);
  const webApiUrl = useUserStore((state) => state.webApiUrl);
  const accessToken = useUserStore((state) => state.accessToken);

  // css
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

  useEffect(() => {
    const loadReplies = async () => {
      if (currentMessage.ts === '') {
        return;
      }

      console.log('リプライ一覧を取得します。');
      setLoadingReplies(true);

      // リプライ一覧を取得する
      const repliesResponse = await getReplies(
        webApiUrl,
        currentChannel.id,
        currentMessage.ts,
        accessToken
      );
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
