import {
	Calendar2Svg,
	Check3Svg,
	Clock1Svg,
	Edit2Svg,
	EditNote1Svg,
	Trash2Svg,
} from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import {
	FansButton3,
	FansGap,
	FansHorizontalDivider,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { FansImage2 } from "@components/controls/Image";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import tw from "@lib/tailwind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsScheduledPostsNativeStackParams } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

const Stack =
	createNativeStackNavigator<SettingsScheduledPostsNativeStackParams>();

const SettingsScheduledPostsNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="ScheduledPosts"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="ScheduledPosts"
				component={ScheduledPostsContentView}
				options={{ title: "Scheduled posts" }}
			/>
		</Stack.Navigator>
	);
};

const ScheduledPostsContentView = () => {
	const [posts, setPosts] = useState([
		{
			id: 1,
			image: "https://i.postimg.cc/J7vXYBL0/image.png",
			text: "Hello everyone! I’m back! Hope you’re all having a nice week",
			time: "2023-09-05T23:39:10.318Z",
		},
		{
			id: 2,
			image: "https://i.postimg.cc/J7vXYBL0/image.png",
			text: "Hello everyone! I’m back! Hope you’re all having a nice week",
			time: "2023-09-05T23:39:10.318Z",
		},
		{
			id: 3,
			image: "https://i.postimg.cc/J7vXYBL0/image.png",
			text: "Hello everyone! I’m back! Hope you’re all having a nice week",
			time: "2023-09-05T23:39:10.318Z",
		},
		{
			id: 4,
			posted: true,
			image: "https://i.postimg.cc/J7vXYBL0/image.png",
			text: "Hello everyone! I’m back! Hope you’re all having a nice week",
			time: "2023-09-05T23:39:10.318Z",
		},
	]);

	const trigDelete = (id: number) => {
		const items = posts.filter((value) => value.id !== id);
		setPosts(items);
	};

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
			<FansGap height={{ lg: 43.4 }} />
			<FansButton3
				title="New Post"
				icon={
					<FansSvg
						width={13.72}
						height={13.69}
						svg={EditNote1Svg}
						color1="purple"
					/>
				}
				buttonStyle={{
					backgroundColor: tw.prefixMatch("dark")
						? "black-1d"
						: "white",
					gap: 7.1,
				}}
				textStyle1={{ color: "purple" }}
			/>
			<FansGap height={27.3} />
			<FansView gap={9}>
				{posts
					.filter((item) => !item.posted)
					.map((item, index) => {
						const { id, image, text, time } = item;

						const handlePress = () => trigDelete(id);

						return (
							<FansView
								key={index}
								alignItems="center"
								flexDirection="row"
							>
								<FansView
									width={0}
									style={tw.style(
										"p-[17px] border border-fans-grey dark:border-fans-grey-43",
									)}
									borderRadius={15}
									grow
								>
									<FansView
										alignItems={{ lg: "center" }}
										flexDirection="row"
										gap={15.8}
									>
										<FansImage2
											width={95}
											height={95}
											source={{ uri: image }}
											viewStyle={{ borderRadius: 7 }}
											imageStyle={{ resizeMode: "cover" }}
										/>
										<FansText
											fontSize={16}
											lineHeight={21}
											style={tw.style(
												"text-fans-grey-70 dark:text-fans-grey-b1",
											)}
										>
											{text}
										</FansText>
									</FansView>
									<FansGap height={16.8} />
									<FansHorizontalDivider />
									<FansGap height={14.7} />
									<FansView flexDirection="row" gap={17.1}>
										<FansView flexDirection="row" gap={7.5}>
											<FansSvg
												width={16.18}
												height={18.09}
												svg={Calendar2Svg}
												color1="purple"
											/>
											<FansText
												fontFamily="inter-semibold"
												fontSize={17}
												textTransform="uppercase"
											>
												{DateTime.fromISO(
													time,
												).toFormat("MMM d")}{" "}
											</FansText>
										</FansView>
										<FansView flexDirection="row" gap={6.4}>
											<FansSvg
												width={18.38}
												height={18.38}
												svg={Clock1Svg}
												color1="purple"
											/>
											<FansText
												fontFamily="inter-semibold"
												fontSize={17}
											>
												{DateTime.fromISO(
													time,
												).toFormat("hh:mm a")}
											</FansText>
										</FansView>
									</FansView>
								</FansView>
								<FansGap width={18} />
								<FansView gap={7}>
									<FansView
										width={34}
										height={34}
										alignItems="center"
										borderRadius="full"
										justifyContent="center"
										style={tw.style(
											"bg-fans-grey dark:bg-fans-grey-43",
										)}
									>
										<FypSvg
											width={12.94}
											height={13.5}
											svg={Edit2Svg}
											color="fans-black dark:fans-white"
										/>
									</FansView>
									<TouchableOpacity onPress={handlePress}>
										<FansView
											width={34}
											height={34}
											alignItems="center"
											borderRadius="full"
											justifyContent="center"
											style={tw.style(
												"bg-fans-grey dark:bg-fans-grey-43",
											)}
										>
											<FypSvg
												width={11.87}
												height={14.76}
												svg={Trash2Svg}
												color="fans-red"
											/>
										</FansView>
									</TouchableOpacity>
								</FansView>
							</FansView>
						);
					})}
			</FansView>
			<FansGap height={13.4} />
			<FansHorizontalDivider />
			<FansGap height={13.6} />
			<FansView gap={9} opacity={50}>
				{posts
					.filter((item) => item.posted)
					.map((item, index) => {
						const { image, text, time } = item;

						return (
							<FansView
								key={index}
								style={tw.style(
									"p-[17px] border-fans-grey dark:border-fans-grey-43 border",
								)}
								borderRadius={15}
							>
								<FansView
									alignItems={{ lg: "center" }}
									flexDirection="row"
									gap={15.8}
								>
									<FansImage2
										width={95}
										height={95}
										source={{ uri: image }}
										viewStyle={{ borderRadius: 7 }}
										imageStyle={{ resizeMode: "cover" }}
									/>
									<FansText
										fontSize={16}
										lineHeight={21}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										{text}
									</FansText>
								</FansView>
								<FansGap height={16.8} />
								<FansHorizontalDivider />
								<FansGap height={14.7} />
								<FansView
									alignItems="center"
									flexDirection="row"
									justifyContent="between"
								>
									<FansView flexDirection="row" gap={17.1}>
										<FansView flexDirection="row" gap={7.5}>
											<FansSvg
												width={16.18}
												height={18.09}
												svg={Calendar2Svg}
												color1="purple"
											/>
											<FansText
												fontFamily="inter-semibold"
												fontSize={17}
												textTransform="uppercase"
											>
												{DateTime.fromISO(
													time,
												).toFormat("MMM d")}{" "}
											</FansText>
										</FansView>
										<FansView flexDirection="row" gap={6.4}>
											<FansSvg
												width={18.38}
												height={18.38}
												svg={Clock1Svg}
												color1="purple"
											/>
											<FansText
												fontFamily="inter-semibold"
												fontSize={17}
											>
												{DateTime.fromISO(
													time,
												).toFormat("hh:mm a")}
											</FansText>
										</FansView>
									</FansView>
									<FansView
										width={103.76}
										height={30}
										style={tw.style("bg-fans-purple/20")}
										alignItems="center"
										borderRadius="full"
										flexDirection="row"
										gap={9.1}
										justifyContent="center"
									>
										<FansSvg
											width={10.8}
											height={7.19}
											svg={Check3Svg}
											color1="purple"
										/>
										<FansText
											color="purple"
											fontFamily="inter-semibold"
											fontSize={13}
										>
											POSTED
										</FansText>
									</FansView>
								</FansView>
							</FansView>
						);
					})}
			</FansView>
			<FansGap height={20} />
		</FansScreen3>
	);
};

const ScheduledPostsScreen = () => {
	return SettingsNavigationLayout(<SettingsScheduledPostsNativeStack />);
};

export default ScheduledPostsScreen;
