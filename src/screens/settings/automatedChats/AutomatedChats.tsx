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
	FansView,
} from "@components/controls";
import {
	WelcomeMessageImageModal,
	WelcomeMessageModal,
} from "@components/modals/settings/automatedChats";
import { useAppContext } from "@context/useAppContext";
import {
	createWelcomeAutomatedMessage,
	getWelcomeAutomatedMessage,
} from "@helper/endpoints/chat/apis";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import { AutomatedChatsNativeStackScreenProps } from "@usertypes/navigations";
import useUploadFiles from "@utils/useUploadFile";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const AutomatedChatsScreen = (
	prop: AutomatedChatsNativeStackScreenProps<"AutomatedChats">,
) => {
	const { navigation } = prop;
	const { dispatch } = useAppContext();
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

	useEffect(() => {
		const fetchWelcomeAutomatedMessage = async () => {
			const result = await getWelcomeAutomatedMessage();
			if (result.ok) {
				setWelcomeText(result.data?.text);
				setWelcomeImage(result.data?.image);
				setWelcomeMessage(result.data?.enabled);
			}
		};
		fetchWelcomeAutomatedMessage();
	}, []);

	const handleCloseWelcomeMessageImageModal = () =>
		setWelcomeMessageImageModalVisible(false);

	const handleCloseWelcomeMessageModal = () =>
		setWelcomeMessageModalVisible(false);

	const handlePressCustomMessage = () => {
		tw.prefixMatch("lg")
			? setWelcomeMessageImageModalVisible(true)
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
			image = uploadResult.data?.[0].url;
		}

		const result = await createWelcomeAutomatedMessage({
			text: text,
			image: image,
			enabled: isWelcomeMessage,
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

	const topFansMessage = {
		image: "https://i.postimg.cc/J7vXYBL0/image.png",
		text: "Hey there! Here’s a little surprise gift for you. Hope you enjoy it! Xx",
	};

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
					<TouchableOpacity>
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
						source={{ uri: topFansMessage.image }}
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
							{topFansMessage.text}
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
			<FansGap height={20} />
		</FansScreen3>
	);
};

export default AutomatedChatsScreen;
