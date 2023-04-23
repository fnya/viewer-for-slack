/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import {
  convertAccessTokenToPayloadClaim,
  valiateAccessToken,
} from '../utils/AuthUtil';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import { loadApp } from '../features/Load';
import { login } from '../features/Login';
import { process } from '@tauri-apps/api';
import { saveCredentials } from '../features/Credential';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/UserStore';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

export const Login = () => {
  // 定数定義
  const INITIALIZE_FAILURE_ERROR_MESSAGE =
    'アプリケーションの初期化に失敗しました';
  const LOGIN_FAILURE_ERROR_MESSAGE =
    'ユーザー ID またはパスワードが異なります';
  const INVALID_ACCESS_TOKEN_ERROR_MESSAGE =
    'サーバーから受け取った情報が不正です';
  const SAVE_FAILURE_ERROR_MESSAGE = 'ログイン後処理に失敗しました';
  const UNEXPECTED_ERROR_MESSAGE = '予期せぬエラーが発生しました';

  // store の定義を取得
  const setAppName = useUserStore((state) => state.setAppName);
  const setWebApiUrl = useUserStore((state) => state.setWebApiUrl);
  const setCountPerRequest = useUserStore((state) => state.setCountPerRequest);
  const setWorkSpaceName = useUserStore((state) => state.setWorkSpaceName);
  const setUserId = useUserStore((state) => state.setUserId);
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setAccessTokenExpires = useUserStore(
    (state) => state.setAccessTokenExpires
  );
  const setRefreshToken = useUserStore((state) => state.setRefreshToken);
  const setRefreshTokenExpires = useUserStore(
    (state) => state.setRefreshTokenExpires
  );
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const appName = useUserStore((state) => state.appName);
  const webApiUrl = useUserStore((state) => state.webApiUrl);

  // ローカルの state を定義
  const [loaded, setLoaded] = useState(true);
  const [loginLoading, setloginLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // React Router
  const navigate = useNavigate();

  // ログインフォームの値
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // アプリ終了
  const exit = () => {
    process.exit(0);
  };

  // 起動時にアプリの設定をロードして store に反映する
  useEffect(() => {
    const load = async () => {
      setLoaded(false);
      setHasError(false);
      setErrorMessage('');

      try {
        // アプリ設定の読み込み
        const appConfig = await loadApp();

        // アプリ設定を store に反映
        setAppName(appConfig.name);
        setWebApiUrl(appConfig.url);
        setCountPerRequest(appConfig.countPerRequest);
        setWorkSpaceName(appConfig.workSpaceName);
      } catch (e: any) {
        console.error(e);
        setErrorMessage(INITIALIZE_FAILURE_ERROR_MESSAGE);
        setHasError(true);
        console.error(INITIALIZE_FAILURE_ERROR_MESSAGE);
      }

      setLoaded(true);
      console.log('画面がロードされました');
    };

    void load();
  }, []);

  // ログイン処理
  const myLogin = async () => {
    setloginLoading(true);
    setHasError(false);
    setErrorMessage('');

    try {
      // ログイン処理
      const result = await login(webApiUrl, email, password);

      if (result.httpStatusCode === HttpStatusCode.OK) {
        try {
          // JWTのアクセストークンを検証する
          valiateAccessToken(appName, result.accessToken);
        } catch (e) {
          console.error(e);
          setErrorMessage(INVALID_ACCESS_TOKEN_ERROR_MESSAGE);
          setHasError(true);
          setloginLoading(false);
          return;
        }

        // JWT のアクセストークンからペイロードクレームを取得する
        const payloadClaim = convertAccessTokenToPayloadClaim(
          result.accessToken
        );

        // ユーザー情報を store に反映
        setUserId(result.userId);
        setAccessToken(result.accessToken);
        setRefreshToken(result.refreshToken);
        setRefreshTokenExpires(result.refreshTokenExpires);
        setIsAdmin(payloadClaim.admin);
        setAccessTokenExpires(payloadClaim.exp);

        // クレデンシャル保存
        try {
          await saveCredentials(
            result.userId,
            result.refreshToken,
            result.refreshTokenExpires,
            true,
            false,
            appName
          );

          // 画面遷移
          navigate('/viewer');
        } catch (e) {
          console.error(e);
          setErrorMessage(SAVE_FAILURE_ERROR_MESSAGE);
          setHasError(true);
        }
      } else {
        setErrorMessage(LOGIN_FAILURE_ERROR_MESSAGE);
        setHasError(true);
        console.error(LOGIN_FAILURE_ERROR_MESSAGE);
      }

      setloginLoading(false);
      console.log('ログイン処理が終了しました');
    } catch (e: any) {
      console.error(e);
      setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      setHasError(true);
      setloginLoading(false);
      console.error('ログイン処理が失敗しました');
    }
  };

  // css
  const displayNone = css`
    display: none;
  `;

  const displayBlock = css`
    display: block;
  `;

  const slackTheme = css`
    color: #e6e6fa;
    background-color: #3f0e40;
    margin: 0;
    padding: 10px;
  `;
  const loginButtonColor = css`
    background-color: #1164a3;
  `;

  return loaded ? (
    <>
      <Modal
        show={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header css={slackTheme}>
          <Modal.Title>ログイン</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div css={loginLoading ? displayBlock : displayNone}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Now login...</span>
            </Spinner>
          </div>
          <div css={hasError ? displayBlock : displayNone}>
            <Alert variant="danger">{errorMessage}</Alert>
          </div>

          <Form.Label>メールアドレス</Form.Label>
          <Form.Control
            type="email"
            placeholder="user@example.com"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            disabled={loginLoading}
          />

          <Form.Label>パスワード</Form.Label>
          <Form.Control
            type="password"
            placeholder="パスワード"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => exit()}
            disabled={loginLoading}
          >
            閉じる
          </Button>
          <Button
            css={loginButtonColor}
            disabled={loginLoading}
            onClick={() => myLogin()}
          >
            ログイン
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  ) : (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};
