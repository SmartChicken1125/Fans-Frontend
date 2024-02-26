import {
	IAvailableInterval,
	PaginatedRespBody,
	IVideoCallMeeting,
	VideoCallWays,
	IVideoCallAttendant,
	RecipientPronoun,
	ICustomVideoOrder,
} from "@usertypes/types";

export interface CameoVideoDurationReqBody {
	length: number;
	price: number;
	currency: string;
}

export interface CustomVideoOrderReqBody {
	duration: number;
	creatorId: string;
	instructions: string;
	recipientName: string;
	recipientPronoun: RecipientPronoun;
}

export type CustomVideoOrdersRespBody = PaginatedRespBody & {
	totalPrice: number;
	orders: ICustomVideoOrder[];
};

export type CustomVideoOrderVideoReqBody = {
	uploadId: string;
};
