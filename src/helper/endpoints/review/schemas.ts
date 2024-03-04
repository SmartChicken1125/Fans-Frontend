import { IReview, PaginatedRespBody } from "@usertypes/types";

export interface ReviewsRespBody extends PaginatedRespBody {
	reviews: IReview[];
}

export interface PostReviewReqBody {
	creatorId: string;
	score: number;
	text: string;
	tip: number;
}
