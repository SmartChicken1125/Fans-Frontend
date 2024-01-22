import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IProfile } from "./types";

export type ChatNativeStackParams = {
	Camera: undefined;
	Chat: { id: string } | undefined;
	FanAnalysis: undefined;
	Gallery: undefined;
	Messages: undefined;
	MessageSelect: undefined;
	NewMessage: undefined;
	PinnedMessages: undefined;
	SendMessage: undefined;
	ShareNote: undefined;
	Notes: undefined;
};
export type ChatNativeStackScreens = keyof ChatNativeStackParams;
export type ChatNativeStackScreenProps<T extends ChatNativeStackScreens> =
	NativeStackScreenProps<ChatNativeStackParams, T>;

export type SettingsNativeStackParams = {
	Settings: undefined;
	ChatRoom: undefined;
};
export type SettingsNativeStackScreens = keyof SettingsNativeStackParams;
export type SettingsNativeStackScreenProps<
	T extends SettingsNativeStackScreens,
> = NativeStackScreenProps<SettingsNativeStackParams, T>;

export type SettingsAccountNativeStackParams = {
	Account: undefined;
	ChangePassword: undefined;
	DisplayName: undefined;
	Email: undefined;
	Phone: undefined;
	Username: undefined;
	VerifyEmail: { email: string };
};
export type SettingsAccountNativeStackScreens =
	keyof SettingsAccountNativeStackParams;
export type SettingsAccountNativeStackScreenProps<
	T extends SettingsAccountNativeStackScreens,
> = NativeStackScreenProps<SettingsAccountNativeStackParams, T>;

export type SettingsFanProfileSetupNativeStackParams = {
	FanProfileSetup: undefined;
};
export type SettingsFanProfileSetupNativeStackScreens =
	keyof SettingsFanProfileSetupNativeStackParams;
export type SettingsFanProfileSetupNativeStackScreenProps<
	T extends SettingsFanProfileSetupNativeStackScreens,
> = NativeStackScreenProps<SettingsFanProfileSetupNativeStackParams, T>;

export type SettingsPaymentsStackParams = {
	AddPaymentMethod:
		| {
				id?: string;
				customerPaymentProfileId?: string;
		  }
		| undefined;
	Payments: { refresh?: boolean } | undefined;
};
export type SettingsPaymentsStackScreenProps<
	T extends keyof SettingsPaymentsStackParams,
> = NativeStackScreenProps<SettingsPaymentsStackParams, T>;

export type SettingsAnalyticsNativeStackParams = {
	Analytics: undefined;
};
export type SettingsAnalyticsNativeStackScreens =
	keyof SettingsNativeStackParams;
export type SettingsAnalyticsNativeStackScreenProps<
	T extends SettingsNativeStackScreens,
> = NativeStackScreenProps<SettingsNativeStackParams, T>;

export type SettingsReferCreatorsNativeStackParams = {
	ReferralProgram: { isSetting: boolean } | undefined;
	ReferCreators: undefined;
	ReferAndEarn: { profile?: IProfile } | undefined;
	ReferralAnalytics: undefined;
	ReferralPayments: undefined;
	ReferralPayoutSetup: undefined;
	AddPaymentMethod: undefined;
	GetPaid: { isGreen?: boolean; refresh?: boolean } | undefined;
};
export type SettingsReferCreatorsNativeStackScreens =
	keyof SettingsReferCreatorsNativeStackParams;
export type SettingsReferCreatorsNativeStackScreenProps<
	T extends SettingsReferCreatorsNativeStackScreens,
> = NativeStackScreenProps<SettingsReferCreatorsNativeStackParams, T>;

export type SettingsNotificationsNativeStackParams = {
	Notifications: undefined;
};
export type SettingsNotificationsNativeStackScreens =
	keyof SettingsNotificationsNativeStackParams;
export type SettingsNotificationsNativeStackScreenProps<
	T extends SettingsNotificationsNativeStackScreens,
> = NativeStackScreenProps<SettingsNotificationsNativeStackParams, T>;

export type SettingsVideoCallSetupNativeStackParams = {
	VideoCallSetupTOS: undefined;
	VideoCallSetup: undefined;
	EditVideoCallSetup: undefined;
};
export type SettingsVideoCallSetupNativeStackScreens =
	keyof SettingsVideoCallSetupNativeStackParams;
export type SettingsVideoCallSetupNativeStackScreenProps<
	T extends SettingsVideoCallSetupNativeStackScreens,
