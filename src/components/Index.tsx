/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { loadCredentials } from '../features/Credential';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../stores/UserStore';

export const Index = () => {
  // グローバル状態管理
  const setAppName = useUserStore((state) => state.setAppName);
  const setWebApiUrl = useUserStore((state) => state.setWebApiUrl);
  const setCountPerRequest = useUserStore((state) => state.setCountPerRequest);
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
      } else {
        // クレデンシャルがロードできた場合はグローバル状態に設定する
        const credentialsJson = JSON.parse(credentials);
        setAppName(credentialsJson.appName);
        setWebApiUrl(credentialsJson.webApiUrl);
        setCountPerRequest(credentialsJson.countPerRequest);
        setWorkSpaceName(credentialsJson.workSpaceName);

        if (credentialsJson.userInitialized === true) {
          // ユーザー初期化済みの場合はログイン画面へ遷移する
          navigate('/login');
        } else {
          // ユーザー初期化未完了の場合は初期化画面へ遷移する
          navigate('/initializeUser');
        }
      }
    };

    void myLoadCredentials();
  }, []);

  return <div></div>;
};
