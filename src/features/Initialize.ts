import { InitializeUserRequest } from '@fnya/common-entity-for-slack/entity/request/InitializeUserRequest';
import { InitializeUserWithTokenRequest } from '@fnya/common-entity-for-slack/entity/request/InitializeUserWithTokenRequest';
import { InitializeUserResponse } from '@fnya/common-entity-for-slack/entity/response/InitializeUserResponse';
import { InitializeUserWithTokenResponse } from '@fnya/common-entity-for-slack/entity/response/InitializeUserWithTokenResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * 初期化処理を行う(1回目)
 */
export const initialize1st = async (
  url: string,
  email: string
): Promise<InitializeUserResponse> => {
  const request = new InitializeUserRequest(RequestType.InitializeUser, email);

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response.data as InitializeUserResponse;
};

/**
 * 初期化処理を行う(2回目)
 */
export const initialize2nd = async (
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

  return response.data as InitializeUserWithTokenResponse;
};
