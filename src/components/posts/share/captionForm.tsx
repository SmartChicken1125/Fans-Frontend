import { ChevronRightSvg } from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypNullableView, FypSvg } from "@components/common/base";
import { FansText, FansView } from "@components/controls";
import { postPropertyLinks } from "@constants/common";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { PostStepTypes, PostType, ResizeMode } from "@usertypes/commonEnums";
import { IPostForm, IPostPropertyLink } from "@usertypes/types";
import { Video } from "expo-av";
import React, { FC, useEffect, useState } from "react";
import { Image } from "react-native";

interface LinkRowProps {
	title: string;
	onPress: () => void;
}

export const LinkRow: FC<LinkRowProps> = (props) => {
	const { title, onPress } = props;

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			justifyContent="between"
			padding={{ y: 14 }}
			pressableProps={{
				onPress: onPress,
			}}
		>
			<FansText
				fontSize={18}
				lineHeight={24}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{title}
			</FansText>
			<FypSvg
				svg={ChevronRightSvg}
				width={8.14}
				height={14.28}
				color="fans-grey-70 dark:fans-grey-b1"
			/>
		</FansView>
	);
};

interface Props {
	data: IPostForm;
	caption: string;
	onChangeCaption: (val: string) => void;
	onNavigateLink: (link: IPostPropertyLink) => void;
}

const CaptionForm: FC<Props> = (props) => {
	const { data, caption, onChangeCaption, onNavigateLink } = props;
	const featureGates = useFeatureGates();
	const [value, setValue] = useState("");

	const getPropertyLinks = () => {
		let _postPropertyLinks = postPropertyLinks;
		if (!featureGates.has("2023_12-poll-post-card")) {
			_postPropertyLinks = _postPropertyLinks.filter(
				(el) => el.stepType !== PostStepTypes.AddPoll,
			);
		}
		if (!featureGates.has("2023_12-fundraiser-post-card")) {
			_postPropertyLinks = _postPropertyLinks.filter(
				(el) => el.stepType !== PostStepTypes.AddFundraiser,
			);
		}
		if (!featureGates.has("2023_12-giveaway-post-card")) {
			_postPropertyLinks = _postPropertyLinks.filter(
				(el) => el.stepType !== PostStepTypes.AddGiveaway,
			);
		}
		switch (data.type) {
			case PostType.Text:
				return _postPropertyLinks.filter(
					(link) =>
						![
							PostStepTypes.TagPeople,
							PostStepTypes.Location,
							PostStepTypes.PaidPost,
						].includes(link.stepType),
				);
			case PostType.Audio:
				return _postPropertyLinks.filter(
					(link) =>
						![
							PostStepTypes.PaidPost,
							PostStepTypes.TagPeople,
						].includes(link.stepType),
				);
			default:
				return _postPropertyLinks;
		}
	};

	useEffect(() => {
		setValue(caption);
	}, [caption]);

	return (
		<FansView>
			<FansView
				style={tw.style(
					"flex-row justify-center mb-[14px] md:hidden",
					data.type === PostType.Text && "hidden",
				)}
			>
				<FypNullableView visible={!!data.thumb?.uri}>
					<Image
						source={{
							uri: cdnURL(data.thumb?.uri),
						}}
						style={tw.style("w-[95px] h-[95px] rounded-[7px]")}
					/>
				</FypNullableView>
				<FypNullableView
					visible={
						!data.thumb?.uri &&
						data.type === PostType.Video &&
						data.medias.length > 0
					}
				>
					<FansView width={95} height={95}>
						<Video
							source={{
								uri: cdnURL(data.medias[0]?.uri) ?? "",
							}}
							resizeMode={ResizeMode.COVER}
							style={tw.style("w-full h-full")}
						/>
					</FansView>
				</FypNullableView>
			</FansView>

			<FansView margin={{ b: 24 }}>
				{data.type === PostType.Text ? (
					<FansView
						style={tw.style(
							"p-6 rounded-[15px] bg-fans-purple-light",
							"bg-fans-purple-f6 dark:bg-fans-purple-47",
						)}
					>
						<FansText
							fontSize={16}
							lineHeight={21}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							{data.caption}
						</FansText>
					</FansView>
				) : (
					<RoundTextInput
						value={value}
						onChangeText={(val) => setValue(val)}
						placeholder="Write a caption..."
						multiline
						numberOfLines={4}
						maxLength={1000}
						customStyles="py-3 px-5 rounded-[7px] h-[128px]"
						onPointerLeave={() => onChangeCaption(value)}
					/>
				)}

				{/* <View style={tw.style("w-[172px] mx-auto mt-[14px]")}>
						<RoundButton
							variant={RoundButtonType.OUTLINE_PRIMARY}
							icon={() => (
								<CaptionSvg
									width={19.75}
									height={12.35}
									color="#a854f5"
								/>
							)}
						>
							AI Caption
						</RoundButton>
					</View> */}
			</FansView>

			<FansView gap={4}>
				{getPropertyLinks().map((link) => (
					<LinkRow
						key={link.title}
						title={link.title}
						onPress={() => {
							onChangeCaption(value);
							onNavigateLink(link);
						}}
					/>
				))}
			</FansView>
		</FansView>
	);
};

export default CaptionForm;
