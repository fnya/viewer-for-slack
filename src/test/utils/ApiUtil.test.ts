import { describe, test, expect, afterEach, jest } from '@jest/globals';
import { post } from '../../utils/ApiUtil';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiUtil のテスト', () => {
  describe('post のテスト', () => {
    test('post して想定の結果が返ってくること', async () => {
      // 準備
      const url = 'https://example.com';
      const request = 'request';
      const response = {
        data: 'data',
      };
      const expected = 'data';
      mockedAxios.post.mockResolvedValue(response);

      // 実行
      const actual = await post(url, request);
      console.log(actual);

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
