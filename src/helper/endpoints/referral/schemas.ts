import {
	CreatorReferralCreator,
	CreatorReferralLinkPerformance,
	CreatorReferralTransaction,
} from "@usertypes/types";

export interface CreateReferralLinkReqBody {
	code: string;
}
export interface UpdateReferralLinkReqBody {
	code: string;
}
export interface DeleteReferralLinkReqBody {}

export interface GetCreatorReferralTotalEarningReqQueryParams {
	from?: string;
	to?: string;
	code?: string;
}
export interface GetCreatorReferralTotalEarningRespBody {
	period: string;
	totalEarning: number;
	percentage: number;
	creatorCount: number;
	transactions: CreatorReferralTransaction[];
}

export interface GetCreatorReferralCreatorsReqQueryParams {
	from?: string;
	to?: string;
	code?: string;
	sort?: string;
}
export interface GetCreatorReferralCreatorsRespBody {
	creators: CreatorReferralCreator[];
}

export interface GetCreatorReferralLinkPerformanceReqQueryParams {
	from?: string;
	to?: string;
	code?: string;
	sort?: string;
}
export interface GetCreatorReferralLinkPerformanceRespBody {
	creatorReferrals: CreatorReferralLinkPerformance[];
}

export interface GetCreatorReferralTransactionsReqQueryParams {
	query: string;
	page: number;
	size: number;
}
export interface GetCreatorReferralTransactionsRespBody {
	transactions: CreatorReferralTransaction[];
}

// Fans Referral
export interface FansReferralJoinProgramReqBody {
	profileId: string;
}
