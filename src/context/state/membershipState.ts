import { IProfile } from "@usertypes/types";

export const modalInitialState = {
	profiles: [] as IProfile[],
};

export type IMembershipState = typeof modalInitialState;
