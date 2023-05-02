import { InitializeUserRequest } from '@fnya/common-entity-for-slack/entity/request/InitializeUserRequest';
import { InitializeUserWithTokenRequest } from '@fnya/common-entity-for-slack/entity/request/InitializeUserWithTokenRequest';
import { InitializeUserResponse } from '@fnya/common-entity-for-slack/entity/response/InitializeUserResponse';
import { InitializeUserWithTokenResponse } from '@fnya/common-entity-for-slack/entity/response/InitializeUserWithTokenResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * ユーザー初期化処理を行う(1回目)
 *
 * @param url Web API URL
 * @param email メールアドレス
 * @returns レスポンス
 */
export const initializeUser1st = async (
  url: string,
  email: string
): Promise<InitializeUserResponse> => {
  const request = new InitializeUserRequest(RequestType.InitializeUser, email);

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as InitializeUserResponse;
};

/**
 * ユーザー初期化処理を行う(2回目)
 *
 * @param url Web API URL
 * @param email メールアドレス
 * @param password パスワード
 * @param rePassword パスワード(確認用)
 * @param token トークン
 * @returns レスポンス
 */
export const initializeUser2nd = async (
  url: string,
  email: string,
  password: string,
  rePassword: string,
  token: string
): Promise<InitializeUserWithTokenResponse> => {
  const request = new InitializeUserWithTokenRequest(
    RequestType.InitializeUserWithToken,
    email,
    password,
    rePassword,
    token
  );

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as InitializeUserWithTokenResponse;
};
