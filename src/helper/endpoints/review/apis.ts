import { createGET, createPOST } from "@helper/RequesterBase";
import { PostReviewReqBody, ReviewsRespBody } from "./schemas";

export const getReviews = createGET<ReviewsRespBody>("/reviews", true);

export const postReview = createPOST<PostReviewReqBody, never>(
	"/reviews",
	true,
);
