import { GetMembersRequest } from '@fnya/common-entity-for-slack/entity/request/GetMembersRequest';
import { GetMembersResponse } from '@fnya/common-entity-for-slack/entity/response/GetMembersResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * メンバー一覧取得処理を行う
 *
 * @param url Web API URL
 * @param accessToken アクセストークン
 * @returns レスポンス
 */
export const getMembers = async (
  url: string,
  accessToken: string
): Promise<GetMembersResponse> => {
  const request = new GetMembersRequest(RequestType.GetMembers, accessToken);

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as GetMembersResponse;
};
