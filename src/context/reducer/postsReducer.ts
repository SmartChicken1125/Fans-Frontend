import { defaultPostFormData } from "@constants/defaultFormData";
import {
	ILiveModal,
	IMediaModal,
	IPostModal,
	IPostsState,
	IStoryModal,
} from "@context/state/postsState";
import { ICategory, IPost, IPostForm } from "@usertypes/types";

export enum PostsActionType {
	updateCategories,
	initPostForm,
	updatePostForm,
	updatePosts,
	updatePost,
	updatePostModal,
	updateStoryModal,
	updateLiveModal,
	updateMediaModal,
}

export type PostsAction =
	| { type: PostsActionType.updateCategories; data: ICategory[] }
	| { type: PostsActionType.initPostForm; data: IPostForm }
	| { type: PostsActionType.updatePostForm; data: Partial<IPostForm> }
	| { type: PostsActionType.updatePosts; data: IPost[] }
	| { type: PostsActionType.updatePost; data: { post: IPost } }
	| { type: PostsActionType.updatePostModal; data: Partial<IPostModal> }
	| { type: PostsActionType.updateStoryModal; data: Partial<IStoryModal> }
	| { type: PostsActionType.updateLiveModal; data: Partial<ILiveModal> }
	| { type: PostsActionType.updateMediaModal; data: Partial<IMediaModal> };

export function PostReducer(
	state: IPostsState,
	action: PostsAction,
): IPostsState {
	const { type, data } = action;

	switch (type) {
		case PostsActionType.updateCategories:
			return {
				...state,
				categories: data,
			};

		case PostsActionType.initPostForm:
			return {
				...state,
				postForm: defaultPostFormData,
			};
		case PostsActionType.updatePostForm:
			return {
				...state,
				postForm: {
					...state.postForm,
					...data,
				},
			};
		case PostsActionType.updatePosts:
			return {
				...state,
				posts: data,
			};
		case PostsActionType.updatePost:
			return {
				...state,
				posts: state.posts.map((p) =>
					p.id === data.post.id
						? {
								...p,
								...data.post,
						  }
						: p,
				),
			};
		case PostsActionType.updatePostModal:
			return {
				...state,
				modal: { ...state.modal, ...data },
			};
		case PostsActionType.updateStoryModal:
			return {
				...state,
				storyModal: { ...state.storyModal, ...data },
			};
		case PostsActionType.updateLiveModal:
			return {
				...state,
				liveModal: { ...state.liveModal, ...data },
			};
		case PostsActionType.updateMediaModal:
			return {
				...state,
				mediaModal: { ...state.mediaModal, ...data },
			};
		default:
			return state;
	}
}
