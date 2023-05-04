import { describe, test, afterEach, expect, jest } from '@jest/globals';
import { mockIPC, clearMocks } from '@tauri-apps/api/mocks';
import { saveCredentials, loadCredentials } from '../../features/Credential';

describe('Load のテスト', () => {
  afterEach(() => {
    clearMocks();
  });

  describe('saveCredentials のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const userId = '0000000000';
      const refreshToken = 'refreshToken';
      const refreshTokenExpires = 1;
      const initialized = true;
      const isAdmin = false;
      const appName = 'Viewer for Slack';
      const webApiUrl = 'https://example.com';
      const countPerRequest = 10;
      const workspaceName = 'workspaceName';

      mockIPC((cmd, args) => {
        if (cmd === 'save_credentials') {
          return Promise.resolve();
        }
      });
      const spy = jest.spyOn(window, '__TAURI_IPC__');

      // 実行
      await saveCredentials(
        userId,
        refreshToken,
        refreshTokenExpires,
        initialized,
        isAdmin,
        appName,
        webApiUrl,
        countPerRequest,
        workspaceName
      );

      // 検証
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('loadCredentials のテスト', () => {
    test('正常に処理が終了すること', async () => {
      // 準備
      const expected = {
        userId: '0000000000',
        refreshToken: 'refreshToken',
        refreshTokenExpires: 1,
        initialized: true,
        isAdmin: false,
        serviceName: 'serviceName',
      };

      mockIPC((cmd, args) => {
        if (cmd === 'load_credentials') {
          return Promise.resolve(expected);
        }
      });

      // 実行
      const actual = await loadCredentials();

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
