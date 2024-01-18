import {
	createDELETE,
	createGET,
	createPOST,
	createDELETEWithParams,
	createPUT,
	createPATCH,
	createGETWithParams,
	createPUTWithParams,
} from "@helper/RequesterBase";
import { IdParams } from "@usertypes/params";
import {
	IVideoCallDuration,
	ITimeframeInterval,
	IVideoCallSetting,
} from "@usertypes/types";
import {
	AnalyticsPostsRespBody,
	ChangePasswordReqBody,
	UpdateEmailReqBody,
	UpdateSettingReqBody,
	VerifyDeleteAccountReqBody,
	VerifyNewEmailReqBody,
	VideoCallDurationReqBody,
	VideoCallIntervalReqBody,
} from "./schemas";

export const changePassword = createPOST<ChangePasswordReqBody, never>(
	"/settings/change-password",
	true,
);

export const deleteAccount = createPOST<null, never>(
	"/settings/delete-account",
	true,
);

export const getPostAnalytics = createGET<AnalyticsPostsRespBody>(
	"/settings/analytics-post",
	true,
);

export const updateSetting = createPOST<UpdateSettingReqBody, never>(
	"/settings/update",
	true,
);

export const updateEmail = createPOST<UpdateEmailReqBody, never>(
	"/settings/update-email",
	true,
);

export const verifyDeleteAccount = createPOST<
	VerifyDeleteAccountReqBody,
	never
>("/settings/verify-delete-account", true);

export const verifyNewEmail = createPOST<VerifyNewEmailReqBody, never>(
	"/settings/verify-new-email",
	true,
);

export const getVideoCallDurations = createGET<IVideoCallDuration[]>(
	"/videocall/durations",
	true,
);

export const createVideoCallDuration = createPOST<
	VideoCallDurationReqBody,
	never
>("/videocall/durations", true);

export const deleteVideoCallDuration = createDELETEWithParams<
	IdParams,
	never,
	IdParams
>("/videocall/durations/:id", true);

export const updateVideoCallDuration = createPUTWithParams<
	VideoCallDurationReqBody,
	never,
	IdParams
>("/videocall/durations/:id", true);

export const getVideoCallTimeframes = createGET<ITimeframeInterval[]>(
	"/videocall/intervals",
	true,
);
export const createVideoCallInterval = createPOST<
	VideoCallIntervalReqBody,
	never
>("/videocall/intervals", true);

export const deleteVideoCallInterval = createDELETEWithParams<
	IdParams,
	never,
	IdParams
>("/videocall/intervals/:id", true);

export const updateVideoCallInterval = createPUTWithParams<
	VideoCallIntervalReqBody,
	never,
	IdParams
>("/videocall/intervals/:id", true);

export const getVideoCallSettings = createGET<IVideoCallSetting>(
	"/videocall/settings",
	true,
);

export const updateVideoCallSettings = createPATCH<
	Partial<IVideoCallSetting>,
	IVideoCallSetting
>("/videocall/settings", true);

export const getProfileVideoCallSettings = createGETWithParams<
	IVideoCallSetting,
	IdParams
>("/videocall/profiles/:id", true);
