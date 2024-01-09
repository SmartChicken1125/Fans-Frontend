import { createGET, createPOST } from "@helper/RequesterBase";
import { AnalyticsIPost, IPost } from "@usertypes/types";
import {
	CreateReportReqBody,
	EarningsReqBody,
	EarningsResBody,
	SubscribersResBody,
	TransactionsResBody,
	RefundReqBody,
	PaidPostEarningsReqBody,
	PaidPostEarningsResBody,
	PaidPostsEarningsReqBody,
	PaidPostsEarningsResBody,
	PaidPostPurchasedReqBody,
	PaidPostPurchasedResBody,
} from "./schemas";

// impot main modules

export const createReport = createPOST<CreateReportReqBody, never>(
	"/creator/reports",
	true,
);

export const getEarnings = createPOST<EarningsReqBody, EarningsResBody>(
	"/creator/analytics/earnings",
	true,
);

export const getSubscribers = createGET<SubscribersResBody>(
	"/creator/analytics/subscribers",
	true,
);

export const getTransactions = createGET<TransactionsResBody>(
	"/creator/analytics/transactions",
	true,
);

export const refund = createPOST<RefundReqBody, never>(
	"/creator/analytics/refund",
	true,
);

export const getPaidPostsEarnings = createPOST<
	PaidPostsEarningsReqBody,
	PaidPostsEarningsResBody
>("/creator/analytics/paid-post/earnings", true);

export const getTopPosts = createGET<AnalyticsIPost[]>(
	"/creator/analytics/paid-post/bestselling",
	true,
);

export const getPaidPostEarnings = createPOST<
	PaidPostEarningsReqBody,
	PaidPostEarningsResBody
>("/creator/analytics/paid-post/post/earnings", true);

export const getPaidPostPurchasedAnalytics = createPOST<
	PaidPostPurchasedReqBody,
	PaidPostPurchasedResBody
>("/creator/analytics/paid-post/post/purchased", true);
