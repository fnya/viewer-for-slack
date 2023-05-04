/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import {
  convertAccessTokenToPayloadClaim,
  valiateAccessToken,
} from '../utils/AuthUtil';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import { login } from '../features/Login';
import { LoginResponse } from '@fnya/common-entity-for-slack/entity/response/LoginResponse';
import { process } from '@tauri-apps/api';
import { saveCredentials } from '../features/Credential';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '../stores/UserStore';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

export const Login = () => {
  // 定数定義
  const LOGIN_FAILURE_ERROR_MESSAGE =
    'メールアドレスまたはパスワードが異なります';
  const INVALID_ACCESS_TOKEN_ERROR_MESSAGE =
    'サーバーから受け取った情報が不正です';
  const SAVE_FAILURE_ERROR_MESSAGE = 'ログイン後処理に失敗しました';
  const UNEXPECTED_ERROR_MESSAGE = '予期せぬエラーが発生しました';
  const REQUIRE_EMAIL_ERROR_MESSAGE = 'メールアドレスを入力してください';
  const REQUIRE_PASSWORD_ERROR_MESSAGE = 'パスワードを入力してください';

  // グローバル状態管理
  const appName = useUserStore((state) => state.appName);
  const countPerRequest = useUserStore((state) => state.countPerRequest);
  const webApiUrl = useUserStore((state) => state.webApiUrl);
  const workSpaceName = useUserStore((state) => state.workSpaceName);
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

  // ローカル状態管理
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

  // ログイン処理
  const myLogin = async () => {
    // 入力チェック
    if (email === '') {
      setErrorMessage(REQUIRE_EMAIL_ERROR_MESSAGE);
      setHasError(true);
      return;
    }
    if (password === '') {
      setErrorMessage(REQUIRE_PASSWORD_ERROR_MESSAGE);
      setHasError(true);
      return;
    }

    // 前処理
    setloginLoading(true);
    setHasError(false);
    setErrorMessage('');

    // ログイン処理
    let result: LoginResponse;

    try {
      result = await login(webApiUrl, email, password);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      setHasError(true);
      setloginLoading(false);
      return;
    }

    if (result.httpStatusCode === HttpStatusCode.FORBIDDEN) {
      setErrorMessage(LOGIN_FAILURE_ERROR_MESSAGE);
      setHasError(true);
      setloginLoading(false);
      return;
    }

    if (result.httpStatusCode !== HttpStatusCode.OK) {
      setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      setHasError(true);
      setloginLoading(false);
      return;
    }

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
    const payloadClaim = convertAccessTokenToPayloadClaim(result.accessToken);

    // ユーザー情報をグローバル状態管理に保存
    setUserId(result.userId);
    setAccessToken(result.accessToken);
    setAccessTokenExpires(result.accessTokenExpires);
    setRefreshToken(result.refreshToken);
    setRefreshTokenExpires(result.refreshTokenExpires);
    setIsAdmin(payloadClaim.admin);

    // クレデンシャル保存
    const saveResult = (await saveCredentials(
      result.userId,
      result.refreshToken,
      result.refreshTokenExpires,
      true,
      payloadClaim.admin,
      appName,
      webApiUrl,
      countPerRequest,
      workSpaceName
    )) as string;

    if (saveResult === 'ok') {
      // 画面遷移
      navigate('/viewer');
    } else {
      console.error(SAVE_FAILURE_ERROR_MESSAGE);
      setErrorMessage(SAVE_FAILURE_ERROR_MESSAGE);
      setHasError(true);
    }

    setloginLoading(false);
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

  return (
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
  );
};
