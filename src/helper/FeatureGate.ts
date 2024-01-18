import { PRODUCTION_MODE } from "@env";

export interface IFeatureGateData {
	/**
	 * Description of the feature gate
	 */
	description: string;

	/**
	 * If true, the feature gate is enabled in production
	 */
	production: boolean;
}

export const featureGates = {
	"2023_10-chat": {
		description: "Chat feature",
		production: true,
	},
	"2023_10-search": {
		description: "Search feature",
		production: false,
	},
	"2023_10-swan-job-2": {
		description: "Prince 2.0 Job",
		production: false,
	},
	"2023_10-video-calls": {
		description: "Video calls feature",
		production: false,
	},
	"2023_11-custom-videos": {
		description: "Custom videos feature",
		production: false,
	},
	"2023_11-chat-room-prototype": {
		description: "Chat Room Prototype",
		production: false,
	},
	"2023_12-fans-profile": {
		description: "Fans profile",
		production: false,
	},
	"2023_10-random-future-stuff": {
		description: "Random future stuff",
		production: false,
	},
	"2023_10-discord-integration": {
		description: "Discord integration",
		production: false,
	},
	"2023_10-user-lists": {
		description: "User lists",
		production: false,
	},
	"2023_11-referral-links": {
		description: "Referral links",
		production: true,
	},
	"2023_12-fans-referral": {
		description: "Fans referral",
		production: false,
	},
	"2023_11-twitter-oauth2": {
		description: "Twitter OAuth2 integration",
		production: false,
	},
	"2023_11-notes": {
		description: "Notes feature",
		production: false,
	},
	"2023_11-chat-selections": {
		description: "Chat selections",
		production: false,
	},
	"2023_11-story_share_options": {
		description: "Story share options",
		production: false,
	},
	"2023_11-mobile_header_members_view": {
		description: "Members viewing option in profile header",
		production: false,
	},
	"2023_12-language-options": {
		description: "Language dropdown select in mobile sidebar",
		production: false,
	},
	"2023_12-get-app-button": {
		description: "Get app button in sidebar",
		production: false,
	},
	"2023_12-gems-new-ui": {
		description: "Gems New UI in job 2.0.2",
		production: false,
	},
	"2023_12-edit-the-edit-profile-page": {
		description: "Edit the edit profile page in job 2.0.2",
		production: false,
	},
	"2023_12-pwa-install": {
		description: "PWA install button in sidebar",
		production: false,
	},
	"2023_12-shop-tab-on-creators-profile": {
		description: "New shop tab on creators profile page",
		production: false,
	},
	"2023_12-purchased-posts": {
		description: "Purchased posts navigation",
		production: false,
	},
	"2023_12-fundraiser-post-card": {
		description: "Fundraiser content in post card",
		production: false,
	},
	"2023_12-poll-post-card": {
		description: "Poll content in post card",
		production: false,
	},
	"2023_12-giveaway-post-card": {
		description: "Giveaway content in post card",
		production: false,
	},
	"2023_12-video-call": {
		description: "Frontend for Video Call Page",
		production: false,
	},
	"2023_12-custom-profile-background": {
		description: "Custom profile background in edit profile page",
		production: false,
	},
	"2023_12-who-can-view-setting-post": {
		description: "Who can view setting in post form",
		production: false,
	},
	"2023_12-get-gems-stripe-method": {
		description: "Checkout methods in get gems screen",
		production: false,
	},
	"2024_01-new-vault-design": {
		description: "New vault screen",
		production: false,
	},
	"2024_01-new-exclusive-post": {
		description: "New exclusive post form",
		production: false,
	},
} satisfies Record<string, IFeatureGateData>; // Note, it's year_month-feature-name, not year_month_feature-name!!!

export type ValidFeatureGateNames = keyof typeof featureGates;

export const getInitialFeatureGates = (
	isProduction: boolean = PRODUCTION_MODE === "1",
): Set<ValidFeatureGateNames> => {
	const result = new Set<ValidFeatureGateNames>();

	for (const featureGateName in featureGates) {
		const featureGate =
			featureGates[featureGateName as ValidFeatureGateNames];
		if (isProduction && !featureGate.production) continue;

		result.add(featureGateName as ValidFeatureGateNames);
	}

	return result;
};
