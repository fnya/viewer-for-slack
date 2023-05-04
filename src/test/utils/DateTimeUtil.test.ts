import { describe, test, expect, afterEach, jest } from '@jest/globals';
import {
  toDateTimeString,
  validateTokenExpires,
} from '../../utils/DateTimeUtil';

describe('DateTimeUtil のテスト', () => {
  afterEach(() => {
    // Dateのモックを元に戻す
    jest.useRealTimers();
  });

  describe('toDateTimeString のテスト', () => {
    test('想定した日時文字列が返ること', () => {
      // 準備
      const dateString = '1682870523'; // 2023-05-01 01:02:03;
      const expected = '2023/5/1 01:02';

      // 実行
      const actual = toDateTimeString(dateString);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('validateTokenExpires のテスト', () => {
    test('アクセストークンが期限切れの場合はエラーがスローされること', () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const accessTokenExpires = 1682870522; // 2023-05-01 01:02:02

      // 実行
      expect(() => {
        validateTokenExpires(accessTokenExpires);
      }).toThrow('token expired.');
    });

    test('アクセストークンが期限ちょうどの場合はエラーがスローされること', () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const accessTokenExpires = 1682870523; // 2023-05-01 01:02:03

      // 実行
      expect(() => {
        validateTokenExpires(accessTokenExpires);
      }).toThrow('token expired.');
    });

    test('アクセストークンが期限内の場合はエラーがスローされないこと', () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const accessTokenExpires = 1682870524; // 2023-05-01 01:02:04

      // 実行
      expect(() => {
        validateTokenExpires(accessTokenExpires);
      }).not.toThrow();
    });
  });
});
