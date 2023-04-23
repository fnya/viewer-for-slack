import { invoke } from '@tauri-apps/api/tauri';

/**
 * クレデンシャルを保存する
 *
 * @param userId ユーザー ID
 * @param refreshToken リフレッシュトークン
 * @param refreshTokenExpires リフレッシュトークンの有効期限
 * @param initialized 初期化済みかどうか(true: 初期化済み, false: 未初期化)
 * @param isAdmin 管理者かどうか(true: 管理者, false: 管理者でない)
 * @param serviceName サービス名
 */
export const saveCredentials = async (
  userId: string,
  refreshToken: string,
  refreshTokenExpires: number,
  initialized: boolean,
  isAdmin: boolean,
  serviceName: string
): Promise<void> => {
  await invoke('save_credentials', {
    userId,
    refreshToken,
    refreshTokenExpires,
    initialized,
    isAdmin,
    serviceName,
  });
};

/**
 * クレデンシャルを読み込む
 *
 * @param serviceName サービス名
 * @returns クレデンシャル
 */
export const loadCredentials = async (serviceName: string) => {
  return await invoke('load_credentials', { serviceName });
};
