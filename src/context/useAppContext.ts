import React, { useContext } from "react";
import { AppContext, IAppContext } from "./appContext";
import { CommonActionType } from "./reducer/commonReducer";
import { ModalActionType } from "./reducer/modalReducer";
import { PostsActionType } from "./reducer/postsReducer";
import { ProfileActionType } from "./reducer/profileReducer";
import { StoryActionType } from "./reducer/storyReducer";
import { UserActionType } from "./reducer/userReducer";

export const useAppContext = (): IAppContext => {
	const ctx = useContext(AppContext);
	if (!ctx) {
		throw new Error(
			"useAppContext must be used within a AppContext.Provider",
		);
	}
	return ctx;
};

export {
	CommonActionType,
	ProfileActionType,
	PostsActionType,
	ModalActionType,
	UserActionType,
	StoryActionType,
};
