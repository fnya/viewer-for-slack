import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import {
  initializeUser1st,
  initializeUser2nd,
} from '../../features/InitializeUser';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import * as api from '../../utils/ApiUtil';

describe('InitializeUser のテスト', () => {
  describe('initializeUser1st のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com';
      const email = 'user@example.com';

      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        token: '01234567',
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await initializeUser1st(url, email);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('initializeUser2nd のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com';
      const email = 'user@example.com';
      const password = 'password';
      const rePassword = 'password';
      const token = '01234567';

      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        token: '012345678',
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await initializeUser2nd(
        url,
        email,
        password,
        rePassword,
        token
      );

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
