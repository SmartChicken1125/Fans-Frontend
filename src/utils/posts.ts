import {
	defaultAddGiveawayFormData,
	defaultAudioDetail,
	defaultFundraiserFormData,
	defaultPollFormData,
	defaultPostFormData,
} from "@constants/defaultFormData";
import { timezones } from "@constants/timezones";
import { PostCreateReqBody } from "@helper/endpoints/post/schemas";
import { MediaType, PostType } from "@usertypes/commonEnums";
import { IPost, IPostForm, Media } from "@usertypes/types";
import moment from "moment";
import momentTimezone from "moment-timezone";

export const getCreatePostData = (data: {
	postForm: IPostForm;
	thumbId: string | undefined;
	mediaIds: string[];
	formIds: string[];
	// paidPostThumbId?: string;
	paidPostThumbIds: string[];
	fundraiserCover?: string;
	pollCover?: string;
	giveawayCover?: string;
}) => {
	const {
		postForm,
		thumbId,
		mediaIds,
		formIds,
		paidPostThumbIds,
		fundraiserCover,
		pollCover,
		giveawayCover,
	} = data;

	const postBody: PostCreateReqBody = {
		title: "",
		type: postForm.type,
		thumbId: thumbId,
		postMedias: mediaIds.map((mediaId) => ({
			postMediaId: mediaId,
			tags:
				postForm.taggedPeoples
					.find((mediaTag) => mediaTag.postMediaId === mediaId)
					?.tags.map((tag) => ({
						userId: tag.userId ?? "",
						pointX: tag.pointX,
						pointY: tag.pointY,
					})) ?? [],
		})),
		caption: postForm.caption,
		categories: postForm.categories,
		advanced: postForm.advanced,
		// taggedPeoples: postForm.taggedPeoples.map((people) => people.user.id),
		formIds: formIds,
		roles: postForm.viewType === "XPLevels" ? postForm.roles : [],
		users:
			postForm.viewType === "SpecificFans"
				? postForm.users.map((user) => user.id)
				: [],
		tiers: postForm.viewType === "PaymentTiers" ? postForm.tiers : [],
	};

	if (postForm.type === PostType.Vault) {
		postBody.type =
			postForm.medias[0].type === MediaType.Video
				? PostType.Video
				: PostType.Photo;
	}

	if (postForm.location) {
		postBody.location = postForm.location;
	}

	const paidPostPrice = parseFloat(postForm.paidPost?.price ?? "0");
	if (postForm.paidPost && !isNaN(paidPostPrice) && paidPostPrice > 0) {
		postBody.paidPost = {
			currency: "USD",
			thumbIds: paidPostThumbIds,
			price: paidPostPrice,
			tiers: postForm.paidPostAccess.tierIds,
			roles: postForm.paidPostAccess.roleIds,
			users: postForm.paidPostAccess.fanUsers.map((user) => user.id),
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
			// startDate: moment(postForm.fundraiser.startDate)
			// 	.utcOffset("+000", true)
			// 	.format(),
			endDate: moment(postForm.fundraiser.endDate)
				.utcOffset("+000", true)
				.format(),
			// timezone: postForm.fundraiser.timezone,
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
			endDate: moment(postForm.poll.endDate)
				.utcOffset("+000", true)
				.format(),
			isPublic: postForm.poll.isPublic,
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

	if (postForm.schedule.startDate !== undefined) {
		momentTimezone.tz.setDefault(postForm.schedule.timezone);
		const startDate = momentTimezone({
			year: postForm.schedule.startDate.getFullYear(),
			month: postForm.schedule.startDate.getMonth(),
			day: postForm.schedule.startDate.getDate(),
			hours: postForm.schedule.time.hours,
			minutes: postForm.schedule.time.minutes,
		}).format();
		postBody.schedule = {
			startDate: startDate,
			endDate: startDate,
			timezone: postForm.schedule.timezone,
		};
	}
	if (
		!!postForm.giveaway.prize &&
		!!postForm.giveaway.winnerCount &&
		!!postForm.giveaway.endDate
	) {
		postBody.giveaway = {
			prize: postForm.giveaway.prize,
			endDate: moment(postForm.giveaway.endDate)
				.utcOffset("+000", true)
				.format(),
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
		case PostType.Vault:
			return "vault";
		default:
			return "photo";
	}
};

export const post2PostFormData = (data: IPost): IPostForm => {
	let date = momentTimezone(new Date(data.schedule?.startDate || "")).tz(
		data.schedule?.timezone || "",
	);
	date = data.schedule?.startDate ? date : moment();
	return {
		id: data.id,
		title: data.title,
		type: data.type,
		caption: data.caption,
		thumb: {
			uri: data.thumb?.url ?? defaultPostFormData.thumb.uri,
			url: data.thumb?.url,
			isPicker: defaultPostFormData.thumb.isPicker,
			type:
				(data.thumb?.type as MediaType) ??
				defaultPostFormData.thumb.type,
			tags: [],
		},
		medias: data.medias.map((v) => ({
			id: v.id,
			uri: v.url ?? "",
			type: v.type as MediaType,
			isPicker: false,
			tags: v.tags,
		})),
		roles: data.roles.map((r) => r.id),
		categories: data.categories.map((r) => r.id),
		// paidPost: {
		// 	currency: "USD",
		// 	price: "0",
		// 	thumb: "",
		// },
		fundraiser: {
			title: data.fundraiser?.title ?? defaultFundraiserFormData.title,
			caption:
				data.fundraiser?.caption ?? defaultFundraiserFormData.caption,
			price:
				String(data.fundraiser?.price) ??
				defaultFundraiserFormData.price,
			currency:
				data.fundraiser?.currency ?? defaultFundraiserFormData.currency,
			// startDate: data.fundraiser?.startDate ?? defaultFundraiserFormData.startDate,
			startDate: defaultFundraiserFormData.startDate,
			endDate: data.fundraiser?.endDate
				? new Date(data.fundraiser?.endDate)
				: defaultFundraiserFormData.endDate,
			isXpAdd:
				data.fundraiser?.isXpAdd ?? defaultFundraiserFormData.isXpAdd,
			timezone:
				data.fundraiser?.timezone ?? defaultFundraiserFormData.timezone,
			cover: defaultFundraiserFormData.cover,
		},
		giveaway: {
			prize: data.giveaway?.prize ?? defaultAddGiveawayFormData.prize,
			endDate: data.giveaway?.endDate
				? new Date(data.giveaway?.endDate)
				: defaultAddGiveawayFormData.endDate,
			winnerCount:
				data.giveaway?.winnerCount ??
				defaultAddGiveawayFormData.winnerCount,
			cover: defaultAddGiveawayFormData.cover,
		},
		schedule: {
			startDate: new Date(date.year(), date.month(), date.date()),
			timezone:
				data.schedule?.timezone ??
				defaultPostFormData.schedule.timezone,
			time: {
				hours: date.hours(),
				minutes: date.minutes(),
			},
		},
		advanced: {
			isHideLikeViewCount:
				data.advanced?.isHideLikeViewCount ??
				defaultPostFormData.advanced.isHideLikeViewCount,
			isTurnOffComment:
				data.advanced?.isTurnOffComment ??
				defaultPostFormData.advanced.isTurnOffComment,
			isPaidLabelDisclaimer:
				data.advanced?.isPaidLabelDisclaimer ??
				defaultPostFormData.advanced.isPaidLabelDisclaimer,
		},
		poll: {
			id: data.poll?.id ?? defaultPollFormData.id,
			question: data.poll?.question ?? defaultPollFormData.question,
			caption: data.poll?.caption ?? defaultPollFormData.caption,
			answers: data.poll?.answers
				? data.poll?.answers.map((v) => v.answer)
				: defaultPollFormData.answers,
			cover: defaultPollFormData.cover,
			endDate: data.poll?.endDate
				? new Date(data.poll?.endDate)
				: defaultPollFormData.endDate,
			isPublic: data.poll?.isPublic ?? defaultPollFormData.isPublic,
		},
		audio: defaultAudioDetail,
		taggedPeoples: data.taggedPeoples,
		location: data.location,
		formIds: defaultPostFormData.formIds,
		uploadFiles: defaultPostFormData.uploadFiles,
		isReleaseForm: defaultPostFormData.isReleaseForm,
		carouselIndex: defaultPostFormData.carouselIndex,
		categoryForm: defaultPostFormData.categoryForm,
		paidPostAccess: defaultPostFormData.paidPostAccess,
		tiers: defaultPostFormData.tiers,
		users: data.users,
		viewType: defaultPostFormData.viewType,
	};
};
