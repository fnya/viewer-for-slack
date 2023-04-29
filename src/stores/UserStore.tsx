import { ChannelEntity } from '@fnya/common-entity-for-slack/entity/response/entity/ChannelEntity';
import { create } from 'zustand';
import { MemberEntity } from '@fnya/common-entity-for-slack/entity/response/entity/MemberEntity';

/**
 * ユーザー情報の Store 設定
 */
export interface UserState {
  accessToken: string;
  accessTokenExpires: number;
  appName: string;
  channels: ChannelEntity[];
  countPerRequest: number;
  currentChannelId: string;
  initialized: boolean;
  isAdmin: boolean;
  members: MemberEntity[];
  refreshToken: string;
  refreshTokenExpires: number;
  showMessages: boolean;
  showReplies: boolean;
  userId: string;
  viewInitialized: boolean;
  webApiUrl: string;
  workSpaceName: string;
  setAccessToken: (accessToken: string) => void;
  setAccessTokenExpires: (accessTokenExpires: number) => void;
  setAppName: (name: string) => void;
  setChannels: (channles: ChannelEntity[]) => void;
  setCountPerRequest: (countPerRequest: number) => void;
  setCurrentChannelId: (currentChannelId: string) => void;
  setInitialized: (initialized: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setMembers: (members: MemberEntity[]) => void;
  setRefreshToken: (refreshToken: string) => void;
  setRefreshTokenExpires: (refreshTokenExpires: number) => void;
  setShowMessages: (showMessages: boolean) => void;
  setShowReplies: (showReplies: boolean) => void;
  setUserId: (userId: string) => void;
  setViewInitialized: (initialized: boolean) => void;
  setWebApiUrl: (webApiUrl: string) => void;
  setWorkSpaceName: (workSpaceName: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: '',
  accessTokenExpires: 0,
  appName: '',
  channels: [],
  countPerRequest: 0,
  currentChannelId: '',
  initialized: false,
  isAdmin: false,
  members: [],
  refreshToken: '',
  refreshTokenExpires: 0,
  showMessages: false,
  showReplies: false,
  userId: '',
  viewInitialized: false,
  webApiUrl: '',
  workSpaceName: '',
  setAccessToken: (accessToken: string) =>
    set((state) => ({ ...state, accessToken })),
  setAccessTokenExpires: (accessTokenExpires: number) =>
    set((state) => ({ ...state, accessTokenExpires })),
  setAppName: (appName: string) => set((state) => ({ ...state, appName })),
  setChannels: (channles: ChannelEntity[]) =>
    set((state) => ({ ...state, channles })),
  setCountPerRequest: (countPerRequest: number) =>
    set((state) => ({ ...state, countPerRequest })),
  setCurrentChannelId: (currentChannelId: string) =>
    set((state) => ({ ...state, currentChannelId })),
  setInitialized: (initialized: boolean) =>
    set((state) => ({ ...state, initialized })),
  setIsAdmin: (isAdmin: boolean) => set((state) => ({ ...state, isAdmin })),
  setMembers: (members: MemberEntity[]) =>
    set((state) => ({ ...state, members })),
  setRefreshToken: (refreshToken: string) =>
    set((state) => ({ ...state, refreshToken })),
  setRefreshTokenExpires: (refreshTokenExpires: number) =>
    set((state) => ({ ...state, refreshTokenExpires })),
  setShowMessages: (showMessages: boolean) =>
    set((state) => ({ ...state, showMessages })),
  setShowReplies: (showReplies: boolean) =>
    set((state) => ({ ...state, showReplies })),
  setUserId: (userId: string) => set((state) => ({ ...state, userId })),
  setViewInitialized: (initialized: boolean) =>
    set((state) => ({ ...state, viewInitialized: initialized })),
  setWebApiUrl: (webApiUrl: string) =>
    set((state) => ({ ...state, webApiUrl })),
  setWorkSpaceName: (workSpaceName: string) =>
    set((state) => ({ ...state, workSpaceName })),
}));
