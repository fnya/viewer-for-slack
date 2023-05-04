import { describe, test, expect, afterEach, jest } from '@jest/globals';
import {
  convertAccessTokenToPayloadClaim,
  valiateAccessToken,
  refreshAccessToken,
} from '../../utils/AuthUtil';
import { HttpStatus } from '@fnya/common-entity-for-slack/constant/HttpStatus';
import { HttpStatusCode } from '@fnya/common-entity-for-slack/constant/HttpStatusCode';
import { RefreshResponse } from '@fnya/common-entity-for-slack/entity/response/RefreshResponse';

jest.mock('../../utils/ApiUtil');
const post = require('../../utils/ApiUtil').post;

describe('AuthUtil のテスト', () => {
  describe('convertAccessTokenToPayloadClaim のテスト', () => {
    test('アクセストークンのペイロードが想定した値で取得できること', () => {
      // 準備
      const headerClaim = 'eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0K';
      const payloadClaim =
        'eyJzdWIiOiAiMTIzNDU2Nzg5MCIsIm5hbWUiOiAibmFtZSIsImlhdCI6IDE1MTYyMzkwMjJ9Cg==';
      const accessToken = `${headerClaim}.${payloadClaim}.signature`;
      const expected = { sub: '1234567890', name: 'name', iat: 1516239022 };

      // 実行
      const actual = convertAccessTokenToPayloadClaim(accessToken);

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  describe('valiateAccessToken のテスト', () => {
    afterEach(() => {
      // Dateのモックを元に戻す
      jest.useRealTimers();
    });

    test('アクセストークンに問題がない場合はエラーはスローされない', () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const headerClaim = 'eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0K';
      const payloadClaim =
        'eyJzdWIiOiAiMTIzNDU2Nzg5MCIsIm5hbWUiOiAibmFtZSIsImlzcyI6ICJpc3N1ZXIiLCJpYXQiOiAxNjgyODY2ODAwLCJleHAiOiAxNjgyOTUzMjYwfQo=';
      const accessToken = `${headerClaim}.${payloadClaim}.signature`;
      const decodedPayloadClaim = {
        sub: '1234567890',
        name: 'name',
        iss: 'issuer',
        iat: 1682866800, // 2023-05-01 00:00:00
        exp: 1682953260, // 2023-05-02 00:01:00
      };

      // 実行&検証
      expect(() => valiateAccessToken('issuer', accessToken)).not.toThrow();
    });

    test('アクセストークンの発行日時が未来の場合はエラーがスローされる', () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const headerClaim = 'eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0K';
      const payloadClaim =
        'eyJzdWIiOiAiMTIzNDU2Nzg5MCIsIm5hbWUiOiAibmFtZSIsImlzcyI6ICJpc3N1ZXIiLCJpYXQiOiAxNjgyOTUzMjAwLCJleHAiOiAxNjgyOTUzMjYwfQo=';
      const accessToken = `${headerClaim}.${payloadClaim}.signature`;
      const decodedPayloadClaim = {
        sub: '1234567890',
        name: 'name',
        iss: 'issuer',
        iat: 1682953200, // 2023-05-02 00:00:00
        exp: 1682953260, // 2023-05-02 00:01:00
      };

      // 実行&検証
      expect(() => valiateAccessToken('issuer', accessToken)).toThrow(
        'Token has invalid issued time'
      );
    });

    test('アクセストークンが期限切れの場合はエラーがスローされる', () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const headerClaim = 'eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0K';
      const payloadClaim =
        'eyJzdWIiOiAiMTIzNDU2Nzg5MCIsIm5hbWUiOiAibmFtZSIsImlzcyI6ICJpc3N1ZXIiLCJpYXQiOiAxNjgyODY2ODAwLCJleHAiOiAxNjgyODY2ODYwfQo=';
      const accessToken = `${headerClaim}.${payloadClaim}.signature`;
      const decodedPayloadClaim = {
        sub: '1234567890',
        name: 'name',
        iss: 'issuer',
        iat: 1682866800, // 2023-05-01 00:00:00
        exp: 1682866860, // 2023-05-02 00:01:00
      };

      // 実行&検証
      expect(() => valiateAccessToken('issuer', accessToken)).toThrow(
        'Token has expired'
      );
    });

    test('アクセストークンの発行者が異なる場合はエラーがスローされる', () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const headerClaim = 'eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0K';
      const payloadClaim =
        'eyJzdWIiOiAiMTIzNDU2Nzg5MCIsIm5hbWUiOiAibmFtZSIsImlzcyI6ICJpc3N1ZXIiLCJpYXQiOiAxNjgyODY2ODAwLCJleHAiOiAxNjgyOTUzMjYwfQo=';
      const accessToken = `${headerClaim}.${payloadClaim}.signature`;
      const decodedPayloadClaim = {
        sub: '1234567890',
        name: 'name',
        iss: 'issuer',
        iat: 1682866800, // 2023-05-01 00:00:00
        exp: 1682953260, // 2023-05-02 00:01:00
      };

      // 実行&検証
      expect(() => valiateAccessToken('issuer-error', accessToken)).toThrow(
        'Token was not issued by expected issuer'
      );
    });
  });

  describe('refreshAccessToken のテスト', () => {
    test('アクセストークンが期限内の場合はリフレッシュされない', async () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const webApiUrl = 'https://exapmle.com';
      const userId = '1234567890';
      const accessTokenExpires = 1682956923; // 2023-05-02 01:02:03
      const refreshToken = 'refreshToken';
      const refreshTokenExpires = 1682956923; // 2023-05-02 01:02:03
      const issuer = 'issuer';
      const expected = {
        refreshed: false,
      };

      // 実行
      const actual = await refreshAccessToken(
        webApiUrl,
        userId,
        accessTokenExpires,
        refreshToken,
        refreshTokenExpires,
        issuer
      );

      // 検証
      expect(actual).toEqual(expected);
    });

    test('アクセストークンとリフレッシュトークンが期限切れの場合はログイン画面に遷移する', async () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const webApiUrl = 'https://exapmle.com';
      const userId = '1234567890';
      const accessTokenExpires = 1682866800; // 2023-05-01 00:00:00
      const refreshToken = 'refreshToken';
      const refreshTokenExpires = 1682866800; // 2023-05-01 00:00:00
      const issuer = 'issuer';
      const expected = {
        shouldMoveToLogin: true,
      };

      // 実行
      const actual = await refreshAccessToken(
        webApiUrl,
        userId,
        accessTokenExpires,
        refreshToken,
        refreshTokenExpires,
        issuer
      );

      // 検証
      expect(actual).toEqual(expected);
    });

    test('アクセストークンが期限切れでリフレッシュトークンが期限内の場合はリフレッシュする', async () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const webApiUrl = 'https://exapmle.com';
      const userId = '1234567890';
      const accessTokenExpires = 1682866800; // 2023-05-01 00:00:00
      const refreshToken = 'refreshToken';
      const refreshTokenExpires = 1682956923; // 2023-05-02 01:02:03
      const newAccessTokenExpires = 1682953200; // 2023-05-02 00:00:00
      const issuer = 'issuer';

      const headerClaim = 'eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0K';
      const payloadClaim =
        'eyJzdWIiOiAiMTIzNDU2Nzg5MCIsIm5hbWUiOiAibmFtZSIsImlzcyI6ICJpc3N1ZXIiLCJpYXQiOiAxNjgyODY2ODAwLCJleHAiOiAxNjgyOTUzMjYwfQo=';
      const accessToken = `${headerClaim}.${payloadClaim}.signature`;
      const decodedPayloadClaim = {
        sub: '1234567890',
        name: 'name',
        iss: 'issuer',
        iat: 1682866800, // 2023-05-01 00:00:00
        exp: 1682953260, // 2023-05-02 00:01:00
      };

      const refreshResponse = new RefreshResponse(
        HttpStatus.OK,
        HttpStatusCode.OK,
        accessToken,
        newAccessTokenExpires
      );

      post.mockResolvedValue(refreshResponse);

      const expected = {
        refreshed: true,
        refreshResponse,
      };

      // 実行
      const actual = await refreshAccessToken(
        webApiUrl,
        userId,
        accessTokenExpires,
        refreshToken,
        refreshTokenExpires,
        issuer
      );

      // 検証
      expect(actual).toEqual(expected);
    });

    test('リフレッシュ後のアクセストークンの発行者が異なる場合はログイン画面に遷移する', async () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const webApiUrl = 'https://exapmle.com';
      const userId = '1234567890';
      const accessTokenExpires = 1682866800; // 2023-05-01 00:00:00
      const refreshToken = 'refreshToken';
      const refreshTokenExpires = 1682956923; // 2023-05-02 01:02:03
      const newAccessTokenExpires = 1682953200; // 2023-05-02 00:00:00
      const issuer = 'issuer-dummy';

      const headerClaim = 'eyJhbGciOiAiSFMyNTYiLCJ0eXAiOiAiSldUIn0K';
      const payloadClaim =
        'eyJzdWIiOiAiMTIzNDU2Nzg5MCIsIm5hbWUiOiAibmFtZSIsImlzcyI6ICJpc3N1ZXIiLCJpYXQiOiAxNjgyODY2ODAwLCJleHAiOiAxNjgyOTUzMjYwfQo=';
      const accessToken = `${headerClaim}.${payloadClaim}.signature`;
      const decodedPayloadClaim = {
        sub: '1234567890',
        name: 'name',
        iss: 'issuer',
        iat: 1682866800, // 2023-05-01 00:00:00
        exp: 1682953260, // 2023-05-02 00:01:00
      };

      const refreshResponse = new RefreshResponse(
        HttpStatus.OK,
        HttpStatusCode.OK,
        accessToken,
        newAccessTokenExpires
      );

      post.mockResolvedValue(refreshResponse);

      const expected = { shouldMoveToLogin: true };

      // 実行
      const actual = await refreshAccessToken(
        webApiUrl,
        userId,
        accessTokenExpires,
        refreshToken,
        refreshTokenExpires,
        issuer
      );

      // 検証
      expect(actual).toEqual(expected);
    });

    test('リフレッシュの処理に失敗sた場合はログイン画面に遷移する', async () => {
      // 準備
      const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const webApiUrl = 'https://exapmle.com';
      const userId = '1234567890';
      const accessTokenExpires = 1682866800; // 2023-05-01 00:00:00
      const refreshToken = 'refreshToken';
      const refreshTokenExpires = 1682956923; // 2023-05-02 01:02:03
      const issuer = 'issuer';

      post.mockResolvedValue(new Error());

      const expected = { shouldMoveToLogin: true };
      // 実行
      const actual = await refreshAccessToken(
        webApiUrl,
        userId,
        accessTokenExpires,
        refreshToken,
        refreshTokenExpires,
        issuer
      );

      // 検証
      expect(actual).toEqual(expected);
    });
  });

  test('リフレッシュ処理のレスポンスが正常終了ではない場合はログイン画面に遷移する', async () => {
    // 準備
    const mockDate = new Date(2023, 4, 1, 1, 2, 3); // 2023-05-01 01:02:03
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const webApiUrl = 'https://exapmle.com';
    const userId = '1234567890';
    const accessTokenExpires = 1682866800; // 2023-05-01 00:00:00
    const refreshToken = 'refreshToken';
    const refreshTokenExpires = 1682956923; // 2023-05-02 01:02:03
    const issuer = 'issuer';

    const refreshResponse = {
      httpStatus: HttpStatus.FORBIDDEN,
      httpStatusCode: HttpStatusCode.FORBIDDEN,
    };

    post.mockResolvedValue(refreshResponse);

    const expected = { shouldMoveToLogin: true };

    // 実行
    const actual = await refreshAccessToken(
      webApiUrl,
      userId,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
      issuer
    );

    // 検証
    expect(actual).toEqual(expected);
  });
});
