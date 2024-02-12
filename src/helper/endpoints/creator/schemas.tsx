import { ReportType } from "@usertypes/commonEnums";
import { ISubscriber, ITransactionCreator, IUserInfo } from "@usertypes/types";

export type CreateReportReqBody = {
	userId: string;
	flag: ReportType;
	reason: string;
	image?: string;
};

export interface EarningsReqBody {
	startDate?: string;
	endDate?: string;
}

export type EarningsResBody = {
	prevPeriodLabel: string;
	prevPeriodEarnings: number;
	prevPeriodEarningsDifference: number;
	prevPeriodEarningsPercentageDifference: number;
	earnings: number;
	period: string;
	timeline: {
		date: string;
		earnings: number;
	}[];
};

export type SubscribersResBody = {
	subscribers: ISubscriber[];
};

export type TransactionsResBody = {
	transactions: ITransactionCreator[];
};

export interface RefundReqBody {
	id: string;
}

export interface PaidPostEarningsReqBody {
	postId: string;
	startDate?: string;
	endDate?: string;
}

export type PaidPostEarningsResBody = {
	prevPeriodLabel: string;
	prevPeriodEarnings: number;
	prevPeriodEarningsDifference: number;
	prevPeriodEarningsPercentageDifference: number;
	earnings: number;
	purchases: number;
	period: string;
	timeline: {
		date: string;
		earnings: number;
	}[];
};

export interface PaidPostsEarningsReqBody {
	startDate?: string;
	endDate?: string;
}

export type PaidPostsEarningsResBody = {
	prevPeriodLabel: string;
	prevPeriodEarnings: number;
	prevPeriodEarningsDifference: number;
	prevPeriodEarningsPercentageDifference: number;
	earnings: number;
	purchases: number;
	period: string;
	timeline: {
		date: string;
		earnings: number;
	}[];
};

export interface PaidPostPurchasedReqBody {
	postId: string;
}

export interface PaidPostPurchasedResBody {
	fans: IUserInfo[];
}
