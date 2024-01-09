import { defaultProfileStateData } from "@context/state/profileState";
import { SubscribeActionType } from "@usertypes/commonEnums";
import {
	IMedia,
	IPost,
	IProfile,
	BeforeInstallPromptEvent,
} from "@usertypes/types";

export interface ISendTipModal {
	visible: boolean;
	creator?: Partial<IProfile> | null;
}

export interface ISendTipSuccessModal {
	visible: boolean;
	creator?: Partial<IProfile> | null;
	tip: string;
	message: string;
}

export interface ISubscribeModal {
	visible: boolean;
	creator: IProfile;
	subscribeActionType: SubscribeActionType;
	bundleId?: string;
	subscribeTierId: string;
	defaultTab?: "start" | "form";
	post?: IPost;
	onSuccess?: () => void;
	paidPostCallback?: (postId: string) => void;
	checkAccessSubscribedUser?: () => Promise<void>;
}

export interface ILayoutSidebar {
	collapsedTabMenu: boolean;
	collapsesSettings: boolean;
}

export interface ICommonState {
	suggestedCreators: IProfile[];
	openSidebar: boolean;
	openNewPostTypesModal: boolean;
	sendTipModal: ISendTipModal;
	sendTipSuccessModal: ISendTipSuccessModal;
	subscribeModal: ISubscribeModal;
	layoutSidebar: ILayoutSidebar;
	creatorUsername: string;
	openCreateNewReferralLinkModal: boolean;
	openEditReferralLinkModal: boolean;
	openViewAnalyticsModal: boolean;
	playingVideoId: string;
	postMedias: IMedia[];
	pwaPromptEvent?: BeforeInstallPromptEvent;
	isPwaInstalled: boolean;
	showPWAInstallPrompt: boolean;
}

export const commonInitialState: ICommonState = {
	layoutSidebar: {
		collapsedTabMenu: false,
		collapsesSettings: true,
	},
	suggestedCreators: [],
	openSidebar: false,
	sendTipModal: {
		visible: false,
	},
	openNewPostTypesModal: false,
	sendTipSuccessModal: {
		visible: false,
		tip: "0",
		message: "",
	},
	subscribeModal: {
		visible: false,
		subscribeActionType: SubscribeActionType.Subscribe,
		subscribeTierId: "0",
		creator: defaultProfileStateData,
		post: undefined,
	},
	creatorUsername: "",
	playingVideoId: "",
	openCreateNewReferralLinkModal: false,
	openEditReferralLinkModal: false,
	openViewAnalyticsModal: false,
	postMedias: [],
	pwaPromptEvent: undefined,
	isPwaInstalled: false,
	showPWAInstallPrompt: false,
};
