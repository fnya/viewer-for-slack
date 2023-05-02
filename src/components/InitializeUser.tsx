/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import { InitializeUserResponse } from '@fnya/common-entity-for-slack/entity/response/InitializeUserResponse';
import { InitializeUserWithTokenResponse } from '@fnya/common-entity-for-slack/entity/response/InitializeUserWithTokenResponse';
import { process } from '@tauri-apps/api';
import { saveCredentials } from '../features/Credential';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '../stores/UserStore';
import {
  convertAccessTokenToPayloadClaim,
  valiateAccessToken,
} from '../utils/AuthUtil';
import {
  initializeUser1st,
  initializeUser2nd,
} from '../features/InitializeUser';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

export const InitializeUser = () => {
  // 定数定義
  const INITIALIZE_FAILURE_ERROR_MESSAGE = 'ユーザーの初期化に失敗しました';
  const INVALID_ACCESS_TOKEN_ERROR_MESSAGE =
    'サーバーから受け取った情報が不正です';
  const UNEXPECTED_ERROR_MESSAGE = '予期せぬエラーが発生しました';
  const REQUIRE_EMAIL_ERROR_MESSAGE = 'メールアドレスを入力してください';
  const REQUIRE_PASSWORD_ERROR_MESSAGE = 'パスワードを入力してください';
  const REQUIRE_TOKEN_ERROR_MESSAGE = 'トークンを入力してください';
  const INVALID_PASSWORD_ERROR_MESSAGE = 'パスワードが一致しません';
  const INVALID_INPUT_ERROR_MESSAGE = '入力内容に間違いがあります';

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
  const [initializeLoading, setInitializeLoading] = useState(false);
  const [show1st, setShow1st] = useState(true);
  const [show2nd, setShow2nd] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // React Router
  const navigate = useNavigate();

  // 初期化フォームの値
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [token, setToken] = useState('');

  // アプリ終了
  const exit = () => {
    process.exit(0);
  };

  // ユーザー初期化処理(1回目)
  const myInitializeUser1st = async () => {
    // 入力チェック
    if (email === '') {
      setErrorMessage(REQUIRE_EMAIL_ERROR_MESSAGE);
      setHasError(true);
      return;
    }

    // 前処理
    setInitializeLoading(true);
    setHasError(false);
    setErrorMessage('');

    let result: InitializeUserResponse;

    try {
      // 初期化処理(1回目)
      result = await initializeUser1st(webApiUrl, email);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      setHasError(true);
      setInitializeLoading(false);
      return;
    }

    if (result.httpStatusCode === HttpStatusCode.OK) {
      setShow1st(false);
      setShow2nd(true);
    } else if (result.httpStatusCode === HttpStatusCode.BAD_REQUEST) {
      setErrorMessage(INVALID_INPUT_ERROR_MESSAGE);
      setHasError(true);
    } else {
      setErrorMessage(INITIALIZE_FAILURE_ERROR_MESSAGE);
      setHasError(true);
      console.error(INITIALIZE_FAILURE_ERROR_MESSAGE);
    }

    setInitializeLoading(false);
  };

  // ユーザー初期化処理(2回目)
  const myInitializeUser2nd = async () => {
    // 入力チェック
    if (email === '') {
      setErrorMessage(REQUIRE_EMAIL_ERROR_MESSAGE);
      setHasError(true);
      return;
    }
    if (password === '' || rePassword === '') {
      setErrorMessage(REQUIRE_PASSWORD_ERROR_MESSAGE);
      setHasError(true);
      return;
    }
    if (password !== rePassword) {
      setErrorMessage(INVALID_PASSWORD_ERROR_MESSAGE);
      setHasError(true);
      return;
    }
    if (token === '') {
      setErrorMessage(REQUIRE_TOKEN_ERROR_MESSAGE);
      setHasError(true);
      return;
    }

    // 前処理
    setInitializeLoading(true);
    setHasError(false);
    setErrorMessage('');

    let result: InitializeUserWithTokenResponse;

    try {
      // 初期化処理(2回目)
      result = await initializeUser2nd(
        webApiUrl,
        email,
        password,
        rePassword,
        token
      );
    } catch (e: any) {
      console.log(UNEXPECTED_ERROR_MESSAGE);
      console.error(e);
      setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      setHasError(true);
      setInitializeLoading(false);
      return;
    }

    // 初期化失敗時処理
    if (result.httpStatusCode !== HttpStatusCode.OK) {
      setErrorMessage(INITIALIZE_FAILURE_ERROR_MESSAGE);
      setHasError(true);
      console.error(INITIALIZE_FAILURE_ERROR_MESSAGE);
      setInitializeLoading(false);
      return;
    }

    try {
      // JWTのアクセストークンを検証する
      valiateAccessToken(appName, result.accessToken);
    } catch (e) {
      console.error(e);
      setErrorMessage(INVALID_ACCESS_TOKEN_ERROR_MESSAGE);
      setHasError(true);
      setInitializeLoading(false);
      return;
    }

    // JWT のアクセストークンからペイロードクレームを取得する
    const payloadClaim = convertAccessTokenToPayloadClaim(result.accessToken);

    // ユーザー情報を store に反映
    setUserId(result.userId);
    setAccessToken(result.accessToken);
    setAccessTokenExpires(payloadClaim.exp);
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

    if (saveResult === 'error') {
      setErrorMessage(INITIALIZE_FAILURE_ERROR_MESSAGE);
      setHasError(true);
      console.error(INITIALIZE_FAILURE_ERROR_MESSAGE);
      setInitializeLoading(false);
      return;
    }

    // 画面遷移
    navigate('/viewer');
    setInitializeLoading(false);
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
  const buttonColor = css`
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
          <Modal.Title>ユーザー初期化</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div css={initializeLoading ? displayBlock : displayNone}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Now login...</span>
            </Spinner>
          </div>
          <div css={hasError ? displayBlock : displayNone}>
            <Alert variant="danger">{errorMessage}</Alert>
          </div>
          <div css={show1st ? displayBlock : displayNone}>
            <Alert variant="info">
              管理者によって登録済みのメールアドレスを入力してから「送信」ボタンをクリックしてください
            </Alert>
          </div>
          <div css={show2nd ? displayBlock : displayNone}>
            <Alert variant="info">
              パスワードと、メールアドレスに送信されたメールに記載されたトークンを入力してから「送信」ボタンをクリックしてください
            </Alert>
          </div>

          <Form.Label>メールアドレス</Form.Label>
          <Form.Control
            type="email"
            placeholder="user@example.com"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            disabled={initializeLoading || show2nd}
          />
          <div css={show2nd ? displayBlock : displayNone}>
            <Form.Label>パスワード</Form.Label>
            <Form.Control
              type="password"
              placeholder="パスワード"
              onChange={(e) => setPassword(e.target.value)}
              disabled={initializeLoading}
            />
            <Form.Label>パスワード(再入力)</Form.Label>
            <Form.Control
              type="password"
              placeholder="パスワード(再入力)"
              onChange={(e) => setRePassword(e.target.value)}
              disabled={initializeLoading}
            />
            <Form.Label>トークン</Form.Label>
            <Form.Control
              type="text"
              placeholder="トークン"
              onChange={(e) => setToken(e.target.value)}
              disabled={initializeLoading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => exit()}
            disabled={initializeLoading}
          >
            閉じる
          </Button>
          <Button
            css={show1st ? [buttonColor, displayBlock] : displayNone}
            disabled={initializeLoading}
            onClick={() => myInitializeUser1st()}
          >
            送信
          </Button>
          <Button
            css={show2nd ? [buttonColor, displayBlock] : displayNone}
            disabled={initializeLoading}
            onClick={() => myInitializeUser2nd()}
          >
            送信
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
