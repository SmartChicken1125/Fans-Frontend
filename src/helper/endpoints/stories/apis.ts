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
	StoriesRespBody,
	StoryCreateReqBody,
	StoryFeedRespBody,
	StoryRespBody,
} from "./schemas";

export const getStories = createGET<StoriesRespBody>("/stories", true);

export const getStoryById = createGETWithParams<StoryRespBody, IdParams>(
	"/stories/:id",
	true,
);

export const createStory = createPOST<StoryCreateReqBody, StoryRespBody>(
	"/stories",
	true,
);

export const archiveStory = createPUTWithParams<unknown, unknown, IdParams>(
	"/stories/archive/:id",
	true,
);

export const deleteStory = createDELETEWithParams<unknown, never, IdParams>(
	"/stories/:id",
	true,
);

export const getStoriesFeed = createGET<StoryFeedRespBody>(
	"/stories/feed",
	true,
);

export const storyLike = createPOSTWithParams<null, StoryRespBody, IdParams>(
	"/stories/like/:id",
	true,
);

export const unlikeStoryById = createDELETEWithParams<
	null,
	StoryRespBody,
	IdParams
>("/stories/like/:id", true);

export const shareStoryById = createPOSTWithParams<
	null,
	StoryRespBody,
	IdParams
>("/stories/share/:id", true);

export const hideFeedStoryById = createPOSTWithParams<null, never, IdParams>(
	"/stories/hide-feed/:id",
	true,
);
