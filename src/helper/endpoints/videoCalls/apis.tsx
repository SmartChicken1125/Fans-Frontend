import {
	createGET,
	createPOST,
	createDELETEWithParams,
	createPATCH,
	createGETWithParams,
	createPUTWithParams,
	createPOSTWithParams,
} from "@helper/RequesterBase";
import { IdParams } from "@usertypes/params";
import {
	IVideoCallDuration,
	ITimeframeInterval,
	IVideoCallSetting,
} from "@usertypes/types";
import {
	VideoCallDurationReqBody,
	VideoCallIntervalReqBody,
	AvailableIntervalsRespBody,
	VideoCallMeetingReqBody,
	VideoCallMeetingsRespBody,
	VideoCallAttendantsRespBody,
	VideoCallMeetingPriceRespBody,
} from "./schemas";

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

export const getAvailableIntervals = createGET<AvailableIntervalsRespBody>(
	"/videocall/availability",
	true,
);

export const getVideoCallMeetingPrice = createPOST<
	VideoCallMeetingReqBody,
	VideoCallMeetingPriceRespBody
>("/videocall/meetings/price", true);

export const createVideoCallMeeting = createPOST<
	VideoCallMeetingReqBody,
	never
>("/videocall/meetings", true);

export const getVideoCallMeetings = createGET<VideoCallMeetingsRespBody>(
	"/videocall/meetings",
	true,
);

export const acceptMeetingById = createPOSTWithParams<null, never, IdParams>(
	"/videocall/meetings/:id/accept",
	true,
);

export const declineMeetingById = createPOSTWithParams<null, never, IdParams>(
	"/videocall/meetings/:id/decline",
	true,
);

export const cancelMeetingById = createPOSTWithParams<null, never, IdParams>(
	"/videocall/meetings/:id/cancel",
	true,
);

export const getVideoCallAttendants = createGETWithParams<
	VideoCallAttendantsRespBody,
	IdParams
>("/videocall/meetings/:id/attendees", true);
