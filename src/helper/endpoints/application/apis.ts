import { IdParams } from "@usertypes/params";
import {
	createGETWithParams,
	createPOSTWithParams,
	createPUT,
	createPUTWithParams,
	createGET,
	createPOST,
} from "./../../RequesterBase";
import {
	ApplicationIconReqBody,
	ApplicationIdParams,
	ApplicationListRespBody,
	ApplicationReqBody,
	ApplicationRespBody,
	ApplicationUpdateParams,
} from "./schemas";

export const getApplications = createGET<ApplicationListRespBody>(
	"/applications",
	true,
);

export const createApplication = createPOST<
	ApplicationReqBody,
	ApplicationRespBody
>("/applications", true);

export const getApplicationById = createGETWithParams<
	ApplicationRespBody,
	ApplicationIdParams
>("/applications/:appId", true);

export const updateApplicationIcon = createPUT<ApplicationIconReqBody, never>(
	"/applications/icon",
	true,
);

export const updateApplication = createPUTWithParams<
	ApplicationUpdateParams,
	never,
	ApplicationIdParams
>("/applications/:appId", true);
