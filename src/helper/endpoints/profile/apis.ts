import {
	createDELETEWithParams,
	createGET,
	createGETWithParams,
	createPOST,
	createPOSTWithParams,
	createPUT,
	createPUTWithParams,
} from "@helper/RequesterBase";
import { IdParams } from "@usertypes/params";
import {
	IBundle,
	ICampaign,
	IHighlight,
	IPlayList,
	IProfile,
	IProfileSettings,
	ISubscription,
	ISubscriptionTier,
} from "@usertypes/types";
import {
	AgeVerifyOndatoRespBody,
	BundleReqBody,
	CampaignReqBody,
	CreateProfileReportReqBody,
	CreateSubscriptionReqBody,
	CreatorProfileRespBody,
	GetBlockedUsersRespBody,
	GetProfilesRespBody,
	HighlightReqBody,
	HighlightRespBody,
	LocationsRespBody,
	MigrationReqBody,
	PlaylistDetailRespBody,
	PlaylistReqBody,
	PlaylistRespBody,
	PopupStatusRespBody,
	ProfileAvatarReqBody,
	ProfileLinkParams,
	ProfilePreviewReqBody,
	ProfileReqBody,
	ProfilesRespBody,
	SearchUsersToBlockRespBody,
	SocialLinksRespBody,
	SuggestedProfilesRespBody,
	TierReqBody,
	TransactionRespBody,
	UpdateProfilePreviewRespBody,
	UpdateSocialLinksReqBody,
} from "./schemas";

export const createProfile = createPOST<ProfileReqBody, never>(
	"/profiles",
	true,
);

export const createProfileAndGetId = createPOST<ProfileReqBody, IdParams>(
	"/profiles",
	true,
);

export const getProfile = createGET<IProfile>("/profiles/me", true);

export const getProfileById = createGETWithParams<IProfile, IdParams>(
	"/profiles/creator/:id",
	true,
);

export const updateMyProfile = createPUT<ProfileReqBody, never>(
	"/profiles/me",
	true,
);

export const updateProfileAvatar = createPUT<ProfileAvatarReqBody, never>(
	"/profiles/me/avatar",
	true,
);

export const updateSocialLinks = createPOST<
	UpdateSocialLinksReqBody,
	SocialLinksRespBody
>("/profiles/social-link", true);
export const updateProfilePreview = createPUT<
	ProfilePreviewReqBody,
	UpdateProfilePreviewRespBody
>("/profiles/me/preview", true);

// subscriptions
export const createSubscription = createPOST<
	CreateSubscriptionReqBody,
	ISubscription
>("/profile/subscriptions", true);
export const updateSubscriptionById = createPUTWithParams<
	CreateSubscriptionReqBody,
	never,
	IdParams
>("/profile/subscriptions/:id", true);
export const getSubscriptions = createGET<never>(
	"/profile/subscriptions",
	true,
);

// bundle apis
export const createBundle = createPOST<BundleReqBody, never>(
	"/profile/subscription/bundles",
	true,
);
export const updateBundle = createPUTWithParams<BundleReqBody, never, IdParams>(
	"/profile/subscription/bundles/:id",
	true,
);
export const deleteBundle = createDELETEWithParams<
	BundleReqBody,
	never,
	IdParams
>("/profile/subscription/bundles/:id", true);

export const activeBundleById = createPOSTWithParams<null, IBundle, IdParams>(
	"/profile/subscription/bundles/active/:id",
	true,
);
export const deleteBundleById = createDELETEWithParams<null, IBundle, IdParams>(
	"/profile/subscription/bundles/active/:id",
	true,
);
// campaign apis
export const createCampaign = createPOST<CampaignReqBody, ICampaign>(
	"/profile/subscription/campaigns",
	true,
);
export const updateCampaign = createPUTWithParams<
	CampaignReqBody,
	never,
	IdParams
>("/profile/subscription/campaigns/:id", true);
export const deleteCampaign = createDELETEWithParams<
	CampaignReqBody,
	never,
	IdParams
>("/profile/subscription/campaigns/:id", true);

