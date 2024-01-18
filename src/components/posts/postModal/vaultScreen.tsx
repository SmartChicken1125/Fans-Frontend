import { CheckSvg, SortDescSvg, SortAscSvg } from "@assets/svgs/common";
import {
	FypNullableView,
	FypText,
	FypSvg,
	FypHorizontalScrollView2,
} from "@components/common/base";
import { FansView } from "@components/controls";
import { ImagePostChip } from "@components/posts/common";
import FilterButton from "@components/profiles/filterButton";
import { IAppDispatch } from "@context/appContext";
import tw from "@lib/tailwind";
import { IconTypes } from "@usertypes/commonEnums";
import { IPostForm } from "@usertypes/types";
import React, { FC, useState } from "react";
import { ScrollView } from "react-native";
import Animated, { PinwheelIn, PinwheelOut } from "react-native-reanimated";
import ModalHeader from "./modalHeader";

interface Props {
	data: IPostForm;
	handlePrev: () => void;
	titleIcon: IconTypes;
	dispatch: IAppDispatch;
}

const VaultScreen: FC<Props> = (props) => {
	const { data, handlePrev, titleIcon, dispatch } = props;
	const [orderBy, setOrderBy] = useState("newest");
	const [filter, setFilter] = useState("All");
	const [mediaId, setMediaId] = useState(-1);

	const handleSubmit = () => {};

	return (
		<FansView position="relative">
			<ModalHeader
				title="New post"
				rightLabel="Next"
				onClickRight={handleSubmit}
				onClickLeft={handlePrev}
				titleIcon={titleIcon}
				// loading={inProgress}
			/>
			<FansView
				padding={{ t: 28 }}
				style={tw.style("md:h-[600px] xl:h-[670px]")}
			>
				<FansView padding={{ x: 33 }}>
					<FansView
						flexDirection="row"
						alignItems="center"
						gap={13.2}
						pressableProps={{
							onPress: () =>
								setOrderBy(
									orderBy === "newest" ? "oldest" : "newest",
								),
						}}
						margin={{ b: 30 }}
					>
						<FypSvg
							width={16.76}
							height={14.05}
							svg={
								orderBy === "oldest" ? SortAscSvg : SortDescSvg
							}
							color="fans-grey-70 dark:fans-grey-b1"
						/>
						<Animated.View
							entering={PinwheelIn}
							exiting={PinwheelOut}
						>
							<FypText
								fontWeight={500}
								fontSize={17}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								{orderBy === "newest"
									? "Newest first"
									: "Oldest first"}
							</FypText>
						</Animated.View>
					</FansView>
					<FypHorizontalScrollView2>
						<FansView flexDirection="row" gap={5}>
							{["All", "Photo", "Video", "Audio"].map((el) => (
								<FilterButton
									title={el}
									selected={filter === el}
									onClick={() => setFilter(el)}
									key={el}
								/>
							))}
						</FansView>
					</FypHorizontalScrollView2>
				</FansView>
				<FansView
					flex="1"
					margin={{ t: 22 }}
					style={tw.style("rounded-b-[15px]")}
				>
					<ScrollView style={tw.style("rounded-b-[15px]")}>
						<FansView flexDirection="row" flexWrap="wrap">
							{[...Array(10)].map((el, index) => (
								<FansView
									key={index}
									position="relative"
									style={tw.style(
										"w-1/3 bg-fans-white dark:bg-fans-black-1d",
									)}
								>
									<ImagePostChip
										colSpan={1}
										uri="media/81222749179879424/AKB71S4jTwFxmTmtnnoWKuUC1D4nfXfp.png"
										onPress={() => setMediaId(index)}
									/>
									<FansView
										position="absolute"
										width={{ xs: 46, md: 75 }}
										height={{ xs: 15, md: 20 }}
										borderRadius={20}
										style={tw.style(
											"bg-fans-black/50 top-3 left-3 md:top-5 md:left-5",
										)}
										alignItems="center"
										justifyContent="center"
									>
										<FypText
											fontSize={{ xs: 8, md: 14 }}
											fontWeight={600}
											lineHeight={{ xs: 11, md: 19 }}
											style={tw.style("text-fans-white")}
										>
											5/24/23
										</FypText>
									</FansView>
									<FansView
										position="absolute"
										width={{ xs: 20, md: 26 }}
										height={{ xs: 20, md: 26 }}
										borderRadius={26}
										alignItems="center"
										justifyContent="center"
										style={tw.style(
											"top-3 right-3 md:top-5 md:right-5",
											mediaId === index
												? "bg-fans-purple"
												: "border border-fans-white bg-fans-black/50",
										)}
									>
										<FypNullableView
											visible={mediaId === index}
										>
											<FypSvg
												svg={CheckSvg}
												width={11}
												height={8}
												color="fans-white"
											/>
										</FypNullableView>
									</FansView>
								</FansView>
							))}
						</FansView>
					</ScrollView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default VaultScreen;
