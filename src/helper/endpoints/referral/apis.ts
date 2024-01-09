import {
	createDELETEWithParams,
	createGET,
	createGETWithParams,
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
	GetCreatorReferralCreatorsReqQueryParams,
	GetCreatorReferralCreatorsRespBody,
	GetCreatorReferralLinkPerformanceReqQueryParams,
	GetCreatorReferralLinkPerformanceRespBody,
	GetCreatorReferralTotalEarningReqQueryParams,
	GetCreatorReferralTotalEarningRespBody,
	GetCreatorReferralTransactionsReqQueryParams,
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

export const getCreatorReferralTotalEarning = createGETWithParams<
	GetCreatorReferralTotalEarningRespBody,
	GetCreatorReferralTotalEarningReqQueryParams
>("/profile/creator-referrals/earning", true);

export const getCreatorReferralCreators = createGETWithParams<
	GetCreatorReferralCreatorsRespBody,
	GetCreatorReferralCreatorsReqQueryParams
>("/profile/creator-referrals/creators", true);

export const getCreatorReferralLinkPerformance = createGETWithParams<
	GetCreatorReferralLinkPerformanceRespBody,
	GetCreatorReferralLinkPerformanceReqQueryParams
>("/profile/creator-referrals/link-performance", true);

export const getCreatorReferralTransactions = createGETWithParams<
	GetCreatorReferralTransactionsRespBody,
	GetCreatorReferralTransactionsReqQueryParams
>("/profile/creator-referrals/transactions", true);

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
