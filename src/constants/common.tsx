import {
	BadgeType,
	CampaignApplicableType,
	CheckoutType,
	DurationType,
	PostStepTypes,
	PostType,
	PromotionType,
	SubscriptionTypes,
} from "@usertypes/commonEnums";
import { IFypDropdownItem } from "@usertypes/components";
import {
	IAnalyzeFans,
	IBadgeTier,
	IPost,
	IProfile,
	IProfileSettings,
	VideoCallWays,
} from "@usertypes/types";
import { SocialMediaTypes } from "./socialMediaTypes";

export const promotionCampaignOptions = [
	{
		data: PromotionType.FreeTrial,
		label: "Free Trial",
	},
	{
		data: PromotionType.Discount,
		label: "Discount",
	},
];

export const durationOptions = [
	// {
	// 	data: DurationType.Hours,
	// 	label: "Hours",
	// },
	// {
	// 	data: DurationType.Days,
	// 	label: "Days",
	// },
	// {
	// 	data: DurationType.Weeks,
	// 	label: "Weeks",
	// },
	{
		data: DurationType.Months,
		label: "Months",
	},
];

export const promotionOfferedOptions = [
	{
		data: CampaignApplicableType.New,
		label: "New fans",
	},
	{
		data: CampaignApplicableType.Both,
		label: "All fans",
	},
	{
		data: CampaignApplicableType.Existing,
		label: "Old fans",
	},
];

export const discountOptions = [
	{
		data: "20",
		label: "20 %",
	},
	{
		data: "25",
		label: "25 %",
	},
	{
		data: "30",
		label: "30 %",
	},
];

export const defaultSocialLinks = [
	{
		id: "0",
		title: "Website link",
		url: "",
		provider: "website",
	},
	{
		id: "0",
		title: "Amazon wishlist link",
		url: "",
		provider: "amazon",
	},
	{
		id: "0",
		title: "Instagram link",
		url: "",
		provider: "instagram",
	},
	{
		id: "0",
		title: "Twitter link",
		url: "",
		provider: "twitter",
	},
	{
		id: "0",
		title: "TikTok link",
		url: "",
		provider: "tiktok",
	},
	{
		id: "0",
		title: "Snapchat link",
		url: "",
		provider: "snapchat",
	},
	{
		id: "0",
		title: "YouTube link",
		url: "",
		provider: "youtube",
	},
	{
		id: "0",
		title: "Facebook link",
		url: "",
		provider: "facebook",
	},
	{
		id: "0",
		title: "Reddit link",
		url: "",
		provider: "reddit",
	},
	{
		id: "0",
		title: "Discord server invite link",
		url: "",
		provider: "discord",
	},
	{
		id: "0",
		title: "Twitch link",
		url: "",
		provider: "twitch",
	},
];

export const roleColors = [
	"transparent",
	"#faf290",
	"#fa9b43",
	"#f55d5d",
	"#e53ec6",
	"#e6bfff",
	"#000",
	"#9b9b9b",
	"#d1faaf",
	"#50ddc2",
	"#64c7f9",
	"#484cff",
	"#a854f5",
];

export const roleIcons = [
	{
		name: "icon1",
		width: 18.91,
		height: 29.4,
		icon: require("@assets/images/roles/icon1.png"),
	},
	{
		name: "icon2",
		width: 24.14,
		height: 28.65,
		icon: require("@assets/images/roles/icon2.png"),
	},
	{
		name: "icon3",
		width: 27.13,
		height: 27.22,
		icon: require("@assets/images/roles/icon3.png"),
	},
	{
		name: "icon4",
		width: 29.29,
		height: 25.36,
		icon: require("@assets/images/roles/icon4.png"),
	},
	{
		name: "icon5",
		width: 29.31,
		height: 29.31,
		icon: require("@assets/images/roles/icon5.png"),
	},
	{
		name: "icon6",
		width: 25.96,
		height: 25.96,
		icon: require("@assets/images/roles/icon6.png"),
	},
	{
		name: "icon7",
		width: 27.13,
		height: 27.22,
		icon: require("@assets/images/roles/icon7.png"),
	},
];

export const winnerOptions = [
	{
		data: "1",
		label: "1",
	},
	{
		data: "2",
		label: "2",
	},
	{
		data: "3",
		label: "3",
	},
	{
		data: "4",
		label: "4",
	},
	{
		data: "5",
		label: "5",
	},
	{
		data: "6",
		label: "6",
	},
	{
		data: "7",
		label: "7",
	},
	{
		data: "8",
		label: "8",
	},
	{
		data: "9",
		label: "9",
	},
	{
		data: "10",
		label: "10",
	},
];

export const pageStyleOptions = [
	{ data: SubscriptionTypes.Flat, label: "Subscription" },
	{ data: SubscriptionTypes.Tier, label: "Tiers" },
	// { data: SubscriptionTypes.OneTimePayment, label: "One-time payment" },
];

