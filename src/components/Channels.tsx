/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { Channel } from './Channel';
import { ChannelEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ChannelEntity';
import { getMembers } from '../features/Member';
import { GetMembersResponse } from '@fnya/common-entity-for-slack/entity/response/GetMembersResponse';
import { getUserChannels } from '../features/Channel';
import { GetUsersChannelsResponse } from '@fnya/common-entity-for-slack/entity/response/GetUsersChannelsResponse';
import { refreshAccessToken } from '../utils/AuthUtil';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';

export const Channels = () => {
  // 定数
  const GET_CHANNELS_ERROR_MESSAGE = 'チャンネル一覧の取得に失敗しました。';
  const GET_MEMBERS_ERROR_MESSAGE = 'メンバー一覧の取得に失敗しました。';

  // ローカル状態管理
  const [channels, setChannels] = useState<ChannelEntity[]>([]);

  // グローバル状態管理
  const accessToken = useUserStore((state) => state.accessToken);
  const accessTokenExpires = useUserStore((state) => state.accessTokenExpires);
  const appName = useUserStore((state) => state.appName);
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
  const setCurrentChannel = useUserStore((state) => state.setCurrentChannel);
  const setErrorMessage = useUserStore((state) => state.setErrorMessage);
  const setMembers = useUserStore((state) => state.setMembers);
  const setViewInitialized = useUserStore((state) => state.setViewInitialized);

  // React Router
  const navigate = useNavigate();

  useEffect(() => {
    const initChannels = async () => {
      console.log('チャンネル一覧を取得します。');
      setViewInitialized(false);

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

      // チャンネル一覧を取得する
      let channelsResponse: GetUsersChannelsResponse;
      try {
        channelsResponse = await getUserChannels(
          webApiUrl,
          userId,
          accessToken
        );
      } catch (e) {
        console.error(GET_CHANNELS_ERROR_MESSAGE);
        console.error(e);
        setErrorMessage(GET_CHANNELS_ERROR_MESSAGE);
        return;
      }
      setChannels(channelsResponse.channels);

      // メンバー情報を取得する
      let memberResponse: GetMembersResponse;
      try {
        memberResponse = await getMembers(webApiUrl, accessToken);
      } catch (e) {
        console.error(GET_MEMBERS_ERROR_MESSAGE);
        console.error(e);
        setErrorMessage(GET_MEMBERS_ERROR_MESSAGE);
        return;
      }
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
