import {
	createDELETEWithParams,
	createGET,
	createPOST,
	createPOSTWithParams,
	createPUTWithParams,
} from "@helper/RequesterBase";
import { IdParams } from "@usertypes/params";
import { ICreatorReferrals } from "@usertypes/types";
import {
	CreateReferralLinkReqBody,
	DeleteReferralLinkReqBody,
	FansReferralJoinProgramReqBody,
	GetCreatorReferralCreatorsRespBody,
	GetCreatorReferralLinkPerformanceRespBody,
	GetCreatorReferralTotalEarningRespBody,
	GetCreatorReferralTransactionsRespBody,
	UpdateReferralLinkReqBody,
} from "./schemas";

export const getReferralLinks = createGET<ICreatorReferrals>(
	"/profile/creator-referrals",
	true,
);
export const createReferralLink = createPOST<
	CreateReferralLinkReqBody,
	unknown
>("/profile/creator-referrals", true);

export const updateReferralLink = createPUTWithParams<
	UpdateReferralLinkReqBody,
	unknown,
	IdParams
>("/profile/creator-referrals/:id", true);

export const deleteReferralLink = createDELETEWithParams<
	DeleteReferralLinkReqBody,
	unknown,
	IdParams
>("/profile/creator-referrals/:id", true);

export const getCreatorReferralTotalEarning =
	createGET<GetCreatorReferralTotalEarningRespBody>(
		"/profile/creator-referrals/earning",
		true,
	);

export const getCreatorReferralCreators =
	createGET<GetCreatorReferralCreatorsRespBody>(
		"/profile/creator-referrals/creators",
		true,
	);

export const getCreatorReferralLinkPerformance =
	createGET<GetCreatorReferralLinkPerformanceRespBody>(
		"/profile/creator-referrals/link-performance",
		true,
	);

export const getCreatorReferralTransactions =
	createGET<GetCreatorReferralTransactionsRespBody>(
		"/profile/creator-referrals/transactions",
		true,
	);

export const postVisitReferralLink = createPOSTWithParams<
	unknown,
	unknown,
	IdParams
>("/profile/creator-referrals/visit/:id", true);

// Fans Referral
export const postFansReferralJoinProgram = createPOST<
	FansReferralJoinProgramReqBody,
	unknown
>("/user/fan-referrals", true);