export const gemOptions = [
	{
		title: "500",
		price: 5,
		// icon: YellowGemSvg,
		icon: require("@assets/images/gems/yellow-gem.png"),
		color: "text-fans-yellow",
	},
	{
		title: "1,000",
		price: 10,
		// icon: PinkGemSvg,
		icon: require("@assets/images/gems/pink-gem.png"),
		color: "text-fans-pink",
	},
	{
		title: "5,000",
		price: 50,
		// icon: BlueGemSvg,
		icon: require("@assets/images/gems/blue-gem.png"),
		color: "text-fans-blue",
	},
	{
		title: "10,000",
		price: 100,
		// icon: GreenGemSvg,
		icon: require("@assets/images/gems/green-gem.png"),
		color: "text-fans-green-second",
	},
];

export const checkoutOptions = [
	// {
	// 	name: "PayPal",
	// 	type: CheckoutType.PayPal,
	// },
	// {
	// 	name: "Stripe",
	// 	type: CheckoutType.Stripe,
	// },
	{
		name: "Credit Card",
		type: CheckoutType.CreditCard,
	},
];

export const defaultSubscriptions = {
	id: "0",
	title: "",
	price: 0,
	currency: "USD",
	bundles: [],
	campaigns: [],
};

export const defaultHighlight = {
	id: "",
	title: "",
	cover: "",
	stories: [],
	profileId: "",
};

export const postPropertyLinks = [
	{
		title: "Who can view",
		stepType: PostStepTypes.ViewSetting,
	},
	{
		title: "Add to category",
		stepType: PostStepTypes.Categories,
	},
	{
		title: "Paid post",
		stepType: PostStepTypes.PaidPost,
	},
	{
		title: "Add poll",
		stepType: PostStepTypes.AddPoll,
	},
	{
		title: "Tag people",
		stepType: PostStepTypes.TagPeople,
	},
	{
		title: "Add giveaway",
		pathname: "/posts/create/giveaway",
		stepType: PostStepTypes.AddGiveaway,
	},
	{
		title: "Add location",
		stepType: PostStepTypes.Location,
	},
	{
		title: "Schedule post",
		stepType: PostStepTypes.Schedule,
	},
	{
		title: "Add fundraiser",
		stepType: PostStepTypes.AddFundraiser,
	},
	{
		title: "Advanced settings",
		stepType: PostStepTypes.AdvancedSettings,
	},
];

const generateSocialMediaUrls = () => {
	return SocialMediaTypes.map((socialMedia) => ({
		id: socialMedia,
		value: "",
		title:
			socialMedia.charAt(0).toUpperCase() +
			socialMedia.slice(1).toLowerCase(),
	}));
};

export const defaultProfileSettings: IProfileSettings = {
	video: {
		timeZone: "Your Default Timezone",
		timeframes: [],
		bufferBetweenCalls: 15,
		sexualContentAllowed: true,
		contentPreferences: [],
		customContentPreferences: "",
		meetingType: VideoCallWays.TwoWay,
		meetingTitle: "Default Meeting Title",
		meetingDescription: "Default Meeting Description",
		notificationNewRequests: true,
		notificationCancellations: true,
		notificationReminders: true,
		notificationsByEmail: true,
		notificationsByPhone: true,
		customVideoOrdersEnabled: false,
		vacationMode: false,
		meetingDurations: [],
		videoCallsEnabled: false,
	},
	cameo: {
		pricesDuration: [],
		contentPreferences: [],
		timeframes: [],
		tos: "",
		requestLimitations: {
			fulFillmentTimeFrame: "",
			numberRequestsType: "",
			numberRequestsValue: 0,
		},
		responseDescription: "",
		uploadPreviews: "",
		notifications: {
			newRequests: false,
			pendingVideos: false,
			completedRequests: false,
			notificationsByPhone: false,
			notificationsByEmail: false,
		},
		customVideoOrdersEnabled: false,
		vacationMode: false,
		vacationModeInterval: "",
		videoCallsEnabled: false,
		sexualContent: false,
		additionalContentPreferences: "",
	},
	fanProfile: {
		bio: "",
		displayName: "",
		socialMedias: generateSocialMediaUrls(),
		theme: "",
	},
};

export const defaultAnalyzeFans: IAnalyzeFans[] = [
	{
		from: 1,
		to: 20,
		fans: 0,
	},
	{
		from: 21,
		to: 40,
		fans: 0,
	},
	{
		from: 41,
		to: 60,
		fans: 0,
	},
	{
		from: 61,
		to: 80,
		fans: 0,
	},
	{
		from: 81,
		to: 100,
		fans: 0,
	},
];

