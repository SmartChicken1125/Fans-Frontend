import {
	createDELETEWithParams,
	createGET,
	createGETWithParams,
	createPOST,
	createPOSTWithParams,
	createPUTWithParams,
} from "@helper/RequesterBase";
import { IdParams } from "@usertypes/params";
import {
	SubscribedProfilesRespBody,
	UserlistCreateReqBody,
	UserlistRespBody,
	UserlistUpdateReqBody,
	UserlistsRespBody,
} from "./schemas";

export const getUserlists = createGET<UserlistsRespBody>("/userlists", true);
export const getUserlistById = createGETWithParams<UserlistRespBody, IdParams>(
	"/userlists/:id",
	true,
);
export const createUserlist = createPOST<
	UserlistCreateReqBody,
	UserlistRespBody
>("/userlists", true);

export const updateUserlist = createPUTWithParams<
	UserlistUpdateReqBody,
	IdParams
>("/userlists/:id", true);

export const deleteUserlist = createDELETEWithParams<never, never, IdParams>(
	"/userlists/:id",
);

export const addCreatorToUserlist = createPOSTWithParams<
	never,
	never,
	IdParams
>("/userlists/addCreator/:id");

export const getSubscribedProfiles = createGET<SubscribedProfilesRespBody>(
	"/profiles",
	true,
);
