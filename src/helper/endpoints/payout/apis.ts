import {
	createDELETE,
	createGET,
	createGETWithParams,
	createPOST,
	createPUT,
	createPUTWithParams,
} from "@helper/RequesterBase";
import {
	GetPayoutLogsRespBody,
	PayoutMethodResBody,
	PayoutMethodReqBody,
	PayoutScheduleResBody,
	UpdatePayoutScheduleReqBody,
	PayPalPayoutMethodsResBody,
	PayPalPayoutMethodResBody,
	PutPayoutMethodReqBody,
	GetPayoutMethodReqBody,
} from "./schemas";

export const fetchPayoutPaymentMethods = createGET<PayPalPayoutMethodsResBody>(
	"/payout/payment-methods",
	true,
);

export const fetchPayoutMethodById = createGETWithParams<
	PayPalPayoutMethodResBody,
	GetPayoutMethodReqBody
>("/payout/payment-method/:id", true);

export const updatePayoutMethod = createPUTWithParams<
	PayoutMethodReqBody,
	never,
	PutPayoutMethodReqBody
>("/payout/payment-method/:id", true);

export const fetchPayoutMethod = createGET<PayoutMethodResBody>(
	"/payout/payment-method",
	true,
);

export const createOrUpdatePayoutMethod = createPOST<PayoutMethodReqBody>(
	"/payout/payment-method",
	true,
);

export const deletePayoutMethod = createDELETE<{}>(
	"/payout/payment-method",
	true,
);

export const fetchPayoutSchedule = createGET<PayoutScheduleResBody>(
	"/payout/payout-schedule",
	true,
);

export const executePayout = createGET("/payout/execute-payout", true);

export const updatePayoutSchedule = createPUT<
	UpdatePayoutScheduleReqBody,
	never
>("/payout/payout-schedule", true);

export const getPayoutLogs = createGET<GetPayoutLogsRespBody>(
	"/payout/logs",
	true,
);
