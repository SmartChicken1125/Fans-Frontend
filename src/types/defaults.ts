import { SubscriptionTypes } from "./commonEnums";
import { IProfile } from "./types";

export const defaultProfile: IProfile = {
	id: "0",
	userId: "0",
	displayName: "",
	migrationLink: "",
	profileLink: "",
	flags: 0,
	bio: "",
	cover: [],
	isNSFW: false,
	subscriptionType: SubscriptionTypes.Flat,
	disabled: false,
	location: "",
	socialLinks: [],
	subscriptions: [],
	tiers: [],
	commentCount: 0,
	likeCount: 0,
	imageCount: 0,
	videoCount: 0,
	subscriptionCount: 0,
	previews: [],
	roles: [],
	categories: [],
	stories: [],
	isDisplayShop: false,
	review: { score: 0, total: 0 },
};
