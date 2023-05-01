/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { FileEntity } from '@fnya/common-entity-for-slack/entity/response/entity/FileEntity';
import { getBlob } from '../../features/Blob';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/UserStore';
import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import Alert from 'react-bootstrap/Alert';
import base64js from 'base64-js';
import Button from 'react-bootstrap/Button';

export const File = (props: any) => {
  // ローカル状態管理
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  // グローバル状態管理
  const webApiUrl = useUserStore((state) => state.webApiUrl);
  const accessToken = useUserStore((state) => state.accessToken);
  const currentChannel = useUserStore((state) => state.currentChannel);
  const userId = useUserStore((state) => state.userId);

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

    setMessage('ダウンロード中...');

    // blob を取得する
    const responseBlob = await getBlob(
      webApiUrl,
      userId,
      currentChannel.id,
      file.id,
      accessToken
    );

    // レスポンスから blob を作成してセットする
    const binary = base64js.toByteArray(responseBlob.blob);

    await writeBinaryFile(file.name, new Uint8Array(binary), {
      dir: BaseDirectory.Download,
    });

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
          >
            ダウンロード
          </Button>
        </div>
      </div>
    </>
  );
};
