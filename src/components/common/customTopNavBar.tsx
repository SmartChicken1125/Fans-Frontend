import {
	ArchivedPostSvg,
	ChevronLeftSvg,
	CloseSvg,
	FundSvg,
	ImageSvg,
	MusicSvg,
	PollSvg,
	StorySvg,
	TextSvg,
	ThreeDotsSvg,
	VideoCallSvg,
} from "@assets/svgs/common";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { FypText, FypSvg } from "./base";

interface Props {
	title: string;
	onClickLeft: () => void;
	onClickRight?: () => void;
	rightLabel?: string;
	rightLabelColor?: string;
	titleIcon?:
		| "photo"
		| "audio"
		| "poll"
		| "text"
		| "fundraiser"
		| "video"
		| "archived-post"
		| "story";
	leftIcon?: "close";
	rightIcon?: "menu";
	hideLeftIcon?: boolean;
	style?: string;
	darkMode?: boolean;
	loading?: boolean;
}

const CustomTopNavBar: FC<Props> = (props) => {
	const {
		title,
		onClickLeft,
		onClickRight,
		rightLabel,
		rightLabelColor,
		titleIcon,
		leftIcon,
		rightIcon,
		hideLeftIcon,
		style,
		darkMode = false,
		loading,
	} = props;

	const getTitleIcon = () => {
		switch (titleIcon) {
			case "photo":
				return;
				<FypSvg
					svg={ImageSvg}
					width={13.73}
					height={13.73}
					color="fans-black dark:fans-white"
				/>;
			case "video":
				return;
				<FypSvg
					svg={VideoCallSvg}
					width={15.07}
					height={13.98}
					color="fans-black dark:fans-white"
				/>;
			case "audio":
				return (
					<FypSvg
						svg={MusicSvg}
						width={13.18}
						height={14.86}
						color="fans-black dark:fans-white"
					/>
				);
			case "poll":
				return (
					<FypSvg
						svg={PollSvg}
						width={15.1}
						height={15.1}
						color="fans-black dark:fans-white"
					/>
				);
			case "text":
				return (
					<FypSvg
						svg={TextSvg}
						width={18.81}
						height={13.58}
						color="fans-black dark:fans-white"
					/>
				);
			case "fundraiser":
				return (
					<FypSvg
						svg={FundSvg}
						width={9.8}
						height={13.83}
						color="fans-black dark:fans-white"
					/>
				);
			case "archived-post":
				return (
					<FypSvg
						svg={ArchivedPostSvg}
						width={15.15}
						height={15.24}
						color="fans-black dark:fans-white"
					/>
				);
			case "story":
				return (
					<FypSvg
						svg={StorySvg}
						width={14.58}
						height={14.55}
						color="fans-black dark:fans-white"
					/>
				);
			default:
				return null;
		}
	};

	const getLeftIcon = () => {
		if (hideLeftIcon) {
			return null;
		} else {
			switch (leftIcon) {
				case "close":
					return (
						<FypSvg
							svg={CloseSvg}
							width={12.83}
							height={12.83}
							color={
								darkMode
									? "fans-white"
									: "fans-grey-70 dark:fans-grey-b1"
							}
						/>
					);
				default:
					return (
						<FypSvg
							svg={ChevronLeftSvg}
							width={8}
							height={14.6}
							color={
								darkMode
									? "fans-white"
									: "fans-grey-70 dark:fans-grey-b1"
							}
						/>
					);
			}
		}
	};

	return (
		<View
			style={tw.style(
				"relative py-3 flex justify-center border-b md:pb-[38px] md:pt-[35px]",
				"border-fans-grey dark:border-fans-grey-43",
				style,
				darkMode && "border-[#2E2E2E]",
			)}
		>
			<Pressable
				style={[
					tw.style(
						"absolute left-[18px] w-6 h-6 flex items-center justify-center",
					),
					{
						transform: [{ translateX: -10 }],
					},
				]}
				onPress={onClickLeft}
			>
				{getLeftIcon()}
			</Pressable>

			<View
				style={tw.style("mx-auto flex-row items-center gap-x-[10px]")}
			>
				{getTitleIcon()}
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style(
						"text-[19px] leading-[26px] md:text-[23px] md:leading-[31px] text-fans-black dark:text-fans-white",
						darkMode && "text-fans-white",
					)}
				>
					{title}
				</FypText>
			</View>
			<Pressable
				style={tw.style(
					"absolute right-[18px] flex-row items-center",
					!onClickRight && "hidden",
				)}
				onPress={onClickRight}
			>
				<ActivityIndicator
					animating={!!loading}
					color="#a854f5"
					size={16}
				/>
				<FypText
					style={tw.style(
						"text-[17px] leading-[22px] font-semibold md:text-[19px] md:leading-[26px] ml-2",
						"text-fans-purple",
						rightLabelColor && `text-${rightLabelColor}`,
					)}
				>
					{rightLabel}
				</FypText>
			</Pressable>
			{rightIcon === "menu" ? (
				<Pressable
					style={tw.style("absolute right-[18px] h-5 justify-center")}
					onPress={onClickRight}
				>
					<ThreeDotsSvg width={17.4} height={3.55} color="#000" />
				</Pressable>
			) : null}
		</View>
	);
};

export default CustomTopNavBar;
