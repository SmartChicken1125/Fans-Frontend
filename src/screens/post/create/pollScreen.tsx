import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { PollForm } from "@components/posts/share";
import {
	defaultPollFormData,
	defaultPostFormData,
} from "@constants/defaultFormData";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import { createPost } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostType, MediaType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IPollForm, IPickerMedia, IDateRange } from "@usertypes/types";
import useUploadFiles from "@utils/useUploadFile";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const PollScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Poll">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const { state, dispatch } = useAppContext();
	const { type } = state.posts.postForm;
	const { uploadFiles } = useUploadFiles();

	const [formData, setFormData] = useState<IPollForm>(defaultPollFormData);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [publicResult, setPublicResult] = useState(false);
	const [voteType, setVoteType] = useState("all");

	const handleAddAnswer = () => {
		setFormData({
			...formData,
			answers: [...formData.answers, ""],
		});
	};

	const onChangeField = (
		name: string,
		val: string | boolean | IPickerMedia,
	) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const onChangeAnswer = (val: string, index: number) => {
		const answers = formData.answers.map((answer, i) =>
			i === index ? val : answer,
		);
		setFormData({
			...formData,
			answers: answers,
		});
	};

	const onDeleteAnswer = (index: number) => {
		setFormData({
			...formData,
			answers: formData.answers.filter((el, i) => i !== index),
		});
	};

	const handleChangeDuration = (value: IDateRange) => {
		setFormData({
			...formData,
			...value,
		});
	};

	const handleCreatePost = async () => {
		dispatch.setShowLoading();
		let coverImgId = "";
		if (formData.cover && formData.cover.uri !== "") {
			const uploaded = await uploadFiles(
				formData.cover
					? [{ uri: formData.cover.uri, type: MediaType.Image }]
					: [],
			);
			if (uploaded.ok) {
				coverImgId = uploaded.data[0].id;
			} else {
				Toast.show({
					type: "error",
					text1: uploaded.error?.message ?? "Failed to upload files",
				});
			}
		}

		const { cover, ..._formData } = formData;
		const postBody = {
			title: "",
			type: PostType.Poll,
			caption: "",
			poll: {
				..._formData,
				thumbId: coverImgId,
				startDate: moment(formData.startDate)
					.utcOffset("+000", true)
					.format(),
				endDate: moment(formData.endDate)
					.utcOffset("+000", true)
					.format(),
			},
		};
		const resp = await createPost(postBody);
		dispatch.setHideLoading();
		dispatch.setPosts({
			type: PostsActionType.initPostForm,
			data: defaultPostFormData,
		});
		if (resp.ok) {
			dispatch.setPosts({
				type: PostsActionType.updateLiveModal,
				data: {
					visible: true,
					postId: resp.data.id,
				},
			});
			router.push({
				pathname: "profile",
				params: { screen: "Profile" },
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const onSave = async () => {
		setIsSubmitted(true);
		if (formData.question === "") {
			return;
		}
		if (type === PostType.Poll) {
			handleCreatePost();
		} else {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					poll: formData,
				},
			});
			navigation.navigate("Caption");
		}
	};

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="New post"
				onClickLeft={() => navigation.goBack()}
				onClickRight={onSave}
				titleIcon="poll"
				rightLabel="Share"
			/>
			<ScrollView style={tw.style("pt-6")}>
				<PollForm
					formData={formData}
					handleAddAnswer={handleAddAnswer}
					handleAddPoll={type === PostType.Poll ? undefined : onSave}
					onChangeField={onChangeField}
					isSubmitted={isSubmitted}
					onDeleteAnswer={onDeleteAnswer}
					onChangeAnswer={onChangeAnswer}
					voteType={voteType}
					onChangeVoteType={(val) => setVoteType(val)}
					publicResult={publicResult}
					onChangePublicResult={(val) => setPublicResult(val)}
					handleChangeDuration={handleChangeDuration}
					handleCacheData={() => {}}
				/>
			</ScrollView>
		</FansView>
	);
};

export default PollScreen;
