import { GetUsersChannelsRequest } from '@fnya/common-entity-for-slack/entity/request/GetUsersChannelsRequest';
import { GetUsersChannelsResponse } from '@fnya/common-entity-for-slack/entity/response/GetUsersChannelsResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * ユーザーのチャンネル一覧取得処理を行う
 *
 * @param url Web API URL
 * @param accessToken アクセストークン
 * @returns レスポンス
 */
export const getUserChannels = async (
  url: string,
  userId: string,
  accessToken: string
): Promise<GetUsersChannelsResponse> => {
  const request = new GetUsersChannelsRequest(
    RequestType.GetUsersChannels,
    userId,
    accessToken
  );

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as GetUsersChannelsResponse;
};
