import { roleIcons } from "@constants/common";
import {
	PostType,
	PromotionType,
	DurationType,
	CampaignApplicableType,
} from "@usertypes/commonEnums";
import { IPostForm, IPaymentCard } from "@usertypes/types";

export const defaultAudioDetail = {
	title: "",
	episodeNumber: "",
	description: "",
	isPrivate: false,
	isAudioLeveling: true,
	isNoiseReduction: true,
};

export const defaultPollFormData = {
	question: "",
	caption: "",
	answers: [""],
	cover: { uri: "", isPicker: true },
	startDate: undefined,
	endDate: undefined,
	timezone: "",
};

export const defaultFundraiserFormData = {
	title: "",
	caption: "",
	price: "",
	currency: "USD",
	startDate: undefined,
	endDate: undefined,
	timezone: "GMT +0:00",
	isXpAdd: false,
	cover: { uri: "", isPicker: true },
};

export const defaultAddGiveawayFormData = {
	prize: "",
	startDate: undefined,
	endDate: undefined,
	timezone: "",
	winnerCount: "",
	cover: {
		uri: "",
		isPicker: true,
	},
};

export const defaultPostFormData: IPostForm = {
	id: "0",
	title: "",
	type: PostType.Photo,
	caption: "",
	thumb: {
		uri: "",
		isPicker: true,
	},
	medias: [],
	roles: [],
	categories: [],
	// paidPost: {
	// 	currency: "USD",
	// 	price: "0",
	// 	thumb: "",
	// },
	fundraiser: defaultFundraiserFormData,
	giveaway: defaultAddGiveawayFormData,
	schedule: {
		startDate: "",
		endDate: "",
		timezone: "",
	},
	advanced: {
		isHideLikeViewCount: false,
		isTurnOffComment: false,
		isPaidLabelDisclaimer: false,
	},
	poll: defaultPollFormData,
	audio: defaultAudioDetail,
	taggedPeoples: [],
	location: "",
	formIds: [],
	uploadFiles: [],
	isReleaseForm: false,
	isAllSubscribers: true,
	carouselIndex: 0,
	newUsertags: [],
	categoryForm: {
		isAll: true,
		categoryName: "",
		roleIds: [],
	},
	paidPostAccess: {
		roleIds: [],
		tierIds: [],
		fanUsers: [],
	},
};

export const defaultPaymentCardData: IPaymentCard = {
	country: "",
	state: "",
	street: "",
	city: "",
	zip: "",
	cardName: "",
	cardNumber: "",
	expireDate: "",
	cvc: "",
};

export const defaultCampaignFormData = {
	id: "0",
	endDate: "",
	duration: "1",
	limit: "0",
	discount: "",
	type: PromotionType.FreeTrial,
	applicable: CampaignApplicableType.New,
	durationType: DurationType.Months,
};

export const defaultRoleFormData = {
	id: "0",
	name: "",
	color: "",
	icon: roleIcons[0].name,
	level: "",
};
