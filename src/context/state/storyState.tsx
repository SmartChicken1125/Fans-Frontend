import { defaultProfileStateData } from "@context/state/profileState";
import { IProfile, IStory } from "@usertypes/types";

export interface IStoryState {
	profilePreview: IProfile;
	highlightStory: {
		profile?: IProfile;
		stories: IStory[];
	};
	storiesFeed: IProfile[];
	modal: boolean;
}

export const storyInitialState: IStoryState = {
	highlightStory: {
		stories: [],
	},
	profilePreview: defaultProfileStateData,
	storiesFeed: [],
	modal: false,
};
