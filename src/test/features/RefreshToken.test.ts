import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import { refreshAccessToken } from '../../features/RefreshToken';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import * as api from '../../utils/ApiUtil';

describe('RefreshToken のテスト', () => {
  describe('refreshAccessToken のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com';
      const userId = '0000000000';
      const refreshToken = 'refreshToken';

      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        accessToken: 'accessToken',
        accessTokenExpires: 1682953200,
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await refreshAccessToken(url, userId, refreshToken);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