export const badgeTiers: IBadgeTier[] = [
	{
		type: BadgeType.NewFan,
		title: "New Fan",
		description: "Get started with your first purchase",
	},
	{
		type: BadgeType.Enthusiast,
		title: "Enthusiast",
		description: "Total spend reaches",
		price: 50,
	},
	{
		type: BadgeType.BronzeSupporter,
		title: "Bronze Supporter",
		description: "Total spend reaches",
		price: 100,
	},
	{
		type: BadgeType.SilverSponsor,
		title: "Silver Sponsor",
		description: "Total spend reaches",
		price: 250,
	},
	{
		type: BadgeType.GoldPatron,
		title: "Gold Patron",
		description: "Total spend reaches",
		price: 500,
	},
	{
		type: BadgeType.RubyGuardian,
		title: "Ruby Guardian",
		description: "Total spend reaches",
		price: 1000,
	},
	{
		type: BadgeType.EmeraldAmbassador,
		title: "Emerald Ambassador",
		description: "Total spend reaches",
		price: 2500,
	},
	{
		type: BadgeType.PlatinumPartner,
		title: "Platinum Partner",
		description: "Total spend reaches",
		price: 5000,
	},
	{
		type: BadgeType.SapphireChampion,
		title: "Sapphire Champion",
		description: "Total spend reaches",
		price: 7500,
	},
	{
		type: BadgeType.DiamondDevotee,
		title: "Diamond Devotee",
		description: "Total spend reaches",
		price: 10000,
	},
];

export const createLinkOfferLimitOptions: IFypDropdownItem[] = [
	{
		data: "",
		label: "Not Limit",
	},
	{
		data: "5",
		label: "5 subscribers",
	},
	{
		data: "10",
		label: "10 subscribers",
	},
	{
		data: "25",
		label: "25 subscribers",
	},
	{
		data: "50",
		label: "50 subscribers",
	},
	{
		data: "100",
		label: "100 subscribers",
	},
	{
		data: "250",
		label: "250 subscribers",
	},
	{
		data: "500",
		label: "500 subscribers",
	},
	{
		data: "1000",
		label: "1,000 subscribers",
	},
	{
		data: "2500",
		label: "2,500 subscribers",
	},
	{
		data: "5000",
		label: "5,000 subscribers",
	},
	{
		data: "10000",
		label: "10,000 subscribers",
	},
];

export const createLinkDurationOptions: IFypDropdownItem[] = [
	{
		data: "1",
		label: "1 month",
	},
	{
		data: "3",
		label: "3 months",
	},
	{
		data: "6",
		label: "6 months",
	},
];

export const documentTypes: IFypDropdownItem[] = [
	{
		data: "Passport",
		label: "Passport",
	},
	{
		data: "ID Card",
		label: "ID Card",
	},
	{
		data: "Drivers License",
		label: "Drivers License",
	},
];

export const emptyProfileData: IProfile = {
	id: "0",
	userId: "0",
	displayName: "",
	migrationLink: "",
	profileLink: "",
	flags: 0,
	bio: "",
	cover: [],
	previews: [],
	isNSFW: null,
	subscriptionType: SubscriptionTypes.Flat,
	disabled: false,
	location: "",
	imageCount: 0,
	videoCount: 0,
	subscriptionCount: 0,
	commentCount: 0,
	likeCount: 0,
	socialLinks: [],
	subscriptions: [],
	tiers: [],
	roles: [],
	categories: [],
	stories: [],
};

export const emptyPostData: IPost = {
	id: "0",
	profileId: "0",
	profile: emptyProfileData,
	title: "",
	type: PostType.Audio,
	caption: "",
	thumb: {
		id: "0",
		url: "",
	},
	medias: [],
	isArchived: false,
	isHidden: false,
	isPaidPost: false,
	commentCount: 0,
	likeCount: 0,
	createdAt: "2023-09-05T23:39:10.318Z",
	updatedAt: "2023-09-05T23:39:10.318Z",
	bookmarkCount: 0,
	taggedPeoples: [],
	isPaidOut: false,
	isPinned: false,
	isSelf: true,
	isExclusive: false,
	isPosted: true,
};

export const allowedAudioFileTypes = [
	"audio/mpeg",
	"video/mp4",
	"audio/wav",
	"audio/aac",
	"audio/flac",
];

export const videoCallPriceOptions = [
	{
		data: "5",
		label: "5 minutes",
	},
	{
		data: "10",
		label: "10 minutes",
	},
	{
		data: "15",
		label: "15 minutes",
	},
	{
		data: "20",
		label: "20 minutes",
	},
	{
		data: "30",
		label: "30 minutes",
	},
	{
		data: "45",
		label: "45 minutes",
	},
	{
		data: "60",
		label: "1 hour",
	},
	{
		data: "75",
		label: "1:15 hours",
	},
	{
		data: "90",
		label: "1:30 hours",
	},
	{
		data: "105",
		label: "1:45 hours",
	},
	{
		data: "120",
		label: "2 hours",
	},
];
