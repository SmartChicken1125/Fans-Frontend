import { PostType } from "@usertypes/commonEnums";
import {
	IAnalyzeFans,
	IBookmark,
	IComment,
	IFansUser,
	IPost,
	IProfile,
	IUser,
	PaginatedRespBody,
	PostReportFlag,
} from "@usertypes/types";

export interface PostAdvanced {
	isHideLikeViewCount: boolean;
	isTurnOffComment: boolean;
	isPaidLabelDisclaimer: boolean;
}

export interface PostLocation {
	city: string;
	country: string;
	district: string;
	isoCountryCode: string;
	name: string;
	postalCode: string;
	region: string;
	street: string;
	subregion: string;
	timezone: string;
}

export interface PaidPost {
	price: number;
	currency: string;
	thumbId?: string;
	tiers?: string[];
	roles?: string[];
	users?: string[];
}

export interface FundraiserBody {
	title: string;
	caption?: string;
	thumbId?: string;
	price: number;
	currency: string;
	endDate: string;
	isXpAdd: boolean;
}

export interface GiveawayBody {
	prize: string;
	thumbId?: string;
	endDate: string;
	winnerCount: number;
	roles?: string[];
}

export interface PollBody {
	question: string;
	caption?: string;
	answers: string[];
	thumbId?: string;
	endDate: string;
	isPublic: boolean;
	roles?: string[];
}

export interface ScheduleBody {
	startDate: string;
	endDate?: string;
}

export interface TaggedPeople {
	userId: string;
	pointX: number;
	pointY: number;
}

export interface PostMediaTags {
	userId: string;
	pointX: number;
	pointY: number;
}

export interface PostMedia {
	postMediaId: string;
	tags: PostMediaTags[];
}

export interface PostCreateReqBody {
	title?: string;
	type: PostType;
	caption: string;
	thumbId?: string;
	// video, image, audios can be string
	// fundraiser will be FundrasierResource
	// poll will be PollResource
	postMedias?: PostMedia[];
	text?: string;
	taggedPeoples?: TaggedPeople[];
	advanced?: PostAdvanced;
	location?: string;

	roles?: string[];
	tiers?: string[];
	users?: string[];
	categories?: string[];
	episodeNumber?: number;
	description?: string;
	formIds?: string[];
	isPrivate?: boolean;
	isNoiseReduction?: boolean;
	isAudioLeveling?: boolean;
	paidPost?: PaidPost;
	fundraiser?: FundraiserBody;
	giveaway?: GiveawayBody;
	poll?: PollBody;
	schedule?: ScheduleBody;
}

export interface PostArchiveReqBody {
	id: string;
}

export interface StoryReqBody {
	mediaIds: string[];
}

export interface AddPostCommentReqBody {
	postId: string;
	content: string;
	parentCommentId?: string;
}

export interface BookmarkIdsRespBody {
	bookmarkPostIds: string[];
	updatedPost: IPost;
}

export interface BookmarksRespBody {
	bookmarks: (IBookmark & { post: IPost })[];
}

export interface PostListRespBody {
	posts: IPost[];
	page: number;
	size: number;
	total: number;
}

export interface PostFeedForProfileIdParams {
	userId: string;
}

export interface CreatePostReportReqBody {
	postId: string;
	reportFlag: PostReportFlag;
	reason?: string;
}

export interface RepliesRespBody {
	replies: IComment[];
}

export interface RoleReqBody {
	name: string;
	color: string;
	icon: string;
	level: number;
}

export interface AnalyzeFansRespBody {
	total: number;
	data: IAnalyzeFans[];
}

export interface InvitationReqBody {
	emails: string[];
	message: string;
}

export type FansUsersRespBody = PaginatedRespBody & {
	fans: IFansUser[];
};

export interface PurchasePaidPostReqBody {
	postId: string;
	customerPaymentProfileId: string;
}

export interface PaidPostPriceResBody {
	amount: number;
	platformFee: number;
	vatFee: number;
	totalAmount: number;
}

export type CreatePostReportRespBody = IProfile & { user: IUser };
