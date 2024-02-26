import {
	IAvailableInterval,
	PaginatedRespBody,
	IVideoCallMeeting,
	VideoCallWays,
	IVideoCallAttendant,
} from "@usertypes/types";

export interface VideoCallDurationReqBody {
	length: number;
	price: number;
	currency: string;
	isEnabled: boolean;
}

export interface VideoCallIntervalReqBody {
	startTime: string;
	length: number;
	day: number;
}

export interface AvailableIntervalsRespBody {
	intervals: IAvailableInterval[];
}

export interface VideoCallMeetingReqBody {
	hostId: string;
	startDate: string;
	duration: number;
	customerPaymentProfileId?: string;
}

export type VideoCallMeetingsRespBody = PaginatedRespBody & {
	totalPrice: number;
	meetings: IVideoCallMeeting[];
};

export interface VideoCallSettingsRespBody {
	bufferBetweenCalls: number;
	meetingType: VideoCallWays;
	sexualContentAllowed: boolean;
	contentPreferences: string[];
	customContentPreferences: string;
	meetingDescription: string;
	notificationNewRequests: boolean;
	notificationCancellations: boolean;
	notificationReminders: boolean;
	notificationsByEmail: boolean;
	notificationsByPhone: boolean;
	videoCallsEnabled: boolean;
}

export interface VideoCallAttendantsRespBody {
	attendees: IVideoCallAttendant[];
}

export interface VideoCallMeetingPriceRespBody {
	amount: number;
	processingFee?: number;
	platformFee: number;
	vatFee: number;
	totalAmount: number;
}
