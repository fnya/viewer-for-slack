/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { Channel } from './Channel';
import { ChannelEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ChannelEntity';
import { getMembers } from '../features/Member';
import { getUserChannels } from '../features/Channel';
import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/UserStore';

export const Channels = () => {
  // ローカル状態管理
  const [channels, setChannels] = useState<ChannelEntity[]>([]);

  // グローバル状態管理
  const accessToken = useUserStore((state) => state.accessToken);
  const userId = useUserStore((state) => state.userId);
  const webApiUrl = useUserStore((state) => state.webApiUrl);
  const setCurrentChannel = useUserStore((state) => state.setCurrentChannel);
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
        setCurrentChannel(channelsResponse.channels[0]);
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
