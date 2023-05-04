/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { FileEntity } from '@fnya/common-entity-for-slack/entity/response/entity/FileEntity';
import { getBlob } from '../../features/Blob';
import { GetBlobResponse } from '@fnya/common-entity-for-slack/entity/response/GetBlobResponse';
import { refreshAccessToken } from '../../utils/AuthUtil';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '../../stores/UserStore';
import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import Alert from 'react-bootstrap/Alert';
import base64js from 'base64-js';
import Button from 'react-bootstrap/Button';

export const File = (props: any) => {
  // 定数
  const GET_BLOB_ERROR_MESSAGE = 'ファイルのダウンロードに失敗しました。';

  // ローカル状態管理
  const [disabled, setDisabled] = useState(false); // ボタンの有効/無効
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // グローバル状態管理
  const accessToken = useUserStore((state) => state.accessToken);
  const accessTokenExpires = useUserStore((state) => state.accessTokenExpires);
  const appName = useUserStore((state) => state.appName);
  const currentChannel = useUserStore((state) => state.currentChannel);
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

  // React Router
  const navigate = useNavigate();

  // props
  const file: FileEntity = props.file;

  // css
  const fileStyle = css`
    width: 90%;
    padding: 10px;
    background-color: #f0f8ff;
    border-radius: 10px;
  `;

  const buttonStyle = css`
    margin-top: 10px;
    margin-left: 5px;
  `;

  const noDisplayStyle = css`
    display: none;
  `;

  // ファイルのダウンロード
  const downloadFile = async () => {
    console.log('ファイルのダウンロードを開始します');
    setShowMessage(true);

    setDisabled(true);
    setMessage('ダウンロード中...');

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
      setAccessTokenExpires(refreshResult.refreshResponse?.accessTokenExpires!);
    }

    // blob を取得する
    let responseBlob: GetBlobResponse;
    try {
      responseBlob = await getBlob(
        webApiUrl,
        userId,
        currentChannel.id,
        file.id,
        accessToken
      );
    } catch (e) {
      console.error(GET_BLOB_ERROR_MESSAGE);
      console.error(e);
      setMessage(GET_BLOB_ERROR_MESSAGE);
      return;
    }

    // レスポンスから blob を作成してセットする
    const binary = base64js.toByteArray(responseBlob.blob);

    await writeBinaryFile(file.name, new Uint8Array(binary), {
      dir: BaseDirectory.Download,
    });

    setDisabled(false);
    setMessage('ダウンロードフォルダにダウンロードしました');

    console.log('ファイルのダウンロードが終了しました');
  };

  return (
    <>
      <div>
        <div css={fileStyle}>
          <Alert css={showMessage ? [] : noDisplayStyle} variant="info">
            {message}
          </Alert>
          {file.name}
          <br />
          <Button
            css={buttonStyle}
            variant="primary"
            onClick={() => downloadFile()}
            disabled={disabled}
          >
            ダウンロード
          </Button>
        </div>
      </div>
    </>
  );
};
