import { GetBlobRequest } from '@fnya/common-entity-for-slack/entity/request/GetBlobRequest';
import { GetBlobResponse } from '@fnya/common-entity-for-slack/entity/response/GetBlobResponse';
import { post } from '../utils/ApiUtil';
import { RequestType } from '@fnya/common-entity-for-slack/constant/RequestType';

/**
 * Blob 取得処理を行う
 *
 * @param url Web API URL
 * @param userId ユーザー ID
 * @param channelId チャンネル ID
 * @param fileId ファイル ID
 * @param accessToken アクセストークン
 * @returns レスポンス
 */
export const getBlob = async (
  url: string,
  userId: string,
  channelId: string,
  fileId: string,
  accessToken: string
): Promise<GetBlobResponse> => {
  const request = new GetBlobRequest(
    RequestType.GetBlob,
    userId,
    channelId,
    fileId,
    accessToken
  );

  // API 呼び出し
  const response = await post(url, JSON.stringify(request));

  return response as GetBlobResponse;
};
