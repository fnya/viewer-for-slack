import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import { getUserChannels } from '../../features/Channel';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import * as api from '../../utils/ApiUtil';

describe('Channel のテスト', () => {
  describe('getUserChannels のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com';
      const userId = '0000000000';
      const accessToken = 'accessToken';

      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        channels: [],
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await getUserChannels(url, userId, accessToken);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
