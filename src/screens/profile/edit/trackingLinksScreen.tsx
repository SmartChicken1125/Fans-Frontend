import {
	PlusSvg,
	SortDescSvg,
	SortAscSvg,
	CopyLinkSvg,
	CopySvg,
	TrashSvg,
	CalendarSvg,
	UserSvg,
	CursorSvg,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypSvg } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import SearchTextInput from "@components/common/searchTextInput";
import {
	FansView,
	FansDivider,
	FansSvg,
	FansGap,
	FansIconButton,
	FansText,
} from "@components/controls";
import { CreateLinkModal } from "@components/profiles";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import {
	TextAlignStyle,
	ColorStyle1,
	FontFamilyStyle,
} from "@usertypes/styles";
import React, { FC, useState } from "react";
import { ScrollView } from "react-native";
import Animated, { PinwheelIn, PinwheelOut } from "react-native-reanimated";

interface TrackingLinkPropertyProps {
	title: string;
	value: string;
	icon: React.ReactNode;
}

export const TrackingLinkProperty: FC<TrackingLinkPropertyProps> = (props) => {
	const { title, value, icon } = props;
	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			justifyContent="between"
		>
			<FansView flexDirection="row" alignItems="center">
				<FansView
					width={18}
					margin={{ r: 8 }}
					justifyContent="center"
					alignItems="center"
				>
					{icon}
				</FansView>
				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"font-medium text-fans-grey-70 dark:text-fans-grey-b1",
					)}
				>
					{title}
				</FansText>
			</FansView>
			<FansText
				fontSize={15}
				lineHeight={20}
				style={tw.style(
					"font-semibold text-fans-black dark:text-fans-white",
				)}
			>
				{value}
			</FansText>
		</FansView>
	);
};

export const TrackingLink: FC = () => {
	return (
		<FansView
			borderRadius={15}
			padding={16}
			style={tw.style(
				"border border-fans-grey-f0 dark:border-fans-grey-43",
			)}
		>
			<FansView
				borderRadius={42}
				height={42}
				alignItems="center"
				padding={4}
				flexDirection="row"
				margin={{ b: 20 }}
				style={tw.style(
					"border border-fans-grey-de dark:border-fans-grey-50",
				)}
			>
				<FansView
					width={34}
					height={34}
					background={ColorStyle1.Purple}
					borderRadius={34}
					alignItems="center"
					justifyContent="center"
					margin={{ r: 8 }}
				>
					<CopyLinkSvg size={17.7} color="#fff" />
				</FansView>
				<FansView flex="1">
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						fyp.fans/henry/1234
					</FansText>
				</FansView>
				<FansView gap={7} flexDirection="row">
					<FansIconButton
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					>
						<FypSvg
							svg={CopySvg}
							width={16.3}
							height={16.3}
							color="fans-black dakr:fans-white"
						/>
					</FansIconButton>
					<FansIconButton
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					>
						<TrashSvg size={15} color="#eb2121" />
					</FansIconButton>
				</FansView>
			</FansView>

			<FansView gap={10}>
				<TrackingLinkProperty
					title="DATE Created"
					value="OCT 3, 2023"
					icon={<CalendarSvg size={18} color="#707070" />}
				/>
				<FansDivider color="fans-grey-f0" />
				<TrackingLinkProperty
					title="SUBSCRIBERS"
					value="590"
					icon={
						<UserSvg width={15.43} height={15.71} color="#707070" />
					}
				/>
				<FansDivider color="fans-grey-f0" />
				<TrackingLinkProperty
					title="CLICKS"
					value="1750"
					icon={<CursorSvg size={16} color="#707070" />}
				/>
			</FansView>
		</FansView>
	);
};

const TrackingLinksScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "TrackingLinks">,
) => {
	const { navigation } = props;
	const [openLinkModal, setOpenLinkModal] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");

	const handlePressSort = () => {
		setOrderBy(orderBy === "asc" ? "desc" : "asc");
	};

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<CustomTopNavBar
							title="Tracking links"
							onClickLeft={() => navigation.goBack()}
						/>
						<FansView padding={{ x: 18, t: 24 }}>
							<FansText
								fontSize={16}
								lineHeight={21}
								style={tw.style(
									"mb-11",
									"text-center",
									"text-fans-black dark:text-fans-white",
								)}
							>
								Create and share separate links for your
								campaigns
							</FansText>
							<RoundButton
								variant={RoundButtonType.OUTLINE_PRIMARY}
								onPress={() => setOpenLinkModal(true)}
							>
								<FansSvg
									svg={PlusSvg}
									size={12.7}
									color="#a854f5"
									style={tw.style("mr-2.5")}
								/>
								Craete new tracking link
							</RoundButton>

							<FansView margin={{ t: 24, b: 24 }}>
								<SearchTextInput
									value={searchText}
									onChangeText={setSearchText}
								/>
							</FansView>
							<FansView
								touchableOpacityProps={{
									onPress: handlePressSort,
								}}
								flexDirection="row"
								margin={{ b: 28 }}
							>
								<FypSvg
									width={16.76}
									height={14.05}
									svg={
										orderBy === "asc"
											? SortAscSvg
											: SortDescSvg
									}
									color="fans-grey-70 dark:fans-grey-b1"
								/>
								<FansGap width={13.2} />
								<Animated.View
									entering={PinwheelIn}
									exiting={PinwheelOut}
								>
									<FansText
										fontFamily="inter-medium"
										fontSize={17}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										{orderBy === "asc"
											? "Newest first"
											: "Oldest first"}
									</FansText>
								</Animated.View>
							</FansView>

							<FansView gap={10}>
								<TrackingLink />
								<TrackingLink />
							</FansView>
						</FansView>
					</LayoutContentsContainer>
				</ScrollView>
			</FansView>
			<CreateLinkModal
				visible={openLinkModal}
				onClose={() => setOpenLinkModal(false)}
			/>
		</AppLayout>
	);
};

export default TrackingLinksScreen;