> = NativeStackScreenProps<SettingsVideoCallSetupNativeStackParams, T>;

export type SettingsCameoSetupNativeStackParams = {
	CameoSetup: undefined;
};
export type SettingsCameoSetupNativeStackScreens =
	keyof SettingsCameoSetupNativeStackParams;
export type SettingsCameoSetupNativeStackScreenProps<
	T extends SettingsCameoSetupNativeStackScreens,
> = NativeStackScreenProps<SettingsCameoSetupNativeStackParams, T>;

export type SettingsConnectionsNativeStackParams = {
	Connections: undefined;
};
export type SettingsConnectionsNativeStackScreens =
	keyof SettingsConnectionsNativeStackParams;
export type SettingsConnectionsNativeStackScreenProps<
	T extends SettingsConnectionsNativeStackScreens,
> = NativeStackScreenProps<SettingsConnectionsNativeStackParams, T>;

export type SettingsSubscriptionsNativeStackParams = {
	Subscriptions: {
		screen?: string;
		returnPopup?: string | string[];
		subscriptionId?: string | string[];
	};
};
export type SettingsSubscriptionsNativeStackScreens =
	keyof SettingsSubscriptionsNativeStackParams;
export type SettingsSubscriptionsNativeStackScreenProps<
	T extends SettingsSubscriptionsNativeStackScreens,
> = NativeStackScreenProps<SettingsSubscriptionsNativeStackParams, T>;

export type SettingsAutomatedChatsNativeStackParams = {
	AutomatedChats: undefined;
	MessageImage: { type: "Welcome" | "Custom" };
	MessageCreate: { type: "Welcome" | "Custom" };
};
export type SettingsAutomatedChatsNativeStackScreens =
	keyof SettingsAutomatedChatsNativeStackParams;
export type SettingsAutomatedChatsNativeStackScreenProps<
	T extends SettingsAutomatedChatsNativeStackScreens,
> = NativeStackScreenProps<SettingsAutomatedChatsNativeStackParams, T>;

export type SettingsScheduledPostsNativeStackParams = {
	ScheduledPosts: undefined;
};
export type SettingsScheduledPostsNativeStackScreens =
	keyof SettingsScheduledPostsNativeStackParams;
export type SettingsScheduledPostsNativeStackScreenProps<
	T extends SettingsScheduledPostsNativeStackScreens,
> = NativeStackScreenProps<SettingsScheduledPostsNativeStackParams, T>;

export type SettingsReportAbuseNativeStackParams = {
	REPORTABUSE: undefined;
};
export type SettingsReportAbuseNativeStackScreens =
	keyof SettingsReportAbuseNativeStackParams;
export type SettingsReportAbuseNativeStackScreenProps<
	T extends SettingsReportAbuseNativeStackScreens,
> = NativeStackScreenProps<SettingsReportAbuseNativeStackParams, T>;

export type TabNavigationStacks = {};

export type MainNavigationStacks = {
	chat: undefined;
};

export type NotificationsNavigationStacks = {
	Notifications: undefined;
};

export type TermsNavigationStacks = {
	Terms: undefined;
	Sanction: undefined;
	Benefits: undefined;
	Community: undefined;
	Security: undefined;
	Cookies: undefined;
	DataAgreement: undefined;
	Fees: undefined;
	Returns: undefined;
};

export type ProfileNavigationStacks = {
	Profile: undefined;
	ProfileName: undefined;
	ProfileStyle: undefined;
	ReferralProgram: { isSetting: boolean } | undefined;
	ReferCreators: undefined;
	ReferAndEarn: { profile?: IProfile } | undefined;
	Edit: undefined;
	SocialLinks: undefined;
	Cover: undefined;
	Levels: undefined;
	GetPaid: { isGreen?: boolean; refresh?: boolean } | undefined;
	PayoutSetup: { id: string | null; isGreen?: boolean } | undefined;
	Preview: undefined;
	Subscription: undefined;
	Bundle: { id: string | null; price: number };
	PromotionCampaign: { id: string | null };
	Tier: { id: string | null };
	Playlist: { id: string | null };
	Highlights: undefined;
	HighlightStories: undefined;
	HighlightCover: undefined;
	Categories: undefined;
	NewCategory: undefined;
	EditCategory: { id: string | null };
	AddPostsCategory: undefined;
	AddPosts: { selectedPostIds: string[] };
	ArchivedPosts: undefined;
	AddCard: {
		screen?: string;
		returnPopup?: string | string[];
		subscriptionId?: string | string[];
	};
	Role: { id: string | null };
	Badge: undefined;
	TrackingLinks: undefined;
	AgeVerifyForm: undefined;
	AgeVerifyFailed: undefined;
	AgeVerifyPending: undefined;
	Purchases: undefined;
};

