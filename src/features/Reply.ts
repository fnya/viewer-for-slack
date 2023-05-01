import { GetRepliesRequest } from '@fnya/common-entity-for-slack/entity/request/GetRepliesRequest';
import { GetRepliesResponse } from '@fnya/common-entity-for-slack/entity/response/GetRepliesResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * リプライ一覧取得処理を行う
 *
 * @param url Web API URL
 * @param channelId チャンネルID
 * @param ts メッセージのタイムスタンプ
 * @param accessToken アクセストークン
 * @returns レスポンス
 */
export const getReplies = async (
  url: string,
  channelId: string,
  ts: string,
  accessToken: string
): Promise<GetRepliesResponse> => {
  const request = new GetRepliesRequest(
    RequestType.GetReplies,
    channelId,
    ts,
    accessToken
  );

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as GetRepliesResponse;
};
