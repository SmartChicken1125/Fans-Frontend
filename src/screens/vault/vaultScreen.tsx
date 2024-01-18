import {
	CheckSvg,
	SortDescSvg,
	SortAscSvg,
	OutlinedPlusSvg,
	TrashSvg,
	DownloadSvg,
} from "@assets/svgs/common";
import {
	FypText,
	FypSvg,
	FypHorizontalScrollView2,
	FypNullableView,
} from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import { ImagePostChip } from "@components/posts/common";
import FilterButton from "@components/profiles/filterButton";
import { defaultPostFormData } from "@constants/defaultFormData";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostStepTypes, PostType } from "@usertypes/commonEnums";
import { VaultNavigationStacks } from "@usertypes/navigations";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import Animated, { PinwheelIn, PinwheelOut } from "react-native-reanimated";

const VaultScreen = (
	props: NativeStackScreenProps<VaultNavigationStacks, "Home">,
) => {
	const { dispatch } = useAppContext();
	const [orderBy, setOrderBy] = useState("newest");
	const [filter, setFilter] = useState("All");
	const [mediaId, setMediaId] = useState(-1);

	const handlePressNewPost = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				...defaultPostFormData,
				type: PostType.Vault,
			},
		});
		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: true,
				step: PostStepTypes.Vault,
			},
		});
	};

	return (
		<FansView
			flex="1"
			position="relative"
			style={tw.style(
				"bg-fans-white dark:bg-fans-black-1d pt-7 md:pt-11 px-[18px]",
			)}
		>
			<FansView
				flex="1"
				style={tw.style("w-full max-w-[674px] mx-auto")}
				padding={{ b: 108 }}
			>
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
						svg={orderBy === "oldest" ? SortAscSvg : SortDescSvg}
						color="fans-grey-70 dark:fans-grey-b1"
					/>
					<Animated.View entering={PinwheelIn} exiting={PinwheelOut}>
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
				<FansView
					flex="1"
					style={tw.style("mx-[-18px] md:mx-0 mt-[22px] md:mt-10")}
				>
					<ScrollView>
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
			<FansView
				position="absolute"
				bottom={0}
				left={0}
				padding={{ t: 25, b: 40, x: 18 }}
				style={tw.style(
					"w-full bg-fans-white dark:bg-fans-black-1d border-t border-fans-grey-de dark:border-fans-grey-50",
				)}
			>
				<FansView
					position="relative"
					alignItems="center"
					style={tw.style("w-full max-w-[674px] mx-auto")}
				>
					<FansView
						position="relative"
						flexDirection="row"
						gap={9}
						borderRadius={42}
						alignItems="center"
						justifyContent="center"
						style={tw.style(
							"w-[164px] md:w-[234px] h-[42px] bg-fans-purple",
						)}
						pressableProps={{
							onPress: handlePressNewPost,
						}}
					>
						<FypSvg
							svg={OutlinedPlusSvg}
							width={15}
							height={15}
							color="fans-white"
						/>
						<FypText
							fontSize={19}
							fontWeight={700}
							lineHeight={26}
							style={tw.style("text-fans-white")}
						>
							New Post
						</FypText>
					</FansView>
					<FypText
						fontSize={17}
						fontWeight={600}
						lineHeight={22}
						style={tw.style(
							"text-fans-black dark:text-fans-white",
							"absolute left-0 top-[10px]",
						)}
					>
						2/50
					</FypText>
					<FansView
						flexDirection="row"
						gap={7}
						position="absolute"
						right={0}
					>
						<FansIconButton
							size={34}
							backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						>
							<FypSvg
								svg={TrashSvg}
								width={12}
								height={15}
								color="fans-red"
							/>
						</FansIconButton>
						<FansIconButton
							size={34}
							backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						>
							<FypSvg
								svg={DownloadSvg}
								width={12}
								height={18}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default VaultScreen;
