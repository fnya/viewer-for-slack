import { AppConfig } from '../types/AppConfig';
import { invoke } from '@tauri-apps/api/tauri';

/**
 * アプリの設定を読み込む
 */
export const loadApp = async (): Promise<AppConfig> => {
  // App config の読み込み
  return await invoke('load_app_config');
};
