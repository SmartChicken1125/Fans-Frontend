import { IComment, IProfile } from "@usertypes/types";
export interface RepliesRespBody {
	replies: IComment[];
}
export interface AddStoryCommentReqBody {
	storyId: string;
	content: string;
	parentCommentId?: string;
}

export interface StoriesFeedRespBody {
	creators: IProfile[];
	page: number;
	size: number;
	total: number;
}
