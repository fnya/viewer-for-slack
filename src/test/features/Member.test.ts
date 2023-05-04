import { describe, test, beforeEach, expect, jest } from '@jest/globals';
import { getMembers } from '../../features/Member';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import * as api from '../../utils/ApiUtil';

describe('Member のテスト', () => {
  describe('getMembers のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const url = 'https://example.com';
      const accessToken = 'accessToken';

      const expected = {
        httpStatus: HttpStatus.OK,
        httpStatusCode: HttpStatusCode.OK,
        members: [],
      };

      const postSpy = jest.spyOn(api, 'post');
      postSpy.mockImplementation(() => Promise.resolve(expected));

      // 実行
      const actual = await getMembers(url, accessToken);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
