import { Buffer } from 'buffer';
import { ErrorMessage } from '../constants/ErrorMessage';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import { RefreshResponse } from '@fnya/common-entity-for-slack/entity/response/RefreshResponse';
import { RefreshTokenResult } from '../types/RefreshTokenResult';
import * as RefreshToken from '../features/RefreshToken';

/**
 * アクセストークンのペイロードを取得する
 *
 * @param accessToken アクセストークン
 * @returns ペイロード
 */
export const convertAccessTokenToPayloadClaim = (accessToken: string): any => {
  const payloadClaim = accessToken.split('.')[1];

  // ペイロードを Base64 デコードして JSON に変換
  return JSON.parse(Buffer.from(payloadClaim, 'base64').toString());
};

/**
 *  アクセストークンを検証する(失敗時は例外をスロー)
 *
 * @param issuer 発行者
 * @param accessToken アクセストークン
 */
export const valiateAccessToken = (
  issuer: string,
  accessToken: string
): void => {
  const payloadClaim = convertAccessTokenToPayloadClaim(accessToken);

  // 現在時刻を取得
  const now = Math.floor(Date.now() / 1000);

  // トークンの発行日時を検証
  if (payloadClaim.iat > now) {
    throw new Error('Token has invalid issued time');
  }

  // トークンの有効期限を検証
  if (payloadClaim.exp < now) {
    throw new Error('Token has expired');
  }

  // トークンの発行者を検証
  if (payloadClaim.iss !== issuer) {
    throw new Error('Token was not issued by expected issuer');
  }
};

/**
 * アクセストークンが期限切れの場合はリフレッシュする
 *
 * @param webApiUrl Web API の URL
 * @param userId ユーザー ID
 * @param accessTokenExpires アクセストークンの期限
 * @param refreshToken リフレッシュトークン
 * @param refreshTokenExpires リフレッシュトークンの期限
 * @param issuer 発行者
 * @returns アクセストークンのリフレッシュ結果
 */
export const refreshAccessToken = async (
  webApiUrl: string,
  userId: string,
  accessTokenExpires: number,
  refreshToken: string,
  refreshTokenExpires: number,
  issuer: string
): Promise<RefreshTokenResult> => {
  // アクセストークンの期限検証
  try {
    validateTokenExpires(accessTokenExpires);
  } catch (e) {
    // リフレッシュトークンの期限検証
    try {
      validateTokenExpires(refreshTokenExpires);
    } catch (e) {
      // リフレッシュトークンの期限切れのためログイン画面に遷移する
      return { shouldMoveToLogin: true };
    }

    // リフレッシュトークンの期限が切れていない場合はリフレッシュトークンを使用してアクセストークンを更新する
    let refreshResponse: RefreshResponse;
    try {
      refreshResponse = await RefreshToken.refreshAccessToken(
        webApiUrl,
        userId,
        refreshToken
      );
    } catch (e) {
      // エラーが起きた場合はログイン画面に遷移する
      console.error(ErrorMessage.UNEXPECTED_ERROR);
      console.error(e);
      return { shouldMoveToLogin: true };
    }

    // 200 以外はログイン画面に遷移する(リクエストにリフレッシュトークンが期限切れになった場合)
    if (refreshResponse.httpStatusCode !== HttpStatusCode.OK) {
      console.error(ErrorMessage.TOKEN_EXPIRED);
      return { shouldMoveToLogin: true };
    }

    // アクセストークンを検証する
    try {
      valiateAccessToken(issuer, refreshResponse.accessToken);
    } catch (e) {
      // アクセストークンの検証に失敗した場合はログイン画面に遷移する
      console.error(e);
      return { shouldMoveToLogin: true };
    }

    return {
      refreshed: true,
      refreshResponse,
    };
  }

  // アクセストークンに問題がない
  return {
    refreshed: false,
  };
};

/**
 * トークンが期限切れの場合はエラーをスローする(アクセストークン、リフレッシュトークン共通)
 *
 * @param tokenExpires トークンの期限
 */
export const validateTokenExpires = (tokenExpires: number) => {
  const currentDate = new Date();
  const currentDateTime = Math.floor(currentDate.valueOf() / 1000);

  if (tokenExpires < currentDateTime) {
    throw new Error(ErrorMessage.TOKEN_EXPIRED);
  }
};
