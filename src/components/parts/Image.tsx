/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { FileEntity } from '@fnya/common-entity-for-slack/entity/response/entity/FileEntity';
import { getBlob } from '../../features/Blob';
import { GetBlobResponse } from '@fnya/common-entity-for-slack/entity/response/GetBlobResponse';
import { refreshAccessToken } from '../../utils/AuthUtil';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/UserStore';
import base64js from 'base64-js';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

export const MyImage = (props: any) => {
  // 定数
  const GET_BLOB_ERROR_MESSAGE = '画像の取得に失敗しました。';

  // ローカル状態管理
  const [imageUrl, setImageUrl] = useState('');
  const [showImage, setShowImage] = useState(false);

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
  const setErrorMessage = useUserStore((state) => state.setErrorMessage);

  // React Router
  const navigate = useNavigate();

  // props
  const file: FileEntity = props.file;

  // css
  const fileNameStyle = css`
    font-size: 0.8em;
    font-color: #808080;
    margin-left: 15px;
  `;

  const imageStyle = css`
    width: 20vw;
    margin: 10px;

    :hover {
      cursor: zoom-in;
    }
  `;

  const fullScreenStyle = css`
    text-align: center;
    width: 80%;

    padding: 10px;
  `;

  useEffect(() => {
    const getMyBlob = async () => {
      console.log('画像の初期化を開始します');

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
        setErrorMessage(GET_BLOB_ERROR_MESSAGE);
        return;
      }

      // レスポンスから blob を作成してセットする
      const binary = base64js.toByteArray(responseBlob.blob);

      try {
        setImageUrl(
          URL.createObjectURL(new Blob([binary], { type: file.mimeType }))
        );
      } catch (e: any) {
        console.log(e.message);
      }

      console.log('画像の初期化が終了しました');
    };

    void getMyBlob();
  }, []);

  return (
    <>
      {imageUrl !== '' ? (
        <div>
          <div css={fileNameStyle}>{file.name}</div>
          <Image
            src={imageUrl}
            css={imageStyle}
            thumbnail
            onClick={() => setShowImage(true)}
          />
          <Modal
            show={showImage}
            fullscreen={true}
            onHide={() => setShowImage(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>{file.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img css={fullScreenStyle} src={imageUrl} />
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Now loading...</span>
        </Spinner>
      )}
    </>
  );
};
