import { IProfile, IStory } from "@usertypes/types";

export interface StoryCreateReqBody {
	mediaIds: string[];
}

export type StoryRespBody = IStory;

export interface StoriesRespBody {
	stories: StoryRespBody[];
	page: number;
	size: number;
	total: number;
}

export type StoryFeedRespBody = {
	creators: (IProfile & {
		stories: IStory[];
	})[];
	page: number;
	size: number;
	total: number;
};
