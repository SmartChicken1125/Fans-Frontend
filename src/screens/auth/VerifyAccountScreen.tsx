import { ChevronLeftSvg, TitleSvg } from "@assets/svgs/common";
import { EmailImage } from "@assets/svgs/images";
import RoundButton from "@components/common/RoundButton";
import TextButton from "@components/common/TextButton";
import { FypText, FypSvg } from "@components/common/base";
import { FansSvg } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import {
	authResendVerifyCode,
	authVerifyAccount,
} from "@helper/endpoints/auth/apis";
import tw from "@lib/tailwind";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";

const VerifyAccountScreen = () => {
	const router = useRouter();
	const { dispatch } = useAppContext();

	const [value, setValue] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [validateStr, setValidateStr] = useState<string>("");

	const ref = useBlurOnFulfill({ value, cellCount: 6 });
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

	const handleActivate = () => {
		setSubmitted(true);
		if (value.length !== 6) {
			setValidateStr("Please enter a valid code.");
		} else {
			setLoading(true);
			authVerifyAccount({
				code: value,
			})
				.then(async (resp) => {
					if (!resp.ok) {
						Toast.show({
							type: "error",
							text1: "Invalid verification code.",
						});
						setLoading(false);
						return;
					}

					Toast.show({
						type: "success",
						text1: "Your account has been activated successfully.",
					});

					await dispatch.fetchUserInfo();

					setLoading(false);
					// router.replace("/");
					router.replace({
						pathname: "profile",
						params: { screen: "ProfileName" },
					});
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	const handleResend = () => {
		setLoading(true);
		authResendVerifyCode({})
			.then((resp) => {
				if (!resp.ok) {
					Toast.show({
						type: "error",
						text1: resp.data.message,
					});
					return;
				}

				Toast.show({
					type: "success",
					text1: "Verification code has been sent to your email!",
				});
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleTryAnotherEmail = () => {
		router.push("/auth/register");
	};

	return (
		<View style={tw`flex-1 flex relative bg-white dark:bg-fans-black-1d`}>
			<Spinner
				visible={loading}
				overlayColor="rgba(0,0,0,.5)"
				color="white"
				textStyle={tw`text-white`}
			/>
			<ImageBackground
				source={require("@assets/images/background/auth-bg-2.jpg")}
				style={tw.style(
					"w-full h-full absolute top-0 left-0 hidden md:flex",
				)}
				resizeMode="cover"
			/>
			<ScrollView
				contentContainerStyle={tw.style("flex-1 py-6 px-[18px]")}
			>
				<View
					style={tw.style(
						"flex-1 md:flex-none max-w-[600px] mx-auto md:w-[616px] md:my-auto md:py-20 md:max-w-none",
					)}
				>
					<TitleSvg
						width={306}
						height={61.5}
						style={tw.style("mx-auto hidden md:flex")}
					/>
					<View
						style={tw.style(
							"flex-1 md:flex-none md:bg-white md:dark:bg-fans-black-1d md:rounded-[15px] md:px-10 md:pt-12 md:pb-10 md:mt-13 relative",
						)}
					>
						<Pressable
							style={tw.style(
								"absolute left-9 top-11 hidden md:flex",
							)}
							onPress={() => router.back()}
						>
							<FypSvg
								svg={ChevronLeftSvg}
								width={8}
								height={15}
								color="fans-grey-70 dark:fans-grey-b1"
							/>
						</Pressable>
						<View
							style={tw`mt-[100px] md:mt-0 flex-row justify-center`}
						>
							<FansSvg
								width={110.74}
								height={93.36}
								svg={EmailImage}
							/>
						</View>

						<FypText
							fontSize={23}
							lineHeight={31}
							fontWeight={700}
							textAlign="center"
							style={tw`mt-9 lg:mt-6`}
						>
							Check your email
						</FypText>
						<FypText
							fontSize={16}
							lineHeight={21}
							textAlign="center"
							margin={{ t: 16 }}
						>
							We have sent you a 6-digit verification code
							{"\n"}
							to activate your account
						</FypText>

						<View style={tw`mt-9 flex md:mt-7`}>
							<CodeField
								ref={ref}
								{...props}
								value={value}
								onChangeText={setValue}
								cellCount={6}
								keyboardType="number-pad"
								textContentType="oneTimeCode"
								rootStyle={tw`h-[54px] md:h-17`}
								renderCell={({ index, symbol, isFocused }) => (
									<FypText
										key={index}
										fontWeight={600}
										textAlign="center"
										style={[
											tw.style(
												"w-12 h-full rounded-lg border-[1px] border-fans-dark-grey p-2.5 md:w-[62px] dark:border-fans-grey-b1",
												"text-2xl text-black dark:text-fans-white flex items-center justify-center",
											),
											isFocused && tw`border-fans-purple`,
										]}
										onLayout={getCellOnLayoutHandler(index)}
									>
										{symbol ||
											(isFocused ? <Cursor /> : null)}
									</FypText>
								)}
								textInputStyle={tw.style("h-full")}
							/>
							{submitted && validateStr && (
								<FypText
									fontSize={15}
									lineHeight={21}
									style={tw`mt-1 text-[#ff0000] mx-auto`}
								>
									{validateStr}
								</FypText>
							)}
						</View>

						<RoundButton
							customStyles={"mt-[38px] md:mt-7.5"}
							onPress={handleActivate}
						>
							Confirm
						</RoundButton>

						<TextButton
							customStyle={"mt-[14px]"}
							onPress={handleResend}
						>
							Resend code
						</TextButton>

						<View style={tw`flex-auto`}>
							<FypText
								fontSize={16}
								lineHeight={21}
								textAlign="center"
								style={tw.style(
									"mt-auto md:mt-15 md:max-w-[340px] md:mx-auto",
									"md:leading-[25px]",
								)}
							>
								Didn't receive our email? Check your SPAM folder
								or{" "}
								<FypText
									style={tw`text-fans-purple`}
									onPress={() => {
										handleTryAnotherEmail();
									}}
								>
									try an another email address
								</FypText>
							</FypText>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default VerifyAccountScreen;
