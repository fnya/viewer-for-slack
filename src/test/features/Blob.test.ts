import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import { getBlob } from '../../features/Blob';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import * as api from '../../utils/ApiUtil';

describe('Blob のテスト', () => {
  describe('getBlob のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com';
      const userId = '0000000000';
      const channelId = '1111111111';
      const fileId = '2222222222';
      const accessToken = 'accessToken';

      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        blob: 'blob',
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await getBlob(url, userId, channelId, fileId, accessToken);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
