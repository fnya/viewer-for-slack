import { ErrorMessage } from '../constants/ErrorMessage';

/**
 * tsから日時文字列を作成する
 *
 * @param ts ts
 * @returns 日時文字列(yyyy/M/d HH:mm)
 */
export const toDateTimeString = (ts: string) => {
  const date = new Date(Number(ts) * 1000);

  return (
    date.getFullYear() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getDate() +
    ' ' +
    paddingZero(date.getHours(), 2) +
    ':' +
    paddingZero(date.getMinutes(), 2)
  );
};

/**
 * トークンが期限切れの場合はエラーをスローする(アクセストークン、リフレッシュトークン共通)
 *
 * @param tokenExpires トークンの期限
 */
export const validateTokenExpires = (tokenExpires: number) => {
  const currentDate = new Date();
  const currentDateTime = currentDate.valueOf() / 1000;

  if (tokenExpires <= currentDateTime) {
    throw new Error(ErrorMessage.TOKEN_EXPIRED);
  }
};

/**
 * 数値に前ゼロを付与する
 *
 * @param num 数値
 * @param paddingLength 前ゼロ桁数
 * @returns 前ゼロ付き数値(文字列)
 */
const paddingZero = (num: number, paddingLength: number) => {
  return ('0'.repeat(paddingLength) + num.toString()).slice(paddingLength * -1);
};
