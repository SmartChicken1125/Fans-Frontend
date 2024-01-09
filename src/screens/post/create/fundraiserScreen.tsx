import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { FundraiserForm } from "@components/posts/share";
import {
	defaultFundraiserFormData,
	defaultPostFormData,
} from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import { createPost } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType, PostType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IDateRange, IFundraiserForm, IPickerMedia } from "@usertypes/types";
import useUploadFiles from "@utils/useUploadFile";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const NewFundraiserPostScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Fundraiser">,
) => {
	const { navigation } = props;
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { type, fundraiser } = state.posts.postForm;
	const { uploadFiles } = useUploadFiles();

	const [formData, setFormData] = useState<IFundraiserForm>(
		defaultFundraiserFormData,
	);

	const [isSubmitted, setIsSubmitted] = useState(false);

	const onChangeField = (
		name: string,
		val: string | boolean | IPickerMedia,
	) => {
		setFormData({
			...formData,
			[name]: val,
		});
	};

	const handleChangeDuration = (value: IDateRange) => {
		setFormData({
			...formData,
			...value,
		});
	};

	const handleCreatePost = async () => {
		setIsSubmitted(true);
		if (
			formData.title === "" ||
			formData.price === "" ||
			formData.timezone === ""
		) {
			return;
		}
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

		const price = parseFloat(formData.price);
		if (isNaN(price) || price <= 0) {
			Toast.show({
				type: "error",
				text1: "Invalid price",
			});
			return;
		}

		const postBody = {
			title: "",
			type: PostType.Fundraiser,
			caption: "",
			fundraiser: {
				...formData,
				price,
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

	const handleShare = () => {
		if (type === PostType.Fundraiser) {
			handleCreatePost();
		} else {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					fundraiser: formData,
				},
			});
			navigation.goBack();
		}
	};

	useEffect(() => {
		if (fundraiser) {
			setFormData(fundraiser);
		}
	}, [fundraiser]);

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
				onClickRight={handleShare}
				titleIcon="fundraiser"
				rightLabel="Share"
			/>
			<ScrollView style={{ paddingTop: 24 }}>
				<FundraiserForm
					formData={formData}
					isSubmitted={isSubmitted}
					handleChangeForm={onChangeField}
					handleChangeDuration={handleChangeDuration}
					handleCacheData={() => {}}
					handleAddFundraiser={
						type === PostType.Fundraiser ? undefined : handleShare
					}
				/>
			</ScrollView>
		</FansView>
	);
};

export default NewFundraiserPostScreen;
