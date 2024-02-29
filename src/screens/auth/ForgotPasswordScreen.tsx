import { ChevronLeftSvg, TitleSvg } from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import { FypText, FypSvg } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import { useAppContext } from "@context/useAppContext";
import { authForgotPassword } from "@helper/endpoints/auth/apis";
import tw from "@lib/tailwind";
import { validateEmail } from "@utils/validateHelper";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ImageBackground,
	Pressable,
	SafeAreaView,
	ScrollView,
	View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";

const ForgotPasswordScreen = () => {
	const router = useRouter();
	const { dispatch } = useAppContext();
	const [email, setEmail] = useState<string>("");
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setEmail("");
	}, []);

	const handleSendEmail = () => {
		setSubmitted(true);
		if (validateEmail(email).length > 0) return;

		setLoading(true);
		authForgotPassword({ email })
			.then((resp) => {
				if (!resp.ok) {
					Toast.show({ type: "error", text1: resp.data.message });
					return;
				} else {
					Toast.show({
						type: "success",
						text1: "Email sent, please check your inbox",
					});
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<SafeAreaView
			style={tw`flex-1 bg-white relative dark:bg-fans-black-1d`}
		>
			<CustomTopNavBar
				title="Reset password"
				onClickLeft={() => router.back()}
				onClickRight={() => {}}
				style="md:hidden"
			/>
			{/* <Stack.Screen
				options={{
					headerShown: true,
					title: "Reset Password",
				}}
			/> */}
			<ImageBackground
				source={require("@assets/images/background/auth-bg-2.jpg")}
				style={tw.style(
					"w-full h-full absolute top-0 left-0 hidden md:flex",
				)}
				resizeMode="cover"
			/>
			<ScrollView contentContainerStyle={tw.style("flex-1")}>
				<View
					style={tw.style(
						"flex-1 md:w-[616px] md:mx-auto md:my-auto md:py-20",
					)}
				>
					<TitleSvg
						width={306}
						height={61.5}
						style={tw.style("mx-auto hidden md:flex")}
					/>
					<View
						style={tw`flex-1 flex py-6 px-[18px] md:bg-white md:dark:bg-fans-black-1d md:mt-13 md:rounded-[15px] md:px-10 md:mb-10`}
					>
						<View
							style={tw.style(
								"mb-9 relative flex-row justify-center hidden md:flex",
							)}
						>
							<FypText
								style={tw.style(
									"text-[23px] leading-[31px] font-semibold text-black dark:text-fans-white",
								)}
							>
								Reset password
							</FypText>
							<Pressable
								style={tw.style("absolute left-0 top-2")}
								onPress={() => router.back()}
							>
								<FypSvg
									svg={ChevronLeftSvg}
									width={8}
									height={15}
									color="fans-grey-70 dark:fans-grey-b1"
								/>
							</Pressable>
						</View>

						<FypText
							fontSize={16}
							lineHeight={21}
							textAlign="center"
						>
							Enter the email address linked to your account, and
							we will send you an email with instructions to reset
							your password.
						</FypText>
						<FypText
							fontSize={17}
							lineHeight={22}
							margin={{ b: 14, t: 35 }}
							fontWeight={600}
						>
							Email address
						</FypText>
						<FormControl
							placeholder="e.g hello@fyp.fans"
							value={email}
							onChangeText={setEmail}
							hasError={
								submitted && validateEmail(email).length > 0
							}
							validateString={validateEmail(email)}
						/>

						<RoundButton
							customStyles={"mt-[21px] md:mt-4"}
							onPress={handleSendEmail}
						>
							Send email
						</RoundButton>
					</View>
				</View>
			</ScrollView>

			<Spinner
				visible={loading}
				overlayColor="rgba(0,0,0,.5)"
				color="white"
				textStyle={tw`text-white`}
			/>
		</SafeAreaView>
	);
};

export default ForgotPasswordScreen;
