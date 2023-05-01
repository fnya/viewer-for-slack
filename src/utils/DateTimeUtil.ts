/**
 * tsから日時文字列を作成する
 *
 * @param ts ts
 * @returns 日時文字列(yyyy-MM-dd HH:mm:ss)
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
 * 数値に前ゼロを付与する
 *
 * @param num 数値
 * @param paddingLength 前ゼロ桁数
 * @returns 前ゼロ付き数値(文字列)
 */
const paddingZero = (num: number, paddingLength: number) => {
  return ('0'.repeat(paddingLength) + num.toString()).slice(paddingLength * -1);
};
