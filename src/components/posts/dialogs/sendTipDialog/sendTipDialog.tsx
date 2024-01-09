import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypLinearGradientView, FypText } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { FansText, FansView } from "@components/controls";
import { gemOptions } from "@constants/common";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { tipCreator } from "@helper/endpoints/gems/apis";
import tw from "@lib/tailwind";
import { RoundButtonType, SnapPoints } from "@usertypes/commonEnums";
import { validateNumberString } from "@utils/stringHelper";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Image,
	TextInput,
	View,
	ScrollView,
	useWindowDimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import GemItem from "./gemItem";

const SendTipDialog = () => {
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const { userInfo } = state.user;
	const { sendTipModal } = state.common;
	const { height } = useWindowDimensions();

	const [customTip, setCustomTip] = useState("");
	const [customTipPrice, setCustomTipPrice] = useState(0);
	const [selectedTip, setSelectedTip] = useState("500");
	const [message, setMessage] = useState("");

	const onClose = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSendTipModal,
			data: {
				visible: false,
			},
		});
	};

	const onClickGetGem = () => {
		onClose();
		router.push({ pathname: "/get-gems", params: { gems: selectedTip } });
	};

	const handleSendTip = () => {
		const tipCreatorAsync = async () => {
			if (!sendTipModal.creator) {
				return;
			}

			const res = await tipCreator({
				creatorId: sendTipModal.creator.id!,
				gems: parseInt(selectedTip.replace(/,/g, "")),
				message,
			});

			onClose();

			if (res.ok) {
				dispatch.fetchUserInfo();
				dispatch.setCommon({
					type: CommonActionType.toggleSendTipSuccessModal,
					data: {
						visible: true,
						creator: sendTipModal.creator,
						tip: selectedTip,
						message: message,
					},
				});
			} else {
				Toast.show({
					type: "error",
					text1: res.data.message,
				});
			}
		};

		tipCreatorAsync();
	};

	const onChangeCustomTip = (val: string) => {
		if (!validateNumberString(val)) {
			return;
		}
		setSelectedTip(val);
		setCustomTip(val);
		setCustomTipPrice(parseInt(val) * 0.01);
	};

	const onSelectTip = (amount: string, price: number) => {
		setSelectedTip(amount);
		setCustomTip(amount.replace(",", ""));
		setCustomTipPrice(price);
	};

	useEffect(() => {
		onSelectTip("500", 5);
	}, [sendTipModal]);

	return (
		<BottomSheetWrapper
			open={sendTipModal.visible}
			snapPoint={SnapPoints.Ninety}
			onClose={() => {
				onClose();
			}}
		>
			<FansView height={height * 0.9 - 50} position="relative">
				<ScrollView>
					<View style={tw.style("px-[18px] mb-[22px] md:pt-10")}>
						<FypText
							textAlign="center"
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							{`Tip @${sendTipModal.creator?.profileLink ?? ""}`}
						</FypText>
						{selectedTip !== "" && (
							<FypText
								fontSize={73}
								lineHeight={97}
								textAlign="center"
								margin={{ t: 12 }}
								style={tw.style("text-fans-purple")}
							>
								{selectedTip}
							</FypText>
						)}
						<FansText
							fontSize={22}
							lineHeight={30}
							style={tw.style(
								"text-center mt-[-10px] text-fans-black dark:text-fans-white",
							)}
						>
							{`$${
								parseInt(selectedTip.replace(/,/g, "")) * 0.01
							}`}
						</FansText>
					</View>

					<View
						style={tw.style(
							"flex-row px-[28px] justify-between mb-8",
						)}
					>
						{gemOptions.map((gem) => (
							<GemItem
								key={gem.title}
								title={gem.title}
								price={gem.price}
								titleColor={gem.color}
								onSelect={() =>
									onSelectTip(gem.title, gem.price)
								}
								isSelected={selectedTip === gem.title}
								icon={gem.icon}
							/>
						))}
					</View>

					<View style={tw.style("px-[18px] mb-[22px]")}>
						<View style={tw.style("mb-6")}>
							<View style={tw.style("relative")}>
								<RoundTextInput
									placeholder="Enter tip amount"
									onChangeText={onChangeCustomTip}
									value={customTip}
									keyboardType="numeric"
								/>
								{customTip !== "" ? (
									<FansText
										fontSize={17}
										lineHeight={22}
										style={tw.style(
											"font-normal absolute right-3 top-[10px]",
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										{`= ${customTipPrice} USD`}
									</FansText>
								) : null}
							</View>
						</View>

						<View style={tw.style("mb-7 h-[85px]")}>
							{selectedTip !== "0" || customTip !== "" ? (
								<TextInput
									value={message}
									onChangeText={(val) => setMessage(val)}
									autoCapitalize="none"
									multiline
									numberOfLines={4}
									maxLength={1000}
									placeholder="Write a message..."
									placeholderTextColor={
										tw.prefixMatch("dark")
											? "#B1B1B1"
											: "#707070"
									}
									style={[
										tw.style(
											"h-[85px] rounded-[15px] text-[18px] leading-[23px] p-[14px]",
											`bg-fans-white dark:bg-fans-black-1d`,
											`text-fans-black dark:text-fans-white`,
										),
										{
											shadowColor: tw.prefixMatch("dark")
												? "rgba(255,255,255,0.16)"
												: "rgba(0,0,0,0.16)",
											shadowOffset: {
												width: 0,
												height: 3,
											},
											shadowRadius: 6,
										},
										{ outlineStyle: "none" },
									]}
								/>
							) : null}
						</View>

						<RoundButton
							onPress={handleSendTip}
							disabled={customTip === "" && selectedTip === "0"}
						>
							Send tip
						</RoundButton>
					</View>
					<FypLinearGradientView
						colors={["#a854f5", "#a854f5", "#d885ff"]}
						padding={{ t: 20, b: 44 }}
					>
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							color="white"
							margin={{ b: 8 }}
							textAlign="center"
						>
							Next level unlock in 5 Gems!
						</FypText>
						<View style={tw.style("flex-row justify-center mb-4")}>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={400}
								color="white"
								margin={{ r: 13 }}
							>
								You have
							</FypText>
							{/* <GemSvg size={20.7} /> */}
							<Image
								source={require("@assets/images/gem.png")}
								style={tw.style("w-5 h-5")}
								resizeMode="cover"
							/>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								color="white"
								margin={{ l: 5 }}
							>{`${userInfo.gems} Gems`}</FypText>
						</View>

						<View style={tw.style("w-[164px] mx-auto")}>
							<RoundButton
								onPress={onClickGetGem}
								variant={RoundButtonType.OUTLINE_WHITE}
							>
								Get Gems
							</RoundButton>
						</View>
					</FypLinearGradientView>
				</ScrollView>
			</FansView>
		</BottomSheetWrapper>
	);
};

export default SendTipDialog;
