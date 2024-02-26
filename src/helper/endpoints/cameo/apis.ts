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
	IVideoDuration,
	ICustomVideoSettings,
	ICreatorCustomVideoSettings,
	ICustomVideoOrder,
} from "@usertypes/types";
import {
	CameoVideoDurationReqBody,
	CustomVideoOrderReqBody,
	CustomVideoOrdersRespBody,
	CustomVideoOrderVideoReqBody,
} from "./schemas";

export const getCustomVideoDurations = createGET<IVideoDuration[]>(
	"/cameo/durations",
	true,
);

export const createCustomVideoDuration = createPOST<
	CameoVideoDurationReqBody,
	never
>("/cameo/durations", true);

export const deleteCustomVideoDuration = createDELETEWithParams<
	IdParams,
	never,
	IdParams
>("/cameo/durations/:id", true);

export const updateCustomVideoDuration = createPUTWithParams<
	CameoVideoDurationReqBody,
	never,
	IdParams
>("/cameo/durations/:id", true);

export const getCustomVideoSettings = createGET<ICustomVideoSettings>(
	"/cameo/settings",
	true,
);

export const updateCustomVideoSettings = createPATCH<
	Partial<ICustomVideoSettings>,
	ICustomVideoSettings
>("/cameo/settings", true);

export const getCreatorCustomVideoSettings = createGETWithParams<
	ICreatorCustomVideoSettings,
	IdParams
>("/cameo/profiles/:id", true);

export const createCustomVideoOrder = createPOST<
	CustomVideoOrderReqBody,
	ICustomVideoOrder
>("/cameo/orders", true);

export const getCustomVideoOrders = createGET<CustomVideoOrdersRespBody>(
	"/cameo/orders",
	true,
);

export const acceptCustomVideoOrderById = createPOSTWithParams<
	null,
	never,
	IdParams
>("/cameo/orders/:id/accept", true);

export const declineCustomVideoOrderById = createPOSTWithParams<
	null,
	never,
	IdParams
>("/cameo/orders/:id/decline", true);

export const cancelCustomVideoOrderById = createPOSTWithParams<
	null,
	never,
	IdParams
>("/cameo/orders/:id/cancel", true);

export const fulfillCustomVideoOrderById = createPOSTWithParams<
	null,
	never,
	IdParams
>("/cameo/orders/:id/fulfill", true);

export const updateCustomVideoOrderVideoById = createPUTWithParams<
	CustomVideoOrderVideoReqBody,
	null,
	IdParams
>("/cameo/orders/:id/video", true);
