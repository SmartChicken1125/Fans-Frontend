import { Edit1Svg } from "@assets/svgs/common";
import {
	FansButton3,
	FansGap,
	FansHorizontalDivider,
	FansImage2,
	FansScreen3,
	FansSvg,
	FansSwitch,
	FansSwitch1,
	FansText,
	FansTextInput,
	FansView,
} from "@components/controls";
import {
	WelcomeMessageImageModal,
	WelcomeMessageModal,
	TopNotificationMessageImageModal,
	TopNotificationMessageModal,
} from "@components/modals/settings/automatedChats";
import {
	createWelcomeAutomatedMessage,
	updateWelcomeAutomatedMessageSettings,
	getWelcomeAutomatedMessage,
	getTopFanNotification,
	createTopFanNotification,
	updateTopFanNotification,
} from "@helper/endpoints/chat/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType } from "@usertypes/commonEnums";
import { SettingsAutomatedChatsNativeStackParams } from "@usertypes/navigations";
import useUploadFiles from "@utils/useUploadFile";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const AutomatedChatsScreen = (
	props: NativeStackScreenProps<
		SettingsAutomatedChatsNativeStackParams,
		"AutomatedChats"
	>,
) => {
	const { navigation } = props;
	const { uploadFiles } = useUploadFiles();

	const [welcomeText, setWelcomeText] = useState<string>();
	const [welcomeImage, setWelcomeImage] = useState<string | undefined>();
	const [isTop1, setTop1] = useState(true);
	const [isTop5, setTop5] = useState(true);
	const [isTop10, setTop10] = useState(true);
	const [isCustomMessage, setCustomMessage] = useState(true);
	const [isWelcomeMessage, setWelcomeMessage] = useState(true);
	const [
		isWelcomeMessageImageModalVisible,
		setWelcomeMessageImageModalVisible,
	] = useState(false);
	const [isWelcomeMessageModalVisible, setWelcomeMessageModalVisible] =
		useState(false);
	const [welcomeMessageDelayEnabled, setWelcomeMessageDelayEnabled] =
		useState(false);
	const [welcomeMessageDelay, setWelcomeMessageDelay] = useState("30");
	const [topFanNotificationText, setTopFanNotificationText] =
		useState<string>();
	const [topFanNotificationImage, setTopFanNotificationImage] = useState<
		string | undefined
	>();
	const [
		isTopFanNotificationImageModalVisible,
		setTopFanNotificationImageModalVisible,
	] = useState(false);
	const [isTopFanNotification, setTopFanNotification] = useState(false);
	const [
		isTopFanNotificationModalVisible,
		setTopFanNotificationModalVisible,
	] = useState(false);

	useEffect(() => {
		const fetchWelcomeAutomatedMessage = async () => {
			const result = await getWelcomeAutomatedMessage();
			if (result.ok) {
				setWelcomeText(result.data?.text);
				setWelcomeImage(result.data?.image);
				setWelcomeMessage(Boolean(result.data?.enabled));
				setWelcomeMessageDelayEnabled(
					Boolean(result.data?.isDelayEnabled),
				);
				setWelcomeMessageDelay(result.data?.delay.toString() ?? "30");
			}
		};

		const fetchTopFanNotification = async () => {
			const result = await getTopFanNotification();
			if (result.ok) {
				setTopFanNotificationText(result.data?.text);
				setTopFanNotificationImage(result.data?.image);
				setTop1(Boolean(result.data?.top1Enabled));
				setTop5(Boolean(result.data?.top5Enabled));
				setTop10(Boolean(result.data?.top10Enabled));
				setCustomMessage(Boolean(result.data?.customMessageEnabled));
			}
		};

		fetchTopFanNotification();
		fetchWelcomeAutomatedMessage();
	}, []);

	const handleCloseWelcomeMessageImageModal = () =>
		setWelcomeMessageImageModalVisible(false);

	const handleCloseWelcomeMessageModal = () =>
		setWelcomeMessageModalVisible(false);

	const handlePressCustomMessage = () => {
		tw.prefixMatch("lg")
			? setTopFanNotificationImageModalVisible(true)
			: navigation.navigate("MessageImage", { type: "Custom" });
	};

	const handlePressWelcomeMessage = () => {
		tw.prefixMatch("lg")
			? setWelcomeMessageImageModalVisible(true)
			: navigation.navigate("MessageImage", { type: "Welcome" });
	};

	const handleSubmitWlecomeMessageImageModal = (image?: string) => {
		setWelcomeMessageImageModalVisible(false);
		setWelcomeMessageModalVisible(true);
		setWelcomeImage(image);
	};

	const handleSubmitTopFanNotificationImageModal = (image?: string) => {
		setTopFanNotificationImageModalVisible(false);
		setTopFanNotificationModalVisible(true);
		setTopFanNotificationImage(image);
	};

	const handleSubmitWelcomeMessageModal = async (text?: string) => {
		if (!text) {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "Please enter a message",
			});
			return;
		}

		setWelcomeText(text);
		setWelcomeMessageModalVisible(false);

		let image: string | undefined;

		if (welcomeImage) {
			const uploadResult = await uploadFiles([
				{ uri: welcomeImage, type: MediaType.Image },
			]);
			if (!uploadResult.ok) {
				Toast.show({
					type: "error",
					text1: "Error",
					text2: "Failed to upload image",
				});
				return;
			}
			image = uploadResult.data?.[0].id;
		}

		const result = await createWelcomeAutomatedMessage({
			text: text,
			image: image,
			enabled: isWelcomeMessage,
			isDelayEnabled: welcomeMessageDelayEnabled,
			delay: parseInt(welcomeMessageDelay),
		});

		if (result.ok) {
			Toast.show({
				type: "success",
				text1: "Success",
				text2: "Welcome message created",
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: result.data?.message,
			});
		}
	};

	const handleSubmitTopFanNotificationModal = async (text?: string) => {
		setTopFanNotificationText(text);
		setTopFanNotificationModalVisible(false);

		let image: string | undefined;

		if (topFanNotificationImage) {
			const uploadResult = await uploadFiles([
				{ uri: topFanNotificationImage, type: MediaType.Image },
			]);
			if (!uploadResult.ok) {
				Toast.show({
					type: "error",
					text1: "Error",
					text2: "Failed to upload image",
				});
				return;
			}
			image = uploadResult.data?.[0].id;
		}

		const result = await createTopFanNotification({
			customMessageEnabled: isCustomMessage,
			text: text,
			image: image,
			top1Enabled: isTop1,
			top5Enabled: isTop5,
			top10Enabled: isTop10,
		});

		if (result.ok) {
			Toast.show({
				type: "success",
				text1: "Success",
				text2: "Top Fan notification created",
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: result.data?.message,
			});
		}
	};

	useEffect(() => {
		const handleUpdateWelcomeMessageSettings = async () => {
			const result = await updateWelcomeAutomatedMessageSettings({
				enabled: isWelcomeMessage,
				isDelayEnabled: welcomeMessageDelayEnabled,
				delay: parseInt(welcomeMessageDelay),
			});

			if (!result.ok) {
				Toast.show({
					type: "error",
					text1: "Error",
					text2: result.data?.message,
				});
			}
		};
		handleUpdateWelcomeMessageSettings();
	}, [isWelcomeMessage, welcomeMessageDelayEnabled, welcomeMessageDelay]);

	useEffect(() => {
		const handleUpdateTopFanNotificationSettings = async () => {
			const result = await updateTopFanNotification({
				top1Enabled: isTop1,
				top5Enabled: isTop5,
				top10Enabled: isTop10,
				customMessageEnabled: isCustomMessage,
			});

			if (!result.ok) {
				Toast.show({
					type: "error",
					text1: "Error",
					text2: result.data?.message,
				});
			}
		};
		handleUpdateTopFanNotificationSettings();
	}, [isTop1, isTop5, isTop10, isCustomMessage]);

	return (
		<FansScreen3 contentStyle={tw.style("lg:max-w-[670px]")}>
			<FansGap height={{ lg: 40.6 }} />
			<FansView>
				<FansSwitch1
					label={
						<FansText fontFamily="inter-semibold" fontSize={19}>
							Welcome message
						</FansText>
					}
					value={isWelcomeMessage}
					onValueChange={setWelcomeMessage}
				/>
				<FansGap height={10} />
				<FansText
					fontSize={16}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					Send an automated message to new fans
				</FansText>
				<FansGap height={20} />
				<FansButton3
					title="Create welcome message"
					buttonStyle={{
						backgroundColor: tw.prefixMatch("dark")
							? "black-1d"
							: "white",
					}}
					textStyle1={{ color: "purple" }}
					onPress={handlePressWelcomeMessage}
				/>
			</FansView>
			<FansGap height={36.3} />
			{/* Welcome message ~*/}
			<FansView>
				<FansView
					alignItems="center"
					flexDirection="row"
					justifyContent="between"
				>
					<FansText fontFamily="inter-semibold" fontSize={17}>
						Welcome message
					</FansText>
					<TouchableOpacity
						onPress={() => setWelcomeMessageModalVisible(true)}
					>
						<FansView
							alignItems="center"
							flexDirection="row"
							gap={4.6}
						>
							<FansSvg
								width={10.85}
								height={11.31}
								svg={Edit1Svg}
								color1="purple"
							/>
							<FansText
								color="purple"
								fontFamily="inter-semibold"
								fontSize={17}
							>
								Edit
							</FansText>
						</FansView>
					</TouchableOpacity>
				</FansView>
				<FansGap height={14} />
				<FansView
					style={tw.style(
						"p-[15px] border border-fans-grey-f0 dark:border-fans-grey-43",
					)}
					alignItems="end"
					borderRadius={7}
					gap={7.4}
				>
					<FansImage2
						width={250}
						height={183}
						source={{ uri: welcomeImage }}
						viewStyle={{ borderRadius: 15 }}
					/>
					<FansView
						width={250}
						style={tw.style(
							"rounded-t-[21px] rounded-bl-[21px]",
							"p-[11px]",
						)}
						backgroundColor="purple"
					>
						<FansText color="white" fontSize={18}>
							{welcomeText}
						</FansText>
					</FansView>
				</FansView>
			</FansView>
			{/* ~ Welcome message */}
			<FansGap height={32} />
			<FansHorizontalDivider />
			<FansGap height={26.3} />
			<FansView>
				<FansView flexDirection="row" justifyContent="between">
					<FansView>
						<FansText fontFamily="inter-semibold" fontSize={19}>
							Sent Delay
						</FansText>
						<FansGap height={11} />
						<FansText
							fontSize={16}
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							You can add a delay so this welcome message looks
							more natural
						</FansText>
					</FansView>
					<FansSwitch1
						value={welcomeMessageDelayEnabled}
						onValueChange={setWelcomeMessageDelayEnabled}
					/>
				</FansView>
				<FansGap height={11} />
				<FansTextInput
					iconNode="MIN"
					keyboardType="numeric"
					value={welcomeMessageDelay}
					onChangeText={setWelcomeMessageDelay}
				/>
			</FansView>
			<FansGap height={32} />
			<FansHorizontalDivider />
			<FansGap height={26.3} />
			<FansView>
				<FansText fontFamily="inter-semibold" fontSize={19}>
					Notify top fans
				</FansText>
				<FansGap height={11} />
				<FansText
					fontSize={16}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					Monthly notify your fans when they have made it to the Top
					1% or 5%
				</FansText>
				<FansGap height={24.8} />
				<FansSwitch1
					label="Top 1%"
					value={isTop1}
					onValueChange={setTop1}
				/>
				<FansGap height={20} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch1
					label="Top 5%"
					value={isTop5}
					onValueChange={setTop5}
				/>
				<FansGap height={20} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch
					text="Top 10%"
					value={isTop10}
					onValueChange={setTop10}
				/>
			</FansView>
			<FansGap height={40} />
			<FansView>
				<FansSwitch1
					label={
						<FansText fontFamily="inter-semibold" fontSize={18}>
							Set custom message
						</FansText>
					}
					value={isCustomMessage}
					onValueChange={setCustomMessage}
				/>
				<FansGap height={10.5} />
				<FansText
					fontSize={16}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					Craft your own message that is sent to fans when they reach
					a certain top %
				</FansText>
				<FansGap height={20} />
				<FansButton3
					title="Create custom message"
					buttonStyle={{
						backgroundColor: tw.prefixMatch("dark")
							? "black-1d"
							: "white",
					}}
					textStyle1={{ color: "purple" }}
					onPress={handlePressCustomMessage}
				/>
			</FansView>
			<FansGap height={36.3} />
			{/* Top fans message ~*/}
			<FansView>
				<FansView
					alignItems="center"
					flexDirection="row"
					justifyContent="between"
				>
					<FansText fontFamily="inter-semibold" fontSize={17}>
						Top fans message
					</FansText>
					<TouchableOpacity
						onPress={() => setTopFanNotificationModalVisible(true)}
					>
						<FansView
							alignItems="center"
							flexDirection="row"
							gap={4.6}
						>
							<FansSvg
								width={10.85}
								height={11.31}
								svg={Edit1Svg}
								color1="purple"
							/>
							<FansText
								color="purple"
								fontFamily="inter-semibold"
								fontSize={17}
							>
								Edit
							</FansText>
						</FansView>
					</TouchableOpacity>
				</FansView>
				<FansGap height={14} />
				<FansView
					style={tw.style(
						"p-[15px] border border-fans-grey-f0 dark:border-fans-grey-43",
					)}
					alignItems="end"
					borderRadius={7}
					gap={7.4}
				>
					<FansImage2
						width={250}
						height={183}
						source={{ uri: topFanNotificationImage }}
						viewStyle={{ borderRadius: 15 }}
					/>
					<FansView
						width={250}
						style={tw.style(
							"rounded-t-[21px] rounded-bl-[21px]",
							"p-[11px]",
						)}
						backgroundColor="purple"
					>
						<FansText color="white" fontSize={18}>
							{topFanNotificationText}
						</FansText>
					</FansView>
				</FansView>
			</FansView>
			{/* ~ Top fans message */}
			<FansGap height={39.9} />
			<FansButton3 title="Update" />
			<WelcomeMessageImageModal
				visible={isWelcomeMessageImageModalVisible}
				onClose={handleCloseWelcomeMessageImageModal}
				onSubmit={handleSubmitWlecomeMessageImageModal}
			/>
			<WelcomeMessageModal
				text={welcomeText}
				image={welcomeImage}
				visible={isWelcomeMessageModalVisible}
				onClose={handleCloseWelcomeMessageModal}
				onSubmit={handleSubmitWelcomeMessageModal}
			/>
			<TopNotificationMessageImageModal
				visible={isTopFanNotificationImageModalVisible}
				onClose={() => setTopFanNotificationImageModalVisible(false)}
				onSubmit={handleSubmitTopFanNotificationImageModal}
			/>
			<TopNotificationMessageModal
				text={topFanNotificationText}
				image={topFanNotificationImage}
				visible={isTopFanNotificationModalVisible}
				onClose={() => setTopFanNotificationModalVisible(false)}
				onSubmit={handleSubmitTopFanNotificationModal}
			/>
			<FansGap height={20} />
		</FansScreen3>
	);
};

export default AutomatedChatsScreen;
