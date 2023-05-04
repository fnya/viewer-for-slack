import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import { getReplies } from '../../features/Reply';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import * as api from '../../utils/ApiUtil';

describe('Reply のテスト', () => {
  describe('getReplies のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com';
      const channelId = '1111111111';
      const ts = '1682953200';
      const accessToken = 'accessToken';

      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        channelId: '1111111111',
        channelName: 'channelName',
        replies: [],
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await getReplies(url, channelId, ts, accessToken);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
