/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { ErrorMessage } from '../constants/ErrorMessage';
import { loadCredentials } from '../features/Credential';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';
import { validateTokenExpires } from '../utils/AuthUtil';

export const Index = () => {
  // グローバル状態管理
  const setAppName = useUserStore((state) => state.setAppName);
  const setCountPerRequest = useUserStore((state) => state.setCountPerRequest);
  const setErrorMessage = useUserStore((state) => state.setErrorMessage);
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const setUserId = useUserStore((state) => state.setUserId);
  const setRefreshTokenExpires = useUserStore(
    (state) => state.setRefreshTokenExpires
  );
  const setRefreshToken = useUserStore((state) => state.setRefreshToken);
  const setWebApiUrl = useUserStore((state) => state.setWebApiUrl);
  const setWorkSpaceName = useUserStore((state) => state.setWorkSpaceName);

  // React Router
  const navigate = useNavigate();

  useEffect(() => {
    // クレデンシャルをロードする
    const myLoadCredentials = async () => {
      const credentials = (await loadCredentials()) as string;

      if (credentials === 'error') {
        // クレデンシャルがロードできない場合は初期化画面へ遷移する
        navigate('/initialize');
        return;
      }

      const credentialsJson = JSON.parse(credentials);

      // 必要情報セット
      setAppName(credentialsJson.appName);
      setCountPerRequest(credentialsJson.countPerRequest);
      setWebApiUrl(credentialsJson.webApiUrl);
      setWorkSpaceName(credentialsJson.workSpaceName);

      if (credentialsJson.userInitialized === false) {
        // ユーザー初期化未完了の場合は初期化画面へ遷移する
        navigate('/initializeUser');
        return;
      }

      if (credentialsJson.userInitialized === true) {
        try {
          validateTokenExpires(credentialsJson.refreshTokenExpires);
        } catch (e) {
          // ログイン画面へ遷移する
          navigate('/login');
          return;
        }

        // ビュー画面へ遷移する
        setUserId(credentialsJson.userId);
        setRefreshToken(credentialsJson.refreshToken);
        setRefreshTokenExpires(credentialsJson.refreshTokenExpires);
        setIsAdmin(credentialsJson.isAdmin);
        navigate('/viewer');
        return;
      }

      // ここはこない
      setErrorMessage(ErrorMessage.UNEXPECTED_ERROR);
      navigate('/viewer');
    };

    void myLoadCredentials();
  }, []);

  return <div></div>;
};
