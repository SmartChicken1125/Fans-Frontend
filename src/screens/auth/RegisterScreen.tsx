import { TitleSvg } from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import TextButton from "@components/common/TextButton";
import { FypText } from "@components/common/base";
import { FansButton3, FansGap } from "@components/controls";
import {
	useDiscordAuthRequest,
	useGoogleAuthRequest,
	useTwitterAuthRequest,
} from "@helper/OAuth2";
import { authOAuth2Authorize, authRegister } from "@helper/endpoints/auth/apis";
import { AuthOAuth2AuthorizeReqBody } from "@helper/endpoints/auth/schemas";
import tw from "@lib/tailwind";
import { AuthState, authStateAtom } from "@state/auth";
import { useFeatureGates } from "@state/featureGates";
import {
	OTPPageTypes,
	RoundButtonType,
	StorageKeyTypes,
} from "@usertypes/commonEnums";
import { ISignUpForm } from "@usertypes/commonTypes";
import {
	setObjectStorage,
	setStorage,
	takeVolatileStorage,
} from "@utils/storage";
import { useBlankLink } from "@utils/useBlankLink";
import { validateSignUpForm } from "@utils/validateHelper";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { useSetRecoilState } from "recoil";

const RegisterScreen = () => {
	const router = useRouter();
	const { username } = useLocalSearchParams();
	const [openLink] = useBlankLink();
	const setAuthState = useSetRecoilState(authStateAtom);

	const [formData, setFormData] = useState<ISignUpForm>({
		username: "",
		email: "",
		password: "",
	});
	const [formValidate, setFormValidate] = useState<ISignUpForm>({
		username: "",
		email: "",
		password: "",
	});

	const [submitted, setSubmitted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const featureGates = useFeatureGates();

	const [twitterRequest, twitterResponse, twitterPromptAsync] =
		useTwitterAuthRequest("/auth/register");

	const [googleRequest, googleResponse, googlePromptAsync] =
		useGoogleAuthRequest("/auth/register");

	const [discordRequest, discordResponse, discordPromptAsync] =
		useDiscordAuthRequest("/auth/register");

	useEffect(() => {
		let provider: string | null = null;
		const body: AuthOAuth2AuthorizeReqBody = {
			code: "",
			redirectUri: "",
			codeVerifier: undefined,
		};

		if (twitterRequest && twitterResponse?.type === "success") {
			provider = "twitter";
			body.code = twitterResponse.params.code;
			body.redirectUri = twitterRequest.redirectUri;
			body.codeVerifier = twitterRequest.codeVerifier;
		} else if (googleRequest && googleResponse?.type === "success") {
			provider = "google";
			body.code = googleResponse.params.code;
			body.redirectUri = googleRequest.redirectUri;
			body.codeVerifier = googleRequest.codeVerifier;
		} else if (discordRequest && discordResponse?.type === "success") {
			provider = "discord";
			body.code = discordResponse.params.code;
			body.redirectUri = discordRequest.redirectUri;
			body.codeVerifier = discordRequest.codeVerifier;
		}

		if (!provider) return;

		setLoading(true);
		setAuthState(AuthState.Loading);
		authOAuth2Authorize(body, {
			provider,
		})
			.then(async (resp) => {
				if (!resp.ok) {
					Toast.show({
						type: "error",
						text1: resp.data.message,
					});
					setStorage(StorageKeyTypes.AccessToken, null);
					setObjectStorage(StorageKeyTypes.UserInfo, null);
					return;
				}

				await setStorage(StorageKeyTypes.AccessToken, resp.data.token);
				// await fetchUserInfo();

				const redirectUrl =
					takeVolatileStorage(StorageKeyTypes.RedirectAfterLogin) ??
					"/posts";
				router.replace(redirectUrl);
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [
		twitterRequest,
		googleRequest,
		twitterResponse,
		googleResponse,
		discordRequest,
		discordResponse,
	]);

	const handleSignUp = () => {
		setSubmitted(true);

		const temp = validateSignUpForm(formData);
		setFormValidate({ ...temp });

		if (temp.username || temp.email || temp.password) return;

		setLoading(true);
		setAuthState(AuthState.Loading);
		authRegister({
			username: formData.username,
			email: formData.email,
			password: formData.password,
		})
			.then(async (resp) => {
				if (!resp.ok) {
					Toast.show({
						type: "error",
						text1:
							[1020, 2010].includes(resp.data.code) &&
							resp.data.message
								? resp.data.message
								: "Failed to register an account.",
					});

					if (resp.data.code === 1020) {
						setFormValidate({
							...formValidate,
							username: resp.data.message,
						});
					} else if (resp.data.code === 2010) {
						setFormValidate({
							...formValidate,
							email: resp.data.message,
						});
					}
					return;
				}

				Toast.show({
					type: "success",
					text1: "Verification code is sent to your email, check your email!",
				});

				const token = resp.data.token;
				await setStorage(StorageKeyTypes.AccessToken, token);

				router.push({
					pathname: "/auth/verifyAccount",
					params: {
						otpType: OTPPageTypes.VerifyAccountOTP,
						email: formData.email,
						username: formData.username,
					},
				});
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleLogin = () => {
		router.push("/auth/login");
	};

	const handleChangeValue = (changedValue: ISignUpForm) => {
		setFormData(changedValue);
		setFormValidate(validateSignUpForm(changedValue));
	};

	const onGoToPrivacy = () => {
		openLink(
			"https://app.termly.io/document/privacy-policy/8234c269-74cc-48b6-9adb-be080aaaee11",
		);
	};

	useEffect(() => {
		if (username) {
			setFormData({
				...formData,
				username: username as string,
			});
		}
	}, [username]);

	return (
		<View
			style={tw.style("flex-1 relative bg-white dark:bg-fans-black-1d")}
		>
			<ImageBackground
				source={require("@assets/images/background/login-bg.jpg")}
				style={tw.style(
					"w-full h-full absolute top-0 left-0 hidden md:flex",
				)}
				resizeMode="cover"
			/>
			<Spinner
				visible={loading}
				overlayColor="rgba(0,0,0,.5)"
				color="white"
				textStyle={tw`text-white dark:text-fans-black-1d`}
			/>
			<ScrollView contentContainerStyle={tw.style("flex-1")}>
				<View
					style={tw.style(
						"md:w-[616px] md:mx-auto md:py-20 md:my-auto md:flex-none",
					)}
				>
					<View style={tw`relative md:hidden`}>
						<Image
							source={require("@assets/images/background/register-banner.webp")}
							style={tw.style("w-full h-[238px]")}
							resizeMode="cover"
						/>
						<View
							style={tw.style(
								"absolute bottom-[30px] w-full flex justify-center items-center",
							)}
						>
							<TitleSvg width={189} height={38} color="#fff" />
						</View>
					</View>
					<TitleSvg
						width={306}
						height={61.5}
						style={tw.style("mx-auto hidden md:flex")}
						color="#fff"
					/>
					<View
						style={tw.style(
							"mt-[-12px] md:mt-13",
							"flex flex-col rounded-tl-[15px] rounded-tr-[15px] md:rounded-[15px] flex-1",
							"h-full py-10 px-[18px] bg-white md:pt-9 md:px-10 dark:bg-fans-black-1d",
						)}
					>
						<View style={tw`flex flex-col gap-2 md:gap-0`}>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								style={tw.style(
									"mb-1.5 md:text-center md:text-[23px] md:leading-[31px] md:mb-7",
								)}
							>
								Create your account
							</FypText>

							<FormControl
								value={formData.username}
								placeholder="Username"
								onChangeText={(text: string) =>
									handleChangeValue({
										...formData,
										username: text,
									})
								}
								hasError={submitted && !!formValidate.username}
								validateString={formValidate.username}
								styles="md:mb-[10px]"
								maxLength={30}
							/>

							<FormControl
								value={formData.email}
								placeholder="Email"
								onChangeText={(text: string) =>
									handleChangeValue({
										...formData,
										email: text,
									})
								}
								hasError={submitted && !!formValidate.email}
								validateString={formValidate.email}
								styles="md:mb-[10px]"
							/>

							<FormControl
								secureTextEntry
								value={formData.password}
								placeholder="Password"
								onChangeText={(text: string) =>
									handleChangeValue({
										...formData,
										password: text,
									})
								}
								hasError={submitted && !!formValidate.password}
								validateString={formValidate.password}
							/>

							<RoundButton
								onPress={handleSignUp}
								customStyles={"mt-[10px] md:mt-[18px]"}
							>
								Sign up
							</RoundButton>
						</View>
						<FansGap height={{ xs: 24, lg: 14 }} />
						<View
							style={tw.style(
								"relative justify-center flex-row md:flex",
							)}
						>
							<FypText
								fontSize={16}
								lineHeight={21}
								style={tw.style(
									"text-fans-grey-b1 dark:text-fans-grey-70 px-3 bg-white dark:bg-fans-black-1d relative z-10",
								)}
							>
								OR
							</FypText>
							<View
								style={tw.style(
									"absolute w-full h-[1px] bg-fans-grey top-[10px] dark:bg-fans-grey-43",
								)}
							></View>
						</View>
						<FansGap height={{ xs: 27, lg: 16 }} />
						<View style={tw`flex flex-col gap-[9px]`}>
							<FansButton3
								title="Sign up with Google"
								buttonStyle={{ backgroundColor: "white" }}
								textStyle1={{ color: "purple" }}
								onPress={() => googlePromptAsync()}
							/>
							{featureGates.has("2023_11-twitter-oauth2") && (
								<RoundButton
									variant={RoundButtonType.OUTLINE_PRIMARY}
									onPress={() => {
										twitterPromptAsync();
									}}
								>
									Sign up with Twitter
								</RoundButton>
							)}

							<RoundButton
								variant={RoundButtonType.OUTLINE_PRIMARY}
								onPress={() => {
									discordPromptAsync();
								}}
							>
								Sign up with Discord
							</RoundButton>
						</View>

						<View style={tw`mt-[18px]`}>
							<FypText
								fontSize={12}
								lineHeight={22}
								textAlign="center"
								style={tw.style(
									"text-fans-dark-grey dark:text-fans-grey-b1",
								)}
							>
								By signing up, you agree to our{" "}
								<FypText
									style={tw`text-fans-purple underline`}
									onPress={() => router.push("/terms")}
								>
									Terms of Service
								</FypText>{" "}
								and
							</FypText>
							<FypText
								fontSize={12}
								lineHeight={22}
								textAlign="center"
								style={tw.style(
									"text-fans-dark-grey dark:text-fans-grey-b1",
								)}
							>
								<FypText
									style={tw`text-fans-purple underline`}
									onPress={onGoToPrivacy}
								>
									Privacy Policy
								</FypText>
								, and confirm that you are at least 18 years
								old.
							</FypText>
						</View>

						<View
							style={tw`mt-10 flex flex-row justify-center items-center md:mt-[46px]`}
						>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
							>
								Already have an account?
							</FypText>
							<TextButton onPress={handleLogin}>
								Log in
							</TextButton>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default RegisterScreen;
