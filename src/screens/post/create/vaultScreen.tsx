import { Camera1Svg, CheckSvg } from "@assets/svgs/common";
import { FypNullableView, FypSvg, FypText } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansIconButton, FansView } from "@components/controls";
import { ImagePostChip } from "@components/posts/common";
import { defaultPostFormData } from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VaultScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Vault">,
) => {
	const { navigation } = props;

	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();

	const [inProgress, setInProgress] = useState(false);
	const [mediaId, setMediaId] = useState(-1);

	const handleNext = async () => {};

	const handleCancel = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: defaultPostFormData,
		});
		navigation.goBack();
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
				onClickLeft={handleCancel}
				onClickRight={handleNext}
				rightLabel="Next"
				titleIcon="vault"
				leftIcon="close"
				loading={inProgress}
			/>
			<FansView flex="1" padding={{ b: insets.bottom }}>
				<ImagePostChip
					colSpan={1}
					uri="media/81222749179879424/AKB71S4jTwFxmTmtnnoWKuUC1D4nfXfp.png"
					onPress={() => {}}
				/>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					padding={{ y: 10, x: 18 }}
				>
					<FypText fontSize={19} fontWeight={700} lineHeight={26}>
						All
					</FypText>
					<FansIconButton
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
					>
						<FypSvg
							svg={Camera1Svg}
							width={18}
							height={16}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
				</FansView>
				<FansView flex="1">
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
		</FansView>
	);
};

export default VaultScreen;
