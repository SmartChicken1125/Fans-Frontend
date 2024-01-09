import { PostReqBody } from "@helper/endpoints/post/schemas";
import { PostType } from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import moment from "moment";

export const getCreatePostData = (data: {
	postForm: IPostForm;
	thumbId: string | undefined;
	mediaIds: string[];
	formIds: string[];
	paidPostThumbId?: string;
	fundraiserCover?: string;
	pollCover?: string;
	giveawayCover?: string;
}) => {
	const {
		postForm,
		thumbId,
		mediaIds,
		formIds,
		paidPostThumbId,
		fundraiserCover,
		pollCover,
		giveawayCover,
	} = data;

	const postBody: PostReqBody = {
		title: "",
		type: postForm.type,
		thumbId: thumbId,
		mediaIds: mediaIds,
		caption: postForm.caption,
		categories: postForm.categories,
		roles: postForm.roles,
		advanced: postForm.advanced,
		taggedPeoples: postForm.taggedPeoples.map((people) => people.user.id),
		formIds: formIds,
	};

	if (postForm.location) {
		postBody.location = postForm.location;
	}

	const paidPostPrice = parseFloat(postForm.paidPost?.price ?? "0");
	if (postForm.paidPost && !isNaN(paidPostPrice) && paidPostPrice > 0) {
		postBody.paidPost = {
			currency: "USD",
			thumbId: paidPostThumbId ?? "",
			price: paidPostPrice,
		};
	}

	const fundraiserPrice = parseFloat(postForm.fundraiser?.price ?? "0");
	if (
		postForm.fundraiser &&
		postForm.fundraiser.title !== "" &&
		postForm.fundraiser.caption !== "" &&
		!isNaN(fundraiserPrice) &&
		fundraiserPrice > 0
	) {
		postBody.fundraiser = {
			title: postForm.fundraiser.title,
			caption: postForm.fundraiser.caption,
			price: fundraiserPrice,
			startDate: moment(postForm.fundraiser.startDate)
				.utcOffset("+000", true)
				.format(),
			endDate: moment(postForm.fundraiser.endDate)
				.utcOffset("+000", true)
				.format(),
			timezone: postForm.fundraiser.timezone,
			isXpAdd: postForm.fundraiser.isXpAdd,
			currency: "USD",
			thumbId: fundraiserCover ?? "",
		};
	}

	if (
		postForm.poll &&
		postForm.poll.question !== "" &&
		postForm.poll.caption !== "" &&
		postForm.poll.answers.length > 0
	) {
		postBody.poll = {
			question: postForm.poll.question,
			caption: postForm.poll.caption,
			answers: postForm.poll.answers,
			thumbId: pollCover ?? "",
			startDate: moment(postForm.poll.startDate)
				.utcOffset("+000", true)
				.format(),
			endDate: moment(postForm.poll.endDate)
				.utcOffset("+000", true)
				.format(),
			timezone: postForm.poll.timezone,
		};
	}

	if (postForm.type === PostType.Audio) {
		postBody.title = postForm.audio.title;
		postBody.description = postForm.audio.description;
		postBody.episodeNumber = postForm.audio.episodeNumber
			? parseInt(postForm.audio.episodeNumber as string)
			: 0;
		postBody.isPrivate = postForm.audio.isPrivate;
		postBody.isAudioLeveling = postForm.audio.isAudioLeveling;
		postBody.isNoiseReduction = postForm.audio.isNoiseReduction;
	}

	if (postForm.schedule.startDate !== "") {
		postBody.schedule = postForm.schedule;
	}
	if (
		!!postForm.giveaway.prize &&
		!!postForm.giveaway.winnerCount &&
		!!postForm.giveaway.startDate &&
		!!postForm.giveaway.endDate
	) {
		postBody.giveaway = {
			prize: postForm.giveaway.prize,
			startDate: moment(postForm.giveaway.startDate)
				.utcOffset("+000", true)
				.format(),
			endDate: moment(postForm.giveaway.endDate)
				.utcOffset("+000", true)
				.format(),
			timezone: postForm.giveaway.timezone,
			winnerCount: parseFloat(postForm.giveaway.winnerCount as string),
			thumbId: giveawayCover ?? "",
		};
	}
	return postBody;
};

export const getPostTitleIcon = (postType: PostType) => {
	switch (postType) {
		case PostType.Photo:
			return "photo";
		case PostType.Video:
			return "video";
		case PostType.Audio:
			return "audio";
		case PostType.Story:
			return "story";
		case PostType.Text:
			return "text";
		default:
			return "photo";
	}
};
