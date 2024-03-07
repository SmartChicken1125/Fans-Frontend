import { IProfile, IStory } from "@usertypes/types";

export interface StoryUrl {
	url: string;
	pointX: number;
	pointY: number;
}

export interface StoryTag {
	userId: string;
	color: string;
	pointX: number;
	pointY: number;
}

export interface StoryText {
	text: string;
	color: string;
	font: string;
	pointX: number;
	pointY: number;
}

export interface StoryCreateReqBody {
	mediaId: string;
	storyUrls: StoryUrl[];
	storyTags: StoryTag[];
	storyTexts: StoryText[];
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

export interface LinkPreviewRespBody {
	url: string;
	title?: string;
	siteName?: string;
	description?: string;
	images?: string[];
	favicons?: string[];
	mediaType?: string;
	contentType?: string;

	code?: number;
	message?: string;
}
