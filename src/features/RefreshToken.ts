import { RefreshRequest } from '@fnya/common-entity-for-slack/entity/request/RefreshRequest';
import { RefreshResponse } from '@fnya/common-entity-for-slack/entity/response/RefreshResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * アクセストークン更新処理を行う
 *
 * @param url Web API URL
 * @param userId ユーザー ID
 * @param refreshToken リフレッシュトークン
 * @returns レスポンス
 */
export const refreshAccessToken = async (
  url: string,
  userId: string,
  refreshToken: string
): Promise<RefreshResponse> => {
  const request = new RefreshRequest(
    RequestType.RefreshToken,
    userId,
    refreshToken
  );

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as RefreshResponse;
};
