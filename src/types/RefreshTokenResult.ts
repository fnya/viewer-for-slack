import { RefreshResponse } from '@fnya/common-entity-for-slack/entity/response/RefreshResponse';

/**
 * アクセストークンのリフレッシュ結果
 */
export type RefreshTokenResult = {
  /**
   * ログインに遷移するかどうか(true: 遷移する, false: 遷移しない)
   */
  shouldMoveToLogin?: boolean;

  /**
   * アクセストークン更新済みフラグ(true: 更新済み, false: 未更新)
   */
  refreshed?: boolean;

  /**
   * 更新後のアクセストークン
   */
  refreshResponse?: RefreshResponse;
};
