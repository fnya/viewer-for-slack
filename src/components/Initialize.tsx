/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { process } from '@tauri-apps/api';
import { saveCredentials } from '../features/Credential';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '../stores/UserStore';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export const Initialize = () => {
  // ローカル状態管理
  const [appName, setAppName] = useState('');
  const [webApiUrl, setWebApiUrl] = useState('');
  const [countPerRequest, setCountPerRequest] = useState(10);
  const [workSpaceName, setWorkSpaceName] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // グローバル状態管理
  const setGlobalAppName = useUserStore((state) => state.setAppName);
  const setGlobalWebApiUrl = useUserStore((state) => state.setWebApiUrl);
  const setGlobalCountPerRequest = useUserStore(
    (state) => state.setCountPerRequest
  );
  const setGlobalWorkSpaceName = useUserStore(
    (state) => state.setWorkSpaceName
  );

  // React Router
  const navigate = useNavigate();

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

  // アプリ終了
  const exit = () => {
    process.exit(0);
  };

  // クレデンシャルを保存する
  const mySaveCredentials = async () => {
    // 入力チェックする
    if (appName === '') {
      setErrorMessage('アプリ名を入力してください');
      setHasError(true);
      return;
    }
    if (webApiUrl === '') {
      setErrorMessage('Web API の URL を入力してください');
      setHasError(true);
      return;
    }
    if (workSpaceName === '') {
      setErrorMessage('ワークスペース名を入力してください');
      setHasError(true);
      return;
    }

    // クレデンシャルを保存する
    const result = (await saveCredentials(
      '',
      '',
      0,
      false,
      false,
      appName,
      webApiUrl,
      countPerRequest,
      workSpaceName
    )) as string;

    if (result === 'ok') {
      // グローバル状態管理に保存する
      setGlobalAppName(appName);
      setGlobalCountPerRequest(countPerRequest);
      setGlobalWebApiUrl(webApiUrl);
      setGlobalWorkSpaceName(workSpaceName);

      // ユーザー初期化画面へ遷移する
      navigate('/initializeUser');
    } else {
      setErrorMessage('設定の保存に失敗しました');
      setHasError(true);
    }
  };

  return (
    <>
      <Modal
        show={true}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header css={slackTheme}>
          <Modal.Title>初期設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div css={hasError ? displayBlock : displayNone}>
            <Alert variant="danger">{errorMessage}</Alert>
          </div>
          <div>
            <Alert variant="info">
              アプリケーションの初期設定を入力して「保存する」ボタンをクリックしてください。
            </Alert>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>アプリ名</Form.Label>
            <Form.Control
              type="text"
              placeholder="Viewer for Slack"
              autoFocus
              onChange={(e) => setAppName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Web API の URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://example.com"
              onChange={(e) => setWebApiUrl(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ワークスペース名</Form.Label>
            <Form.Control
              type="text"
              placeholder="ワークスペース名"
              onChange={(e) => setWorkSpaceName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>1リクエストあたりの取得件数</Form.Label>
            <Form.Select
              onChange={(e) => setCountPerRequest(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => exit()}>
            閉じる
          </Button>
          <Button onClick={() => mySaveCredentials()}>保存する</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
