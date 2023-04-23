import { ChannelEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ChannelEntity';
import { create } from 'zustand';
import { MemberEntity } from '@fnya/common-entity-for-slack/entity/response/entity/MemberEntity';

/**
 * ユーザー情報の Store 設定
 */
export interface UserState {
  appName: string;
  webApiUrl: string;
  countPerRequest: number;
  workSpaceName: string;
  userId: string;
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
  initialized: boolean;
  isAdmin: boolean;
  currentChannelId: string;
  showMessages: boolean;
  showReplies: boolean;
  channles: ChannelEntity[];
  members: MemberEntity[];
  setAppName: (name: string) => void;
  setWebApiUrl: (webApiUrl: string) => void;
  setCountPerRequest: (countPerRequest: number) => void;
  setWorkSpaceName: (workSpaceName: string) => void;
  setUserId: (userId: string) => void;
  setAccessToken: (accessToken: string) => void;
  setAccessTokenExpires: (accessTokenExpires: number) => void;
  setRefreshToken: (refreshToken: string) => void;
  setRefreshTokenExpires: (refreshTokenExpires: number) => void;
  setInitialized: (initialized: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setCurrentChannelId: (currentChannelId: string) => void;
  setShowMessages: (showMessages: boolean) => void;
  setShowReplies: (showReplies: boolean) => void;
  setChannles: (channles: ChannelEntity[]) => void;
  setMembers: (members: MemberEntity[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  appName: '',
  webApiUrl: '',
  countPerRequest: 0,
  workSpaceName: '',
  userId: '',
  accessToken: '',
  accessTokenExpires: 0,
  refreshToken: '',
  refreshTokenExpires: 0,
  initialized: false,
  isAdmin: false,
  currentChannelId: '',
  showMessages: false,
  showReplies: false,
  channles: [],
  members: [],
  setAppName: (appName: string) => set((state) => ({ ...state, appName })),
  setWebApiUrl: (webApiUrl: string) =>
    set((state) => ({ ...state, webApiUrl })),
  setCountPerRequest: (countPerRequest: number) =>
    set((state) => ({ ...state, countPerRequest })),
  setWorkSpaceName: (workSpaceName: string) =>
    set((state) => ({ ...state, workSpaceName })),
  setUserId: (userId: string) => set((state) => ({ ...state, userId })),
  setAccessToken: (accessToken: string) =>
    set((state) => ({ ...state, accessToken })),
  setAccessTokenExpires: (accessTokenExpires: number) =>
    set((state) => ({ ...state, accessTokenExpires })),
  setRefreshToken: (refreshToken: string) =>
    set((state) => ({ ...state, refreshToken })),
  setRefreshTokenExpires: (refreshTokenExpires: number) =>
    set((state) => ({ ...state, refreshTokenExpires })),
  setInitialized: (initialized: boolean) =>
    set((state) => ({ ...state, initialized })),
  setIsAdmin: (isAdmin: boolean) => set((state) => ({ ...state, isAdmin })),
  setCurrentChannelId: (currentChannelId: string) =>
    set((state) => ({ ...state, currentChannelId })),
  setShowMessages: (showMessages: boolean) =>
    set((state) => ({ ...state, showMessages })),
  setShowReplies: (showReplies: boolean) =>
    set((state) => ({ ...state, showReplies })),
  setChannles: (channles: ChannelEntity[]) =>
    set((state) => ({ ...state, channles })),
  setMembers: (members: MemberEntity[]) =>
    set((state) => ({ ...state, members })),
}));
