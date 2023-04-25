import { mockIPC, clearMocks } from '@tauri-apps/api/mocks';
import {
  describe,
  test,
  afterEach,
  beforeEach,
  expect,
  jest,
} from '@jest/globals';
import { loadApp } from '../../features/Load';

describe('Load のテスト', () => {
  describe('loadApp のテスト', () => {
    afterEach(() => {
      clearMocks();
    });

    test('正常に処理が終了すること', async () => {
      // 準備
      const expected = {
        name: 'Viewer for Slack',
        url: 'https://example.com',
        countPerRequest: 100,
        workSpaceName: 'workspace',
      };
      mockIPC((cmd, args) => {
        if (cmd === 'load_app_config') {
          return Promise.resolve(expected);
        }
      });

      // 実行
      const actual = await loadApp();

      // 検証
      expect(actual).toEqual(expected);
    });
  });
});
