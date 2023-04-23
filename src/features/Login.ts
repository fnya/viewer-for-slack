import { LoginRequest } from '@fnya/common-entity-for-slack/entity/request/LoginRequest';
import { LoginResponse } from '@fnya/common-entity-for-slack/entity/response/LoginResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * ログイン処理を行う
 */
export const login = async (
  url: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  const request = new LoginRequest(RequestType.Login, email, password);

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response.data as LoginResponse;
};
