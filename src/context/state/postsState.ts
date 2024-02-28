import { defaultPostFormData } from "@constants/defaultFormData";
import {
	ActionType,
	MediaType,
	PostStepTypes,
	PostType,
} from "@usertypes/commonEnums";
import {
	ICategory,
	IPost,
	IPostForm,
	IRole,
	IPostSchedule,
} from "@usertypes/types";

export interface IPostModal {
	visible: boolean;
	step: PostStepTypes;
}

export interface IStoryModal {
	visible: boolean;
}

export interface ILiveModal {
	action?: ActionType;
	visible: boolean;
	postId: string;
	schedule?: IPostSchedule;
	postType: PostType;
}

export interface IMediaModal {
	visible: boolean;
	avatar: string;
	displayName: string;
	mediaUrls: string[];
	mediaType: MediaType;
	index: number;
	watermark?: string;
}

export interface IPostsState {
	categories: ICategory[];
	roles: IRole[];
	postForm: IPostForm;
	posts: IPost[];
	modal: IPostModal;
	liveModal: ILiveModal;
	mediaModal: IMediaModal;
	storyModal: IStoryModal;
}

export const postsInitialState: IPostsState = {
	categories: [],
	roles: [],
	postForm: defaultPostFormData,
	posts: [],
	modal: {
		visible: false,
		step: PostStepTypes.Empty,
	},
	liveModal: {
		visible: false,
		postId: "0",
		postType: PostType.Media,
	},
	mediaModal: {
		visible: false,
		avatar: "",
		displayName: "",
		mediaUrls: [],
		mediaType: MediaType.Image,
		index: 0,
	},
	storyModal: {
		visible: false,
	},
};
