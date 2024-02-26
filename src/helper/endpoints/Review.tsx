import { createGET, createPOST } from "@helper/RequesterBase";
import { IReview } from "@usertypes/types";

export interface GetReviewsRespBody {
	reviews: IReview[];
}

export const getReviews = createGET<GetReviewsRespBody>("/reviews", true);

export interface PostReviewReqBody {
	creatorId: string;
	score: number;
	text: string;
}

export const postReview = createPOST<PostReviewReqBody, never>(
	"/reviews",
	true,
);
