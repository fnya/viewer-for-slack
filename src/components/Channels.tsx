/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { Channel } from './Channel';
import { getMembers } from '../features/Member';
import { getUserChannels } from '../features/Channel';
import { useEffect } from 'react';
import { useUserStore } from '../stores/UserStore';

export const Channels = () => {
  // グローバル状態管理
  const accessToken = useUserStore((state) => state.accessToken);
  const channels = useUserStore((state) => state.channels);
  const userId = useUserStore((state) => state.userId);
  const webApiUrl = useUserStore((state) => state.webApiUrl);
  const setChannels = useUserStore((state) => state.setChannels);
  const setCurrentChannelId = useUserStore(
    (state) => state.setCurrentChannelId
  );
  const setMembers = useUserStore((state) => state.setMembers);
  const setViewInitialized = useUserStore((state) => state.setViewInitialized);

  useEffect(() => {
    const initChannels = async () => {
      console.log('チャンネル一覧を取得します。');
      setViewInitialized(false);

      // チャンネル一覧を取得する
      const channelsResponse = await getUserChannels(
        webApiUrl,
        userId,
        accessToken
      );
      setChannels(channelsResponse.channels);

      // メンバー情報を取得する
      const memberResponse = await getMembers(webApiUrl, accessToken);
      setMembers(memberResponse.members);

      // カレントチャンネル ID に先頭チャンネルの IDを設定する
      if (channelsResponse.channels.length > 0) {
        setCurrentChannelId(channelsResponse.channels[0].id);
      }

      console.log('チャンネル一覧を取得しました。');

      // 初期処理完了
      setViewInitialized(true);
    };

    void initChannels();
  }, []);

  return (
    <>
      {channels.map((channel) => {
        return <Channel key={channel.id} channel={channel} />;
      })}
    </>
  );
};
