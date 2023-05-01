import { GetMessagesRequest } from '@fnya/common-entity-for-slack/entity/request/GetMessagesRequest';
import { GetMessagesResponse } from '@fnya/common-entity-for-slack/entity/response/GetMessagesResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * ユーザーのチャンネル一覧取得処理を行う
 *
 * @param url Web API URL
 * @param channelId チャンネルID
 * @param accessToken アクセストークン
 * @param countPerRequest 1回のリクエストで取得するメッセージ数
 * @returns レスポンス
 */
export const getMessages = async (
  url: string,
  channelId: string,
  accessToken: string,
  countPerRequest: number
): Promise<GetMessagesResponse> => {
  const request = new GetMessagesRequest(
    RequestType.GetMessages,
    channelId,
    accessToken,
    String(countPerRequest)
  );

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as GetMessagesResponse;
};
