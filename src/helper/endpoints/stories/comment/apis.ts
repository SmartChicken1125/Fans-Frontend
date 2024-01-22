import {
	createDELETEWithParams,
	createGETWithParams,
	createPOST,
	createPOSTWithParams,
} from "@helper/RequesterBase";
import { IdParams } from "@usertypes/params";
import {
	StoryCommentCreateReqBody,
	StoryCommentRespBody,
	StoryCommentUpdateReqBody,
	StoryRepliesRespBody,
} from "./schemas";

export const createStoryComment = createPOST<
	StoryCommentCreateReqBody,
	StoryCommentRespBody
>("/story/comments", true);

export const getStoryCommentsByPostId = createGETWithParams<
	StoryRepliesRespBody,
	IdParams
>("/story/comments/reply/:id", true);

export const updateStoryCommentById = createPOSTWithParams<
	StoryCommentUpdateReqBody,
	never,
	IdParams
>("/story/comments/:id", true);

export const deleteCommentById = createDELETEWithParams<null, never, IdParams>(
	"/story/comments/:id",
	true,
);

export const likeStoryComment = createPOSTWithParams<null, never, IdParams>(
	"/story/comments/like/:id",
	true,
);
export const unlikeStoryComment = createDELETEWithParams<null, never, IdParams>(
	"/story/comments/like/:id",
	true,
);
