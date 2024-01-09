import { defaultProfileStateData } from "@context/state/profileState";
import { IProfile, IStory } from "@usertypes/types";

export interface IStoryState {
	profilePreview: IProfile;
	highlightStory: {
		profile?: IProfile;
		stories: IStory[];
	};
	storiesFeed: IProfile[];
}

export const storyInitialState: IStoryState = {
	highlightStory: {
		stories: [],
	},
	profilePreview: defaultProfileStateData,
	storiesFeed: [],
};