export type CreatorProfileNavigationStacks = {
	Creator: undefined;
	Preview: undefined;
	Post: { id: string };
	OrderVideoCallScreen: { username: string };
	ReferAndEarn: { profile?: IProfile } | undefined;
};

export type PrivacyPolicyNavigationStacks = {
	Privacy: undefined;
};

export type PostsNavigationStacks = {
	Home: undefined;
	Fundraiser: undefined;
	Poll: undefined;
	Text: undefined;
	Thumbnail: undefined;
	Caption: undefined;
	AudioDetail: undefined;
	ViewSetting: undefined;
	Role: { id: string | null };
	FansLevels: undefined;
	Categories: undefined;
	NewCategory: undefined;
	PaidPost: undefined;
	PaidPostAccess: undefined;
	TagPeople: undefined;
	TagPeopleSearch: undefined;
	Invite: undefined;
	Giveaway: undefined;
	Location: undefined;
	Schedule: undefined;
	AdvancedSettings: undefined;
	Chatroom: undefined;
	OrderVideoCallScreen: undefined;
	Vault: undefined;
	NewTier: undefined;
};

export type StoriesNavigationStacks = {
	Highlight: { highlightId: string; userId: string };
	Creator: { userId: string };
	Profile: { userId: string };
};

export type PlaylistNavigationStacks = {
	Detail: { id: string };
};

export type PostDetailNavigationStacks = {
	Detail: { id: string };
};

export type PrivacyNativeStackParams = {
	Privacy: undefined;
};
export type PrivacyNativeStackScreens = keyof PrivacyNativeStackParams;
export type PrivacyNativeStackScreenProps<T extends PrivacyNativeStackScreens> =
	NativeStackScreenProps<PrivacyNativeStackParams, T>;

export type DeveloperNativeStackParams = {
	DeveloperPortal: undefined;
	Applications: undefined;
	GettingStarted: undefined;
};
export type DeveloperNativeStackScreens = keyof DeveloperNativeStackParams;
export type DeveloperNativeStackScreenProps<
	T extends DeveloperNativeStackScreens,
> = NativeStackScreenProps<DeveloperNativeStackParams, T>;

export type DeveloperApplicationsNativeStackParams = {
	MyApplications: undefined;
	AppDetails?: { id: string };
};
export type DeveloperApplicationsNativeStackScreens =
	keyof DeveloperApplicationsNativeStackParams;
export type DeveloperApplicationsNativeStackScreenProps<
	T extends DeveloperApplicationsNativeStackScreens,
> = NativeStackScreenProps<DeveloperApplicationsNativeStackParams, T>;

export type SettingsReferralProgramNativeStackParams = {
	Referral: undefined;
	ReferAndEarn: undefined;
	FindReferralPrograms: undefined;
	ReferralsDashboard: undefined;
	JoinProgram: undefined;
	PayoutSetup: { id: string | null; isGreen?: boolean } | undefined;
	GetPaid: { isGreen?: boolean; refresh?: boolean } | undefined;
	ReferralAnalytics: undefined;
};

export type ReferralProgramNativeStackParams = {
	ReferCreators: undefined;
	ReferAndEarn: { profile?: IProfile } | undefined;
	PayoutSetup: { id: string | null; isGreen?: boolean } | undefined;
	GetPaid: { isGreen?: boolean; refresh?: boolean } | undefined;
	ReferralAnalytics: undefined;
	AddPaymentMethod:
		| {
				id?: string;
				customerPaymentProfileId?: string;
		  }
		| undefined;
	Payments: { refresh?: boolean } | undefined;
	ReferralPayoutSetup: undefined;
};

export type SupportNativeStackParams = {
	ContactUs: undefined;
	LawEnforcementGuide: undefined;
};
export type SupportNativeStackScreens = keyof SupportNativeStackParams;
export type SupportNativeStackScreenProps<T extends SupportNativeStackScreens> =
	NativeStackScreenProps<SupportNativeStackParams, T>;

export type VaultNavigationStacks = {
	Home: undefined;
};

export type VideoCallStackParams = {
	Creator: undefined;
	Fan: undefined;
};
