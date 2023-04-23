import axios from 'axios';

/**
 * Web API にリクエストを送信する
 *
 * @param url Web API の URL
 * @param request リクエスト
 * @returns
 */
export const post = async (url: string, request: string) => {
  // Google Apps Script ではこのヘッダーを付けないとエラーになる
  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // API 呼び出し
  const response = await axios.post(url, request, options);

  return response;
};
