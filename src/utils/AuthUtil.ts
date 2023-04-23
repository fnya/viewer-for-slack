import { Buffer } from 'buffer';

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
