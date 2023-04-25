import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import { login } from '../../features/Login';
import * as api from '../../utils/ApiUtil';

describe('Login のテスト', () => {
  describe('login のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com/initialize';
      const email = 'user@example.com';
      const password = 'password';
      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        userId: '0000000000',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        refreshTokenExpires: 0,
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await login(url, email, password);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