// tiers apis
export const createTier = createPOST<TierReqBody, ISubscriptionTier>(
	"/profile/tiers",
	true,
);
export const updateTier = createPUTWithParams<TierReqBody, never, IdParams>(
	"/profile/tiers/:id",
	true,
);
export const deleteTier = createDELETEWithParams<IdParams, never, IdParams>(
	"/profile/tiers/:id",
	true,
);

// migration
export const createMigration = createPOST<MigrationReqBody, never>(
	"/profiles/migration",
	true,
);

// playlists
export const getPlaylists = createGET<PlaylistRespBody>("/playlists", true);
export const getPlaylistById = createGETWithParams<
	PlaylistDetailRespBody,
	IdParams
>("/playlists/:id", true);
export const createPlaylist = createPOST<PlaylistReqBody, IPlayList>(
	"/playlists",
	true,
);
export const updatePlaylist = createPUTWithParams<
	PlaylistReqBody,
	never,
	IdParams
>("/playlists/:id", true);
export const deletePlaylist = createDELETEWithParams<IdParams, never, IdParams>(
	"/playlists/:id",
	true,
);

export const getSuggestedProfiles = createGET<SuggestedProfilesRespBody>(
	"/profiles/suggest",
	true,
);

// creator profile
export const getCreatorProfileByLink = createGETWithParams<
	CreatorProfileRespBody,
	ProfileLinkParams
>("/profiles/link/:profileLink", true);

// highlights
export const getHighlightById = createGETWithParams<IHighlight, IdParams>(
	"/profile/highlights/:id",
	true,
);
export const createHighlight = createPOST<HighlightReqBody, HighlightRespBody>(
	"/profile/highlights",
	true,
);
export const getHighlights = createGET<never>("/profile/highlights", true);
export const deleteHighlight = createDELETEWithParams<
	IdParams,
	never,
	IdParams
>("/profile/highlights/:id", true);
export const updateHighlight = createPUTWithParams<
	HighlightReqBody,
	never,
	IdParams
>("/profile/highlights/:id", true);

export const getProfiles = createGET<GetProfilesRespBody>("/profiles", true);

export const createProfileReport = createPOST<
	CreateProfileReportReqBody,
	never
>("/profile/report", true);

export const getLocations = createGET<LocationsRespBody>(
	"/profile/locations",
	true,
);

export const getUserTransactions = createGET<TransactionRespBody>(
	"/profile/payments/user-transactions",
	true,
);

export const blockProfile = createPOSTWithParams<unknown, unknown, IdParams>(
	"/profiles/block/:id",
	true,
);

export const getUserSettings = createGET<IProfileSettings>(
	"/settings/user-settings/",
	true,
);
interface VideoSettings {
	video: IProfileSettings["video"];
}

interface CameoSettings {
	cameo: IProfileSettings["cameo"];
}

interface FanProfileSettings {
	fanProfile: IProfileSettings["fanProfile"];
}

export const updateVideoSettings = createPUT<VideoSettings, IProfileSettings>(
	"/settings/user-settings/video",
	true,
);

export const createVideoSettings = createPOST<
	IProfileSettings,
	IProfileSettings
>("/settings/user-settings/video", true);

export const createAgeVerifyOndato = createPOST<
	unknown,
	AgeVerifyOndatoRespBody
>("/profiles/age-verify/ondato", true);

export const updateFanProfileSettings = createPUT<
	FanProfileSettings,
	IProfileSettings
>("/settings/user-settings/fanProfile", true);

export const createCameoSettings = createPOST<
	IProfileSettings,
	IProfileSettings
>("/settings/user-settings/cameo", true);

export const popupStatus = createGET<PopupStatusRespBody>(
	"/profile/payments/popup-status",
	true,
);

export const searchCreators = createGET<ProfilesRespBody>(
	"/profiles/search",
	true,
);

export const getBlockedUsers = createGET<GetBlockedUsersRespBody>(
	"/profile/block-user",
	true,
);

export const blockUser = createPOSTWithParams<unknown, unknown, IdParams>(
	"/profile/block-user/:id",
	true,
);

export const unblockUser = createDELETEWithParams<unknown, unknown, IdParams>(
	"/profile/block-user/:id",
	true,
);

export const searchUsersToBlock = createGET<SearchUsersToBlockRespBody>(
	"/profile/block-user/search-user",
	true,
);
