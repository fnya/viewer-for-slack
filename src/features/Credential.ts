import { invoke } from '@tauri-apps/api/tauri';

/**
 * クレデンシャルを保存する
 *
 * @param userId ユーザー ID
 * @param refreshToken リフレッシュトークン
 * @param refreshTokenExpires リフレッシュトークンの有効期限
 * @param userInitialized ユーザーが初期化済みかどうか(true: 初期化済み, false: 未初期化)
 * @param isAdmin 管理者かどうか(true: 管理者, false: 管理者でない)
 * @param appName アプリ名
 * @param webApiUrl Web API の URL
 * @param countPerRequest 1 リクエストあたりの取得件数
 * @param workSpaceName ワークスペース名
 * @returns 処理結果(ok: 成功, error: 失敗)
 */
export const saveCredentials = async (
  userId: string,
  refreshToken: string,
  refreshTokenExpires: number,
  userInitialized: boolean,
  isAdmin: boolean,
  appName: String,
  webApiUrl: String,
  countPerRequest: number,
  workSpaceName: String
): Promise<any> => {
  return await invoke('save_credentials', {
    userId,
    refreshToken,
    refreshTokenExpires,
    userInitialized,
    isAdmin,
    appName,
    webApiUrl,
    countPerRequest,
    workSpaceName,
  });
};

/**
 * クレデンシャルを読み込む
 *
 * @returns クレデンシャル
 */
export const loadCredentials = async () => {
  return await invoke('load_credentials');
};
