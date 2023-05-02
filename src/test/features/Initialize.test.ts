import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import { initialize1st, initialize2nd } from '../../features/InitializeUser';
import * as api from '../../utils/ApiUtil';

describe('Initialize のテスト', () => {
  describe('initialize1st のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com/initialize';
      const email = 'user@example.com';
      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        token: '0000000000',
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await initialize1st(url, email);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('initialize2nd のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com/initialize';
      const email = 'user@example.com';
      const password = 'password';
      const rePassword = 'password';
      const token = '0000000000';
      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        token: '0000000000',
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await initialize2nd(
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
