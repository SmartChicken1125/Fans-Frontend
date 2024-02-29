import {
	ChevronDownSvg,
	DiscoverSvg,
	CloseSvg,
	DiamondTextLogoSvg,
	DiscordSvg,
	InstagramSvg,
	SearchSvg,
	SingleGem,
	TikTokSvg,
	TitleSvg,
	Twitter2Svg,
	YouTubeSvg,
	PciDssSvg,
	GDPRSvg,
	PlusSvg,
	MinusSvg,
} from "@assets/svgs/common";
import {
	DSSCardImage,
	DiscoverCardImage,
	ExpressCardImage,
	GDPRCardImage,
	MasterCardImage,
	VisaCardImage,
	PrivacyImage,
	TwoStarsImage,
	ShopImage,
	FirstSuccessStepTitleImage,
	SecondSuccessStepTitleImage,
	ThirdSuccessStepTitleImage,
	FaqTitlePCImage,
	FaqTitleMobileImage,
	Gem2Image,
} from "@assets/svgs/images";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypButton,
	FypLinearGradientView,
	FypNullableView,
	FypText,
	FypButton2,
	FypSvg,
	FypCollapsible,
} from "@components/common/base";
import {
	FansDivider,
	FansGap,
	FansIconButton,
	FansScreen1,
	FansText,
	FansView,
} from "@components/controls";
import { creatorRoles, creatorsData } from "@constants/homepage";
import { searchCreators } from "@helper/endpoints/profile/apis";
import { ProfilesRespBody } from "@helper/endpoints/profile/schemas";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import { formatNumber } from "@utils/stringHelper";
import { useBlankLink } from "@utils/useBlankLink";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {
	Image,
	ImageSourcePropType,
	NativeScrollEvent,
	Platform,
	Pressable,
	PressableProps,
	ScrollView,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

const MembershipSection = () => {
	const router = useRouter();

	const handleStart = () => {
		router.push("/auth/register");
	};

	return (
		<FansView
			style={tw.style("min-h-screen pb-[22px] md:pb-10 md:pt-10")}
			alignItems="center"
			justifyContent="center"
			padding={{ x: 18 }}
		>
			<FypText
				fontSize={{ xs: 30, md: 85 }}
				fontWeight={500}
				lineHeight={{ md: 100 }}
				textAlign="center"
				style={tw.style("text-fans-black-1d")}
			>
				{`Start a membership${`\n`}for your biggest fans`}
			</FypText>
			<FansGap height={{ xs: 23, md: 38 }} />
			<FypText
				fontSize={{ xs: 17, md: 27 }}
				lineHeight={{ xs: 26, md: 43 }}
				textAlign="center"
				style={tw.style("text-fans-black-1d")}
			>
				{`Create a recurring revenue stream by offering subscriptions.${
					tw.prefixMatch("md") ? `\n` : " "
				}Post exclusive content and give your fans a way to support your work`}
			</FypText>
			<FansGap height={{ xs: 46, md: 32 }} />
			<FansView
				alignSelf="center"
				width="full"
				height={{ xs: 318, md: 426 }}
				style={tw.style("max-w-[1094px]")}
			>
				{tw.prefixMatch("md") ? (
					<Image
						source={{
							uri: require("@assets/images/landing/membership-pc.webp"),
						}}
						resizeMode="contain"
						style={tw.style("w-full h-full")}
					/>
				) : (
					<Image
						source={{
							uri: require("@assets/images/landing/membership-mobile.webp"),
						}}
						resizeMode="contain"
						style={tw.style("w-full h-full")}
					/>
				)}
			</FansView>
			<FansGap height={{ xs: 22, md: 47 }}></FansGap>
			<FansView alignItems="center" width="full">
				<FypButton2
					style={tw.style(
						"w-full md:w-[208px] bg-fans-black-1d h-[42px] md:h-[66px]",
					)}
					textStyle={tw.style(
						"text-[17px] leading-[22px] text-fans-white font-semibold md:text-[21px] md:leading-[28px]",
					)}
					pressableProps={{
						onPress: handleStart,
					}}
				>
					Get started
				</FypButton2>
			</FansView>
		</FansView>
	);
};

const FooterSection = () => {
	const router = useRouter();
	const [openLink] = useBlankLink();
	const onPressDiscord = () => {
		openLink("https://discord.gg/fypfans");
	};

	const onPressTikTok = () => {
		openLink("https://www.tiktok.com/@fypfansreal");
	};

	const onPressTwitter = () => {
		openLink("https://twitter.com/FypFans");
	};

	const onPressYouTube = () => {
		openLink("https://www.youtube.com/channel/UCLA19FFPTxux2Z50_MRNBEg");
	};

	const onPressInstagram = () => {
		openLink("https://instagram.com/fyp.fans_/");
	};

	const onPressSupport = () => {
		openLink("https://support.fyp.fans/");
	};

	const onPressContact = () => {
		openLink("https://support.fyp.fans/");
	};

	const onPressBlog = () => {
		openLink("https://blog.fyp.fans/");
	};

	const onPressTerm = () => {
		router.push("/terms");
	};
	const onPressPrivacy = () => {
		openLink(
			"https://app.termly.io/document/privacy-policy/8234c269-74cc-48b6-9adb-be080aaaee11",
		);
	};

	const onPressCookie = () => {
		router.push({ pathname: "terms", params: { screen: "Cookies" } });
	};

	const onPressCompany = () => {
		openLink("https://www.fyp.llc/");
	};

	const Socials = () => (
		<FansView flexDirection="row" gap={10}>
			{[
				{
					icon: (
						<FansView
							style={tw.style(
								"w-[17.88px] h-[16.95px] md:w-[18.73px] md:h-[17.76px]",
							)}
						>
							<Twitter2Svg />
						</FansView>
					),
					onPress: onPressTwitter,
				},
				{
					icon: (
						<FansView
							style={tw.style(
								"w-[21.54px] h-[16.3px] md:w-[22.56px] md:h-[17.06px]",
							)}
						>
							<DiscordSvg />
						</FansView>
					),
					onPress: onPressDiscord,
				},
				{
					icon: (
						<FansView
							style={tw.style(
								"w-[19.72px] h-[13.72px] md:w-[20.66px] md:h-[14.38px]",
							)}
						>
							<YouTubeSvg />
						</FansView>
					),
					onPress: onPressYouTube,
				},
				{
					icon: (
						<FansView
							style={tw.style(
								"w-[19.6px] h-[19.66px] md:w-[20.55px] md:h-[20.6px]",
							)}
						>
							<InstagramSvg color="#000" />
						</FansView>
					),
					onPress: onPressInstagram,
				},
				{
					icon: (
						<FansView
							style={tw.style(
								"w-[16.96px] h-[19.34px] md:w-[17.77px] md:h-[20.26px]",
							)}
						>
							<TikTokSvg />
						</FansView>
					),
					onPress: onPressTikTok,
				},
			].map((item, i) => (
				<TouchableOpacity key={i} onPress={item.onPress}>
					<FansView
						style={tw.style(
							"w-[45px] h-[45px]",
							"border border-fans-grey rounded-full",
						)}
						center
					>
						{item.icon}
					</FansView>
				</TouchableOpacity>
			))}
		</FansView>
	);

	return (
		<FansView
			background="fans-white"
			style={tw.style("py-[54px] md:pt-[90px] md:pb-[95px]")}
		>
			<FansView
				flexWrap="wrap"
				style={tw.style(
					"px-[18px] md:px-[140px] md:flex-col lg:flex-row",
				)}
			>
				<FansView style={tw.style("md:w-full lg:w-1/2 mb-15 lg:mb-0")}>
					<FansView
						style={tw.style("hidden md:flex md:mx-auto lg:ml-0")}
					>
						<TitleSvg color="#000" width={170} height={42} />
						<FansGap height={34} />
					</FansView>

					<FypText
						fontSize={{ xs: 29, md: 27 }}
						fontWeight={tw.prefixMatch("md") ? 600 : 700}
						lineHeight={{ xs: 40, md: 35 }}
						color="black-1d"
						style={tw.style("text-center lg:text-left")}
					>
						Where visionaries{"\n"}build empires
					</FypText>
					<FansView
						margin={{ t: 35 }}
						style={tw.style("hidden md:flex md:mx-auto lg:mx-0")}
					>
						<Socials />
					</FansView>
					<FansGap height={{ xs: 0, md: 40 }} />
					<FansView style={tw.style("hidden md:flex")}>
						<FypText
							fontSize={19}
							lineHeight={33}
							color="black"
							style={tw.style("text-center lg:text-left")}
						>
							©2023 FYP.Fans
						</FypText>
					</FansView>
					<FansView
						style={tw.style(
							"flex-row gap-[10px] hidden md:flex md:mx-auto lg:mx-0",
						)}
						margin={{ t: 90 }}
					>
						<FansView style={tw.style("w-[42px] h-[27px]")}>
							<VisaCardImage />
						</FansView>
						<FansView style={tw.style("w-[41px] h-[27px]")}>
							<MasterCardImage />
						</FansView>
						<FansView style={tw.style("w-[42px] h-[27px]")}>
							<ExpressCardImage />
						</FansView>
						<FansView style={tw.style("w-[41px] h-[27px]")}>
							<DiscoverCardImage />
						</FansView>
						<FansView style={tw.style("w-[68.91px] h-[26.36px]")}>
							<DSSCardImage />
						</FansView>
						<FansView style={tw.style("w-[73px] h-[27px]")}>
							<GDPRCardImage />
						</FansView>
					</FansView>
				</FansView>
				<FansView
					style={tw.style(
						"flex-col md:flex-row flex-1 gap-[56px] md:gap-0",
					)}
				>
					<FansView
						style={tw.style("flex-1 items-center md:items-start")}
					>
						<FypText
							fontSize={{ xs: 16, md: 19 }}
							lineHeight={33}
							fontWeight={700}
							color="black-2e"
							style={tw.style("mb-[25px] md:mb-11")}
						>
							RESOURCES
						</FypText>
						<FansView
							style={tw.style(
								"gap-6 items-center md:items-start",
							)}
						>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressSupport}
							>
								Support
							</FansText>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressContact}
							>
								Contact
							</FansText>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressBlog}
							>
								Blog
							</FansText>
						</FansView>
					</FansView>
					<FansView
						style={tw.style("flex-1 items-center md:items-start")}
					>
						<FypText
							fontSize={{ xs: 16, md: 19 }}
							lineHeight={33}
							fontWeight={700}
							color="black-2e"
							style={tw.style("mb-[25px] md:mb-11")}
						>
							POLICY
						</FypText>
						<FansView style={tw.style("gap-6")}>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressTerm}
							>
								Terms of Use
							</FansText>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressPrivacy}
							>
								Privacy Policy
							</FansText>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressCookie}
							>
								Cookie Notice
							</FansText>
						</FansView>
					</FansView>
					<FansView
						style={tw.style("flex-1 items-center md:items-start")}
					>
						<FypText
							fontSize={{ xs: 16, md: 19 }}
							lineHeight={33}
							fontWeight={700}
							color="black-2e"
							style={tw.style("mb-[25px] md:mb-11")}
						>
							INFO
						</FypText>
						<FansView
							style={tw.style(
								"gap-6 items-center md:items-start",
							)}
						>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressCompany}
							>
								Company
							</FansText>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
								onPress={onPressDiscord}
							>
								Discord Community
							</FansText>
							<FansText
								fontSize={{ xs: 16, md: 20 }}
								lineHeight={33}
								color="black"
							>
								support@fyp.fans
							</FansText>
						</FansView>
					</FansView>
				</FansView>
			</FansView>

			<FansView
				alignItems="center"
				style={tw.style("flex md:hidden mt-14")}
			>
				<FansView>
					<Socials />
				</FansView>
				<FansView margin={{ t: 20 }}>
					<FypText fontSize={16} lineHeight={33} color="black">
						©2023 FYP.Fans
					</FypText>
				</FansView>
			</FansView>

			<FansView
				padding={{ l: 24, r: 4 }}
				margin={{ t: 58 }}
				style={tw.style("md:hidden")}
			>
				<TitleSvg color="#000" style={tw.style("w-full h-auto")} />
			</FansView>
		</FansView>
	);
};

interface RoleButtonProps extends PressableProps {
	title: string;
	isSelected: boolean;
}

const RoleButton: FC<RoleButtonProps> = (props) => {
	const { title, isSelected, ..._props } = props;
	return (
		<Pressable
			style={tw.style(
				"px-6 py-[10px] md:px-10 md:py-5 rounded-100px",
				isSelected ? "bg-fans-black-1d" : "border border-fans-grey-de",
			)}
			{..._props}
		>
			<FypText
				fontSize={{ xs: 17, md: 19 }}
				lineHeight={{ xs: 22, md: 26 }}
				fontWeight={500}
				style={tw.style(
					isSelected ? `text-fans-white` : "text-fans-black-2e",
				)}
			>
				{title}
			</FypText>
		</Pressable>
	);
};

interface CreatorProps {
	name: string;
	description: string;
	picture?: string;
	link: string;
	count?: number;
	localImage?: ImageSourcePropType;
}

const CreatorCard: FC<CreatorProps> = (props) => {
	const { name, description, picture, link, count, localImage } = props;
	const [openLink] = useBlankLink();

	const onPress = () => {
		if (link !== "") {
			openLink(link);
		}
	};

	return (
		<Pressable
			onPress={onPress}
			style={tw.style(
				"w-[285px] md:flex-1 md:max-w-[360px] border border-fans-grey-f0 rounded-[15px]",
			)}
		>
			<FansView height={{ xs: 285, md: 360 }}>
				<Image
					source={localImage ? localImage : { uri: picture }}
					style={tw.style("w-full h-full rounded-t-[15px]")}
					resizeMode="cover"
				/>
			</FansView>
			<FansView
				style={tw.style(
					"pt-[14px] px-4 pb-5 md:pt-[18px] md:px-4 md:pb-[24px]",
				)}
			>
				<FypText
					fontSize={{ xs: 21, md: 26 }}
					lineHeight={{ xs: 28, md: 35 }}
					color="black-2e"
					fontWeight={700}
					style={tw.style("mb-3 md:mb-[15px]")}
				>
					{name}
				</FypText>
				<FypText
					fontSize={{ xs: 16, md: 17 }}
					lineHeight={{ xs: 23, md: 26 }}
					color="black"
					numberOfLines={2}
					style={tw.style("mb-[15px] md:mb-4")}
				>
					{description}
				</FypText>
				<FypNullableView visible={!!count}>
					<FansView flexDirection="row" alignItems="center" gap={5}>
						{/* <FypSvg svg={Gem2Image} width={16} height={15} /> */}
						<Image
							source={{
								uri: require("@assets/images/common/gem.webp"),
							}}
							style={tw.style("w-4 h-[15px]")}
							resizeMode="contain"
						/>

						<FypText
							fontSize={17}
							lineHeight={33}
							fontWeight={500}
							color="grey-48"
						>
							{`${formatNumber(count ?? null)} followers`}
						</FypText>
					</FansView>
				</FypNullableView>
			</FansView>
		</Pressable>
	);
};

const CreatorsSection = () => {
	const [role, setRole] = useState(creatorRoles[0]);

	return (
		<FansView
			background="fans-white"
			justifyContent="center"
			style={tw.style(
				"min-h-screen md:px-5 lg:px-[60px] xl:px-[148px] md:py-10",
			)}
		>
			<FansView>
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					fontWeight={500}
					lineHeight={{ md: 100 }}
					textAlign="center"
					style={tw.style("text-fans-black-1d")}
				>
					Meet our creators
				</FypText>
				<FansGap height={{ xs: 23, md: 38 }} />
				<FypText
					fontSize={{ xs: 17, md: 27 }}
					lineHeight={{ xs: 26, md: 43 }}
					textAlign="center"
					style={tw.style("text-fans-black-1d")}
				>
					Creators have earned{" "}
					<FypText
						fontSize={{ xs: 17, md: 27 }}
						lineHeight={{ xs: 26, md: 43 }}
						fontWeight={600}
						style={tw.style("text-fans-green-04")}
					>
						$1,000,000+
					</FypText>{" "}
					this month
				</FypText>
				<FansGap height={{ xs: 22, md: 64 }} />
				<FansView style={tw.style("mb-8 md:mb-12")}>
					<FypNullableView visible={!tw.prefixMatch("md")}>
						<ScrollView style={tw.style("w-full")} horizontal>
							<FansView
								flexDirection="row"
								gap={7}
								justifyContent="center"
								padding={{ x: 18 }}
							>
								{creatorRoles.map((el) => (
									<RoleButton
										key={el}
										title={el}
										isSelected={el === role}
										onPress={() => setRole(el)}
									/>
								))}
							</FansView>
						</ScrollView>
					</FypNullableView>

					<FypNullableView visible={tw.prefixMatch("md")}>
						<FansView
							flexDirection="row"
							gap={20}
							justifyContent="center"
						>
							{creatorRoles.map((el) => (
								<RoleButton
									key={el}
									title={el}
									isSelected={el === role}
									onPress={() => setRole(el)}
								/>
							))}
						</FansView>
					</FypNullableView>
				</FansView>

				<ScrollView
					style={tw.style("w-full px-[18px] md:px-0 md:hidden")}
					horizontal
				>
					<FansView flexDirection="row" gap={14}>
						{creatorsData
							.filter((el) => el.type === role)
							.map((creator) => (
								<CreatorCard
									key={creator.name}
									name={creator.name}
									description={creator.description}
									picture={creator.picture}
									link={creator.link}
									count={creator.count}
									localImage={creator.localImage}
								/>
							))}
					</FansView>
				</ScrollView>
				<FansView
					flexDirection="row"
					gap={63}
					style={tw.style("hidden md:flex")}
				>
					{creatorsData
						.filter((el) => el.type === role)
						.map((creator) => (
							<CreatorCard
								key={creator.name}
								name={creator.name}
								description={creator.description}
								picture={creator.picture}
								link={creator.link}
								count={creator.count}
								localImage={creator.localImage}
							/>
						))}
				</FansView>
			</FansView>
		</FansView>
	);
};

interface CreatorUserInfo {
	data: IProfile & { username?: string };
}

export const CreatorUser: FC<CreatorUserInfo> = (props) => {
	const { data } = props;
	const [openLink] = useBlankLink();

	const onPress = () => {
		const url = createURL(`/${data.username}`);
		openLink(url);
	};

	return (
		<FansView
			gap={{ xs: 18, md: 21 }}
			pressableProps={{
				onPress: onPress,
			}}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				gap={{ xs: 20, md: 23 }}
			>
				<UserAvatar
					image={data.avatar}
					size={tw.prefixMatch("md") ? "71px" : "60px"}
				/>
				<FansView flex="1" gap={{ xs: 4, md: 2 }}>
					<FypText
						fontSize={{ xs: 17, md: 19 }}
						lineHeight={{ xs: 22, md: 26 }}
						fontWeight={700}
						color="black-2e"
						numberOfLines={1}
					>
						{data.displayName}
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-fans-grey-48")}
						numberOfLines={2}
					>
						{data.bio}
					</FypText>
				</FansView>
			</FansView>
			<FansDivider />
		</FansView>
	);
};

const BannerSection = () => {
	const router = useRouter();

	const [showSearchForm, setShowSearchForm] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [users, setUsers] = useState<ProfilesRespBody>({
		profiles: [],
		page: 1,
		total: 0,
		size: 10,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [username, setUsername] = useState("");
	const [prefixWidth, setPrefixWidth] = useState(0);

	const searchFormOpacity = useSharedValue(0);
	const findBtnOpacity = useSharedValue(1);

	const searchFormStyle = useAnimatedStyle(() => {
		return {
			opacity: searchFormOpacity.value,
		};
	});
	const findBtnStyle = useAnimatedStyle(() => {
		return {
			opacity: findBtnOpacity.value,
		};
	});

	const onClickFindCreator = () => {
		findBtnOpacity.value = withTiming(0, {
			duration: 0,
			easing: Easing.linear,
		});
		searchFormOpacity.value = withTiming(1, {
			duration: 500,
			easing: Easing.linear,
		});
		setShowSearchForm(true);
	};

	const onCancelSearch = () => {
		searchFormOpacity.value = withTiming(0, {
			duration: 500,
			easing: Easing.linear,
		});
		findBtnOpacity.value = withTiming(1, {
			duration: 500,
			easing: Easing.linear,
		});
		setShowSearchForm(false);
	};

	const onChangeSearch = (query: string) => {
		setSearchQuery(query);
		setUsers({
			...users,
			page: 1,
			total: 0,
		});
	};

	const handlePressLogIn = () => {
		router.push("/auth/login");
	};

	const handlePressSignUp = () => {
		router.push("/auth/register");
	};

	const fetchUsers = async () => {
		if (searchQuery === "") {
			return;
		}
		const params = {
			page: users.page,
			size: 10,
			query: searchQuery,
		};
		const resp = await searchCreators(params);
		if (resp.ok) {
			setUsers({
				...resp.data,
				profiles:
					resp.data.page === 1
						? resp.data.profiles
						: [...users.profiles, ...resp.data.profiles],
			});
			setIsLoading(false);
		}
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !isLoading) {
			if (users.total > 10 * users.page) {
				setIsLoading(true);
				setUsers({
					...users,
					page: users.page + 1,
				});
			}
		}
	};

	const onStartCreate = () => {
		router.push(`/auth/register?username=${username}`);
	};

	useEffect(() => {
		setSearchQuery("");
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [searchQuery, users.page]);

	return (
		<FansView
			position="relative"
			style={tw.style(
				"pb-4 md:pb-0 pt-0 md:pt-[86px] min-h-screen justify-end md:justify-center",
			)}
		>
			<Image
				source={require("@assets/images/landing/banner-bg.webp")}
				style={tw.style(
					"w-full h-full absolute top-0 left-0 hidden sm:flex",
				)}
				resizeMode="cover"
			/>
			<Image
				source={require("@assets/images/landing/banner-bg-mobile.webp")}
				style={tw.style(
					"w-full h-full absolute top-0 left-0 sm:hidden",
				)}
				resizeMode="cover"
			/>

			<FansView
				position="absolute"
				style={tw.style(
					"w-full px-[18px] md:px-5 lg:px-[60px] xl:px-[148px] top-6 md:top-[58px] z-90",
				)}
			>
				<FansView
					position="relative"
					style={tw.style("w-full")}
					flexDirection="row"
					justifyContent="center"
					alignItems="center"
					height={{ xs: 42, md: 66 }}
				>
					<FansView
						position="absolute"
						style={tw.style(
							"top-0 left-0 w-full md:w-[320px] lg:w-[37%] md:max-w-[602px]",
						)}
					>
						<FypNullableView visible={!showSearchForm}>
							<Animated.View style={findBtnStyle}>
								<FypButton
									style={tw.style(
										"border border-white rounded-[100px] w-[234px] h-[66px] gap-[10px] hidden md:flex",
									)}
									textStyle={tw.style(
										"text-[21px] leading-[28px] text-white font-medium",
									)}
									icon={<SearchSvg color="#fff" size={18} />}
									onPress={onClickFindCreator}
								>
									Find a creator
								</FypButton>
							</Animated.View>
						</FypNullableView>
						<FypNullableView visible={showSearchForm}>
							<OutsidePressHandler
								onOutsidePress={onCancelSearch}
							>
								<Animated.View
									style={[
										tw.style("relative"),
										searchFormStyle,
									]}
								>
									<FansView
										width={{ xs: 14, md: 22 }}
										height={{ xs: 14, md: 22 }}
										position="absolute"
										style={tw.style(
											"top-[14px] left-[18px] md:top-[22px] md:left-[26px]",
										)}
									>
										<SearchSvg color="#fff" />
									</FansView>
									<TextInput
										style={[
											tw.style(
												"text-[17px] leading-[22px] md:text-[24px] md:leading-[32px] text-white font-medium bg-fans-white/30 rounded-[100px]",
												"px-11 md:px-[59px] h-[42px] md:h-[66px]",
											),
											Platform.OS === "web" && {
												outlineColor:
													"rgba(255,255,255,0.3)",
											},
										]}
										value={searchQuery}
										onChangeText={(val) =>
											onChangeSearch(val)
										}
									/>
									<FansIconButton
										backgroundColor="bg-fans-black"
										style={tw.style(
											"absolute top-2 right-[10px] md:top-[18px] md:right-5",
										)}
										size={tw.prefixMatch("md") ? 30 : 26}
										onPress={onCancelSearch}
									>
										<FansView
											width={{ xs: 10, md: 13 }}
											height={{ xs: 10, md: 13 }}
										>
											<CloseSvg color="#fff" />
										</FansView>
									</FansIconButton>
								</Animated.View>

								<FypNullableView
									visible={users.profiles.length > 0}
								>
									<FansView
										background="fans-white"
										borderRadius={15}
										style={tw.style(
											"pt-7 md:pb-[30px] px-[18px] mt-[17px] md:p-7 md:mt-6 max-h-[536px] md:max-h-[740px] z-90",
										)}
									>
										<ScrollView
											showsVerticalScrollIndicator={true}
											onScroll={({ nativeEvent }) =>
												onScrollView(nativeEvent)
											}
											scrollEventThrottle={30}
										>
											<FansView gap={17}>
												{users.profiles.map(
													(user, index) => (
														<CreatorUser
															data={user}
															key={`${user.id}-${index}`}
														/>
													),
												)}
											</FansView>
										</ScrollView>
									</FansView>
								</FypNullableView>
							</OutsidePressHandler>
						</FypNullableView>
					</FansView>

					<FypNullableView visible={!showSearchForm}>
						<FansView
							position="absolute"
							style={tw.style("left-0 md:hidden")}
						>
							<FypSvg
								svg={SingleGem}
								color="fans-white"
								width={37}
								height={34}
							/>
						</FansView>
					</FypNullableView>
					<DiamondTextLogoSvg
						width={269}
						height={52}
						style={tw.style("hidden md:flex")}
					/>

					<FansView
						flexDirection="row"
						alignItems="center"
						gap={{ xs: 7, md: 20 }}
						position="absolute"
						style={tw.style(
							"top-0 right-0",
							showSearchForm ? "hidden md:flex" : "",
						)}
					>
						<FypButton2
							style={tw.style(
								"w-22 md:w-[126px] h-[42px] md:h-[66px] border border-fans-white",
							)}
							textStyle={tw.style(
								"text-fans-white font-semibold text-[17px] md:leading-[22px] md:text-[21px] md:leading-[28px]",
							)}
							pressableProps={{
								onPress: handlePressLogIn,
							}}
						>
							Log in
						</FypButton2>
						<FypButton2
							style={tw.style(
								"w-[132px] md:w-[174px] bg-fans-white h-[42px] md:h-[66px]",
							)}
							textStyle={tw.style(
								"text-fans-black-2e font-semibold text-[17px] md:leading-[22px] md:text-[21px] md:leading-[28px]",
							)}
							pressableProps={{
								onPress: handlePressSignUp,
							}}
						>
							Get started
						</FypButton2>
						<FansIconButton
							size={42}
							backgroundColor="bg-fans-black-1d"
							onPress={onClickFindCreator}
							style={tw.style("md:hidden")}
						>
							<SearchSvg size={17} color="#fff" />
						</FansIconButton>
					</FansView>
				</FansView>
			</FansView>

			<FansView
				style={tw.style("px-[18px] w-full md:max-w-[910px] sm:mx-auto")}
			>
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					lineHeight={{ xs: 40, md: 100 }}
					fontWeight={500}
					color="white"
					textAlign="center"
					style={tw.style("mb-[28px] md:mb-[40px]")}
				>
					{`Make money creating${`\n`}the content you love`}
				</FypText>
				<FansView margin={{ b: 60 }} style={tw.style("hidden md:flex")}>
					<FypText
						fontSize={{ xs: 16, md: 27 }}
						lineHeight={{ xs: 29, md: 43 }}
						color="white"
						textAlign="center"
						fontWeight={500}
					>
						Start a membership, set up a digital shop, accept
						donations.
					</FypText>
					<FypText
						fontSize={{ xs: 16, md: 27 }}
						lineHeight={{ xs: 29, md: 43 }}
						color="white"
						textAlign="center"
						fontWeight={500}
					>
						Sell anything you like. It’s easier than you think
					</FypText>
				</FansView>

				<FansView
					position="relative"
					style={tw.style("sm:max-w-[748px] w-full")}
					alignSelf="center"
				>
					<FansView position="relative">
						<TextInput
							style={[
								tw.style(
									"bg-fans-white h-14 md:h-[82px] rounded-[100px] text-[21px] leading-[28px] md:text-[28px] md:leading-[37px] font-medium",
									"pl-[117px] md:pl-[173px]",
								),
								Platform.OS === "web" && {
									outlineColor: "#fff",
								},
							]}
							autoCapitalize="none"
							value={username}
							onChangeText={setUsername}
							placeholder="yourname"
							placeholderTextColor="#b1b1b1"
						/>
						<View
							style={[
								tw.style(
									"absolute left-[117px] md:left-[173px] top-[14.5px] md:top-[22.5px]",
									prefixWidth === 0 && "opacity-0",
								),
								{
									transform: [
										{ translateX: prefixWidth * -1 },
									],
								},
							]}
						>
							<FypText
								fontSize={{ xs: 21, md: 28 }}
								lineHeight={{ xs: 28, md: 37 }}
								fontWeight={600}
								onLayout={(e) => {
									setPrefixWidth(e.nativeEvent.layout.width);
								}}
							>
								fyp.fans/
							</FypText>
						</View>
					</FansView>
					<FypButton2
						style={tw.style(
							"mt-[15px] md:mt-0 md:absolute",
							"h-14 md:h-[66px] w-full md:w-[224px] rounded-[100px] bg-fans-black-1d",
							"md:top-2 md:right-2",
						)}
						textStyle={tw.style(
							"text-[19px] leading-[26px] md:text-[21px] md:leading-[28px] font-semibold text-fans-white",
						)}
						pressableProps={{
							onPress: onStartCreate,
						}}
					>
						Start creating
					</FypButton2>
				</FansView>

				<FypText
					fontSize={{ xs: 15, md: 24 }}
					style={tw.style(
						"font-semibold md:font-normal mt-4 md:mt-9 leading-[33px] md:leading-[36px]",
					)}
					color="white"
					textAlign="center"
				>
					It's free, and takes only one minute
				</FypText>

				<FansView
					width={34}
					height={34}
					borderRadius={34}
					alignItems="center"
					justifyContent="center"
					alignSelf="center"
					margin={{ t: 12 }}
					style={tw.style("md:hidden")}
				>
					<FypSvg
						svg={ChevronDownSvg}
						color="fans-white"
						width={13}
						height={7}
					/>
				</FansView>
			</FansView>
		</FansView>
	);
};

const SmarterSection = () => {
	const router = useRouter();
	const handleStart = () => {
		router.push("/auth/register");
	};
	return (
		<FansView
			position="relative"
			gap={{ xs: 58, lg: 133 }}
			style={tw.style(
				"min-h-screen flex-col-reverse lg:flex-row justify-center lg:justify-between lg:items-center",
				"px-[18px] md:px-5 lg:px-[60px] xl:px-[148px]",
				"md:py-10 lg:py-0",
			)}
		>
			<FypLinearGradientView
				colors={["#D885FF", "#F98C28", "#5F17D3", "#F1E2FF"]}
				start={[0, 1]}
				end={[1, 0]}
				position="absolute"
				style={tw.style("w-full h-full top-0 left-0 opacity-40")}
			></FypLinearGradientView>
			<FansView style={tw.style("lg:flex-1")}>
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					lineHeight={{ xs: 40, md: 100 }}
					fontWeight={500}
					color="black-1d"
				>
					{`Sell smarter,${
						tw.prefixMatch("md") ? `\n` : " "
					}not harder`}
				</FypText>
				<FansGap height={{ xs: 16, md: 36 }} />
				<FansView>
					<FypText
						fontSize={{ xs: 17, md: 27 }}
						lineHeight={{ xs: 26, md: 42 }}
						color="black-1d"
						style={tw.style("hidden md:flex")}
					>
						Effortlessly sell exclusive content on our platform with
						flexible pricing and easy management. Let our tools
						handle the complexity, allowing you to focus on
						creativity while watching your fanbase and finances grow
					</FypText>
					<FypText
						fontSize={{ xs: 17, md: 27 }}
						lineHeight={{ xs: 26, md: 42 }}
						color="black-1d"
						style={tw.style("md:hidden")}
					>
						Effortlessly sell exclusive content on our platform. Let
						our tools handle the complexity, allowing you to focus
						on creating content
					</FypText>
				</FansView>

				<FansGap height={{ xs: 48, md: 50 }} />
				<FypButton2
					style={tw.style(
						"w-full md:w-[214px] h-[42px] md:h-[66px] border border-fans-black-1d",
					)}
					textStyle={tw.style(
						"text-[17px] leading-[22px] md:text-[21px] font-semibold md:leading-7 text-fans-black-1d",
					)}
					pressableProps={{
						onPress: handleStart,
					}}
				>
					Start creating
				</FypButton2>
			</FansView>
			<FansView
				height={{ xs: 356, md: 550, lg: 708 }}
				style={tw.style("lg:flex-1")}
			>
				<Image
					source={{
						uri: tw.prefixMatch("lg")
							? require("@assets/images/landing/sell-smarter.webp")
							: require("@assets/images/landing/sell-smarter-mobile.webp"),
					}}
					style={tw.style("w-full h-full")}
					resizeMode="contain"
				/>
			</FansView>
		</FansView>
	);
};

const EarningsSection = () => {
	const router = useRouter();
	const handleStart = () => {
		router.push("/auth/register");
	};
	return (
		<FansView
			position="relative"
			gap={{ xs: 80, lg: 109 }}
			style={tw.style(
				"bg-fans-black-1d min-h-screen lg:flex-row justify-center lg:justify-between lg:items-center",
				"px-[18px] md:px-5 lg:px-[60px] xl:px-[148px]",
				"md:py-10 lg:py-0",
			)}
		>
			<FansView
				height={{ xs: 320, md: 500, lg: 651 }}
				style={tw.style("lg:flex-1")}
			>
				<Image
					source={{
						uri: tw.prefixMatch("md")
							? require("@assets/images/landing/double-earning.webp")
							: require("@assets/images/landing/double-earning-mobile.webp"),
					}}
					style={tw.style("w-full h-full")}
					resizeMode="contain"
				/>
			</FansView>
			<FansView style={tw.style("lg:flex-1")}>
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					lineHeight={{ xs: 40, md: 100 }}
					fontWeight={500}
					color="white"
				>
					{`Double${tw.prefixMatch("md") ? `\n` : " "}your earnings`}
				</FypText>
				<FansGap height={{ xs: 16, md: 40 }} />
				<FypText
					fontSize={{ xs: 17, md: 27 }}
					lineHeight={{ xs: 26, md: 42 }}
					color="white"
				>
					Enjoy one of the industry’s lowest platform fees at just 7%.
					Retain more of your earnings with FYP.Fans
				</FypText>
				<FansGap height={{ xs: 48, md: 50 }} />
				<FypButton2
					style={tw.style(
						"w-full md:w-[214px] h-[42px] md:h-[66px] border border-fans-white",
					)}
					textStyle={tw.style(
						"text-[17px] leading-[22px] md:text-[21px] font-semibold md:leading-7 text-fans-white",
					)}
					pressableProps={{
						onPress: handleStart,
					}}
				>
					Get started
				</FypButton2>
			</FansView>
		</FansView>
	);
};

const SmartDataSection = () => {
	const router = useRouter();
	const [imgWidth, setImgWidth] = useState(670);
	const [imgRate, setImgRate] = useState(1);
	const handleStart = () => {
		router.push("/auth/register");
	};

	const getImageDimensions = async () => {
		await Image.getSize(
			require("@assets/images/landing/smart-data.webp"),
			(width, height) => {
				setImgRate(height / width);
			},
		);
	};

	useEffect(() => {
		getImageDimensions();
	}, []);

	return (
		<FansView
			position="relative"
			gap={{ xs: 55, lg: 0 }}
			style={tw.style(
				"min-h-screen flex-col-reverse lg:flex-row justify-center lg:justify-between",
				"px-[18px] md:px-5 lg:px-[60px] xl:px-[148px]",
				"md:py-10 lg:py-0",
			)}
		>
			<FypLinearGradientView
				colors={["#9DD8F5", "#91EBF3", "#2125EA", "#D885FF"]}
				start={[0, 1]}
				end={[1, 0]}
				position="absolute"
				style={tw.style("w-full h-full top-0 left-0 opacity-40")}
			></FypLinearGradientView>
			<FansView style={tw.style("md:flex-1 lg:w-[44%] md:my-auto")}>
				<FansView>
					<FypText
						fontSize={{ xs: 30, md: 85 }}
						lineHeight={{ xs: 40, md: 100 }}
						fontWeight={500}
						color="black-1d"
						numberOfLines={1}
						style={tw.style("overflow-visible whitespace-nowrap")}
					>
						{tw.prefixMatch("md")
							? `Growth through,`
							: "Growth through"}
					</FypText>
					<FypText
						fontSize={{ xs: 30, md: 85 }}
						lineHeight={{ xs: 40, md: 100 }}
						fontWeight={500}
						color="black-1d"
					>
						smart data
					</FypText>
				</FansView>

				<FansGap height={{ xs: 18, md: 37 }} />
				<FansView>
					<FypText
						fontSize={{ xs: 17, md: 27 }}
						lineHeight={{ xs: 26, md: 42 }}
						color="black-1d"
						style={tw.style("lg:max-w-[710px] hidden md:flex")}
					>
						Utilize our advanced analytics for clear insights into
						audience behaviors and preferences. Make informed
						decisions with easy-to-understand metrics, predict
						trends, and stay ahead of the game!
					</FypText>
					<FypText
						fontSize={{ xs: 17, md: 27 }}
						lineHeight={{ xs: 26, md: 42 }}
						color="black-1d"
						style={tw.style("md:hidden")}
					>
						Utilize our advanced analytics for clear insights into
						your audience. Make informed decisions with
						easy-to-understand metrics, predict trends, and stay
						ahead of the game!
					</FypText>
				</FansView>

				<FansGap height={{ xs: 23, md: 58 }} />
				<FypButton2
					style={tw.style(
						"w-full md:w-[214px] h-[42px] md:h-[66px] border border-fans-black-1d",
					)}
					textStyle={tw.style(
						"text-[17px] leading-[22px] md:text-[21px] font-semibold md:leading-7 text-fans-black-1d",
					)}
					pressableProps={{
						onPress: handleStart,
					}}
				>
					Start creating
				</FypButton2>
			</FansView>
			<FansView
				style={tw.style(
					"md:flex-1 lg:w-[41%] md:mt-auto md:max-w-[670px]",
				)}
			>
				<FansView
					width="full"
					height={{ xs: 313, sm: 450, lg: imgRate * imgWidth }}
					style={tw.style("md:ml-5")}
					onLayout={(e) => setImgWidth(e.nativeEvent.layout.width)}
				>
					<Image
						source={{
							uri: tw.prefixMatch("lg")
								? require("@assets/images/landing/smart-data.webp")
								: require("@assets/images/landing/smart-data-mobile.webp"),
						}}
						style={tw.style("w-full h-full")}
						resizeMode="contain"
					/>
				</FansView>
			</FansView>
		</FansView>
	);
};

interface PlatformItemProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	children?: React.ReactNode;
}

const PlatformItem: FC<PlatformItemProps> = (props) => {
	const { icon, title, description, children } = props;
	return (
		<FansView style={tw.style("md:flex-1")}>
			<FansView height={{ xs: 51, md: 58 }}>{icon}</FansView>
			<FansGap height={{ xs: 18, md: 23 }} />
			<FypText
				fontSize={{ xs: 22, md: 30 }}
				lineHeight={{ xs: 30, md: 40 }}
				fontWeight={600}
				color="white"
			>
				{title}
			</FypText>
			<FansGap height={{ xs: 22, md: 30 }} />
			<FypText
				fontSize={{ xs: 17, md: 27 }}
				lineHeight={{ xs: 30, md: 42 }}
				color="white"
			>
				{description}
			</FypText>
			{children}
		</FansView>
	);
};

const PlatformsSection = () => {
	const router = useRouter();
	const handleStart = () => {
		router.push("/auth/register");
	};
	return (
		<FansView
			style={tw.style(
				"min-h-screen bg-fans-black-1d justify-center",
				"px-[18px] md:px-5 lg:px-[60px] xl:px-[148px]",
				"pt-[50px] pb-12 lg:pt-0 lg:pb-0",
			)}
		>
			<FypText
				fontSize={{ xs: 30, md: 85 }}
				lineHeight={{ xs: 40, md: 100 }}
				fontWeight={500}
				color="white"
				textAlign="center"
			>
				Make 200% or more,{`\n`}
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					lineHeight={{ xs: 40, md: 100 }}
					fontWeight={500}
					color="grey-70"
					textAlign="center"
				>
					compared to other platforms
				</FypText>
			</FypText>
			<FansGap height={{ xs: 30, md: 80 }} />
			<FansView style={tw.style("lg:flex-row")} gap={{ xs: 50, md: 109 }}>
				<PlatformItem
					icon={
						<FypSvg
							svg={ShopImage}
							width={{ xs: 36, md: 44 }}
							height={{ xs: 46, md: 55 }}
						/>
					}
					title="More selling options"
					description="Unlike competitors, we have packed our platform with ways to sell your content and likeness. Sell Video Calls, Custom Cameo’s, Messages, Live Streams, and more"
				/>
				<PlatformItem
					icon={
						<FypSvg
							svg={TwoStarsImage}
							width={{ xs: 50, md: 59 }}
							height={{ xs: 50, md: 59 }}
						/>
					}
					title="More than just memberships"
					description="Content creators who formerly relied solely on Patreon or OnlyFans experienced a significant boost in their income by introducing options for one-time contributions"
				/>
				<PlatformItem
					icon={
						<FypSvg
							svg={PrivacyImage}
							width={{ xs: 43, md: 48 }}
							height={{ xs: 51, md: 56 }}
						/>
					}
					title="Privacy & security as a priority"
					description="With our cutting-edge payment security, you will not have to worry about anything. Let us do the heavy lifting so you can focus on creating"
				>
					<FansView
						flexDirection="row"
						gap={20}
						margin={{ t: 12 }}
						style={tw.style("hidden md:flex")}
					>
						<FypSvg
							svg={DiscoverSvg}
							width={63}
							height={11}
							color="fans-grey-70"
						/>
						<FypSvg
							svg={PciDssSvg}
							width={60}
							height={23}
							color="fans-grey-70"
						/>
						<FypSvg
							svg={GDPRSvg}
							width={61}
							height={24}
							color="fans-grey-70"
						/>
					</FansView>
				</PlatformItem>
			</FansView>
			<FansGap height={{ xs: 48, lg: 82 }} />
			<FansView alignItems="center" width="full">
				<FypButton2
					style={tw.style(
						"w-full md:w-[208px] bg-fans-white h-[42px] md:h-[66px]",
					)}
					textStyle={tw.style(
						"text-[17px] leading-[22px] text-fans-black-1d font-semibold md:text-[21px] md:leading-[28px]",
					)}
					pressableProps={{
						onPress: handleStart,
					}}
				>
					Get started
				</FypButton2>
			</FansView>
		</FansView>
	);
};

interface FaqItemProps {
	title: string;
	children?: React.ReactNode;
}

const FaqItem: FC<FaqItemProps> = (props) => {
	const { title, children } = props;
	const rotate = useSharedValue(0);
	const [collpased, setCollapsed] = useState(true);

	const animationStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotate: withTiming(`${rotate.value}deg`, {
						duration: 300,
						easing: Easing.bezier(0.5, 0.01, 0, 1),
					}),
				},
			],
		};
	});

	const handleToggle = (val: boolean) => {
		rotate.value = val ? 0 : 180;
		setCollapsed(val);
	};

	return (
		<FansView>
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
				style={tw.style("py-7 md:py-[35px]")}
				pressableProps={{
					onPress: () => handleToggle(!collpased),
				}}
			>
				<FypText
					fontSize={{ xs: 19, md: 28 }}
					fontWeight={600}
					lineHeight={{ xs: 26, md: 37 }}
					color="black-1d"
				>
					{title}
				</FypText>
				<Animated.View
					style={[
						tw.style("w-[15px] h-[15px] md:w-[23px] md:h-[23px]"),
						animationStyle,
					]}
				>
					<FypSvg
						svg={ChevronDownSvg}
						width={{ xs: 15, md: 23 }}
						height={{ xs: 9, md: 13 }}
						color="fans-black-1d"
					/>
				</Animated.View>
			</FansView>
			<FypCollapsible collapsed={collpased}>
				<FansView style={tw.style("pb-6 md:pb-8")}>{children}</FansView>
			</FypCollapsible>
		</FansView>
	);
};

const FaqSection = () => {
	const router = useRouter();
	const [openLink] = useBlankLink();

	const [expaned, setExpanded] = useState(false);

	const handleStart = () => {
		router.push("/auth/register");
	};
	const handleContactUs = () => {
		openLink("https://support.fyp.fans/hc/en-us/");
	};

	const handleShowMore = () => {
		setExpanded(!expaned);
	};

	return (
		<FansView
			style={tw.style(
				"min-h-screen justify-center",
				"px-[18px] md:px-5 lg:px-[60px] xl:px-[148px]",
				"pt-[68px] pb-[58px]",
			)}
		>
			<FansView alignItems="center">
				<FypSvg
					svg={
						tw.prefixMatch("md")
							? FaqTitlePCImage
							: FaqTitleMobileImage
					}
					width={{ xs: 240, md: 724 }}
					height={{ xs: 65, md: 53 }}
				/>
			</FansView>
			<FansGap height={{ xs: 52, lg: 90 }} />
			<FansView flexDirection="row" alignItems="center">
				<FansView flex="1">
					<FaqItem title="How much does it cost to sign up for FYP.Fans?">
						<FypText
							fontSize={{ xs: 17, md: 24 }}
							lineHeight={{ xs: 30, md: 38 }}
							color="grey-70"
						>
							Joining FYP.Fans is absolutely free! We pride
							ourselves on offering the lowest fees in the
							industry, charging only a 7% fee once you start
							generating income, in addition to the standard rate
							for payment processing. For more detailed
							information, please visit our pricing page.
						</FypText>
					</FaqItem>
					<FansDivider style={tw.style("bg-fans-grey-de")} />
					<FaqItem title="What are my options for receiving payments?">
						<FypText
							fontSize={{ xs: 17, md: 24 }}
							lineHeight={{ xs: 30, md: 38 }}
							color="grey-70"
						>
							With FYP.Fans, your earnings are directly deposited
							into your choice of a Revolut, Bank account, or
							Payoneer account. We ensure that your funds are
							immediately available to you without any holding
							period, and there's no minimum threshold for
							withdrawals. We are committed to making the payout
							process as smooth as possible for our creators.
						</FypText>
					</FaqItem>
					<FansDivider style={tw.style("bg-fans-grey-de")} />
					<FaqItem title="How can supporters contribute to my page?">
						<FypText
							fontSize={{ xs: 17, md: 24 }}
							lineHeight={{ xs: 30, md: 38 }}
							color="grey-70"
						>
							We accept a wide variety of payment methods
							including all major credit cards such as Visa,
							Mastercard, and more, ensuring that your audience
							has no trouble supporting you.
						</FypText>
					</FaqItem>
					<FansDivider style={tw.style("bg-fans-grey-de")} />
					<FaqItem title="Is FYP.Fans secure and reliable for my supporters and me?">
						<FypText
							fontSize={{ xs: 17, md: 24 }}
							lineHeight={{ xs: 30, md: 38 }}
							color="grey-70"
						>
							Your security is our top priority. At FYP.Fans, we
							do not store any credit card information on our
							servers. Payments are securely processed using
							Authorize.net, with PCI compliance ensured through
							Cloudflare. Our platform is built on reliable
							infrastructure, supplemented by Cloudflare's
							security measures, and we implement SSL encryption
							across the site. Regular backups are performed to
							safeguard data, and we actively encourage the
							reporting of any security vulnerabilities through
							our bug bounty program, responding swiftly to
							address any issues.
						</FypText>
					</FaqItem>

					<FypCollapsible collapsed={!expaned}>
						<FansDivider style={tw.style("bg-fans-grey-de")} />
						<FaqItem title="Do I retain ownership of my supporter list?">
							<FypText
								fontSize={{ xs: 17, md: 24 }}
								lineHeight={{ xs: 30, md: 38 }}
								color="grey-70"
							>
								Absolutely. Your relationship with your
								supporters is exclusively yours. We guarantee
								that we never contact your supporters directly.
								You have the full capability to export a list of
								your supporters whenever you choose.
							</FypText>
						</FaqItem>
						<FansDivider style={tw.style("bg-fans-grey-de")} />
						<FaqItem title="Can FYP.Fans support the growth of my business?">
							<FypText
								fontSize={{ xs: 17, md: 24 }}
								lineHeight={{ xs: 30, md: 38 }}
								color="grey-70"
							>
								Indeed, FYP.Fans is designed to support creators
								at every level, including those aiming for or
								already achieving six-figure incomes. We are
								committed to growing alongside our creators,
								providing a platform that scales with your
								success.
							</FypText>
						</FaqItem>
						<FansDivider style={tw.style("bg-fans-grey-de")} />
						<FaqItem title="Who is behind FYP.Fans?">
							<FypText
								fontSize={{ xs: 17, md: 24 }}
								lineHeight={{ xs: 30, md: 38 }}
								color="grey-70"
							>
								FYP.Fans is proudly based in Colorado, United
								States, and is the flagship project of our
								company, FYP LLC. With over a decade of
								experience in software development, our large
								team has contributed to the creation of some of
								the most prominent websites and apps in the
								market. Learn more about our journey and core
								values on our company website,
								{` `}
								<FypText
									fontSize={{ xs: 17, md: 24 }}
									lineHeight={{ xs: 30, md: 38 }}
									color="purple"
									style={tw.style("underline")}
									onPress={() =>
										openLink("https://www.fyp.llc/")
									}
								>
									fyp.llc
								</FypText>
								.
							</FypText>
						</FaqItem>
						<FansDivider style={tw.style("bg-fans-grey-de")} />
						<FaqItem title="How can I get in touch with FYP.Fans?">
							<FypText
								fontSize={{ xs: 17, md: 24 }}
								lineHeight={{ xs: 30, md: 38 }}
								color="grey-70"
							>
								For any inquiries or support, you can reach us
								at support@fyp.fans. Additionally, you're
								welcome to visit our{" "}
								<FypText
									fontSize={{ xs: 17, md: 24 }}
									lineHeight={{ xs: 30, md: 38 }}
									color="purple"
									style={tw.style("underline")}
									onPress={() =>
										openLink(
											"https://support.fyp.fans/hc/en-us/",
										)
									}
								>
									contact page
								</FypText>{" "}
								to submit a form; we ensure a prompt response to
								every query.
							</FypText>
						</FaqItem>
					</FypCollapsible>

					<FansGap height={{ md: 32 }} />
					<FansView
						width={47}
						height={47}
						borderRadius={47}
						alignItems="center"
						justifyContent="center"
						alignSelf="center"
						style={tw.style(
							"border border-fans-black-1d md:hidden",
						)}
						pressableProps={{
							onPress: handleShowMore,
						}}
					>
						<FypSvg
							svg={expaned ? MinusSvg : PlusSvg}
							width={25}
							height={25}
							color="fans-black-1d"
						/>
					</FansView>
					<FansGap height={{ xs: 50, md: 0 }} />
					<FansView
						gap={{ xs: 18, md: 14 }}
						style={tw.style("md:flex-row")}
					>
						<FypButton2
							style={tw.style(
								"w-[190px] h-[66px] border-fans-black-1d border",
								"hidden md:flex",
							)}
							textStyle={tw.style(
								"text-fans-black-1d font-semibold text-[21px] leading-[28px]",
							)}
							pressableProps={{
								onPress: handleShowMore,
							}}
						>
							{expaned ? "Show less" : `Show more`}
						</FypButton2>
						<FypButton2
							style={tw.style(
								"w-full md:w-[184px] bg-fans-black-1d h-[42px] md:h-[66px]",
							)}
							textStyle={tw.style(
								"text-[17px] leading-[22px] text-fans-white font-semibold md:text-[21px] md:leading-[28px]",
							)}
							pressableProps={{
								onPress: handleContactUs,
							}}
						>
							{tw.prefixMatch("md")
								? `Contact us`
								: "More questions? Contact us"}
						</FypButton2>
						<FypLinearGradientView
							colors={["#1D21E5", "#A854F5", "#D885FF"]}
							start={[0, 1]}
							end={[1, 0]}
							height={42}
							borderRadius={42}
							style={tw.style("md:hidden")}
						>
							<FypButton2
								textStyle={tw.style("text-fans-white")}
								pressableProps={{
									onPress: handleStart,
								}}
							>
								Get started
							</FypButton2>
						</FypLinearGradientView>
					</FansView>
				</FansView>
				<FansView
					flex="1"
					padding={{ l: 168 }}
					style={tw.style("hidden lg:flex lg:h-full")}
				>
					<FansView position="relative">
						<FansView
							width="full"
							height={{ md: 631 }}
							style={tw.style("lg:absolute lg:top-0 lg:left-0")}
						>
							<Image
								source={{
									uri: require("@assets/images/landing/faq.webp"),
								}}
								style={tw.style("w-full h-full")}
								resizeMode="contain"
							/>
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

interface SuccessStepMilestoneProps {
	step: number;
}

const SuccessStepMilestone: FC<SuccessStepMilestoneProps> = (props) => {
	const { step } = props;
	return (
		<FansView position="relative" width={3} height={{ xs: 274, md: 437 }}>
			<FypLinearGradientView
				colors={["#90DDCE", "#80C8F9", "#7C7FF5"]}
				start={[0, 0]}
				end={[0, 1]}
				width={3}
				height="full"
				borderRadius={20}
			></FypLinearGradientView>
			<FansView
				position="absolute"
				top={0}
				left={step === 0 ? -9.5 : -8.5}
				width={step === 0 ? 22 : 20}
				height={step === 0 ? 22 : 20}
				borderRadius={22}
				style={tw.style(
					step === 0
						? "border-[3px] border-fans-green-8d bg-fans-white"
						: "bg-fans-green-94 border-[4px] border-fans-white",
				)}
			></FansView>
			<FansView
				position="absolute"
				left={step === 1 ? -9.5 : -8.5}
				width={step === 1 ? 22 : 20}
				height={step === 1 ? 22 : 20}
				borderRadius={22}
				style={tw.style(
					`top-[136px] md:top-[205px]`,
					step === 1
						? "border-[3px] border-fans-blue-80 bg-fans-white"
						: "bg-fans-blue-80 border-[4px] border-fans-white",
				)}
			></FansView>
			<FansView
				position="absolute"
				bottom={step === 2 ? 0 : -4}
				left={step === 2 ? -9.5 : -8.5}
				width={step === 2 ? 22 : 20}
				height={step === 2 ? 22 : 20}
				borderRadius={22}
				style={tw.style(
					step === 2
						? "border-[3px] border-fans-purple-84 bg-fans-white"
						: "bg-fans-purple-7c border-[4px] border-fans-white",
				)}
			></FansView>
		</FansView>
	);
};

const FirstStepToSuccess = () => {
	return (
		<FansView
			padding={{ x: 40 }}
			style={tw.style("min-h-screen justify-center")}
		>
			<FansView>
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					lineHeight={{ xs: 40, md: 100 }}
					fontWeight={500}
					color="black-1d"
					textAlign="center"
				>
					3 steps to success
				</FypText>
				<FansGap height={{ xs: 36, md: 130 }} />
				<FansView
					gap={{ xs: 36, md: 0 }}
					style={tw.style("md:flex-row md:items-center")}
				>
					<FansView
						flex="1"
						style={tw.style("items-center md:items-end md:pr-20")}
					>
						<FansView
							width={{ xs: 264, md: 450 }}
							height={{ xs: 240, md: 437 }}
							position="relative"
						>
							<FansView
								width={{ xs: 123, md: 213 }}
								height={{ xs: 166, md: 286 }}
								position="absolute"
								bottom={0}
								right={0}
							>
								<Image
									source={{
										uri: tw.prefixMatch("md")
											? require("@assets/images/landing/success-step-1-2.webp")
											: require("@assets/images/landing/success-step-mobile-1-2.webp"),
									}}
									style={tw.style("w-full h-full")}
									resizeMode="contain"
								/>
							</FansView>
							<FansView
								width={{ xs: 188, md: 320 }}
								height={{ xs: 208, md: 360 }}
								position="absolute"
								top={0}
								left={0}
							>
								<Image
									source={{
										uri: tw.prefixMatch("md")
											? require("@assets/images/landing/success-step-1-1.webp")
											: require("@assets/images/landing/success-step-mobile-1-1.png"),
									}}
									style={tw.style("w-full h-full")}
									resizeMode="contain"
								/>
							</FansView>
						</FansView>
					</FansView>
					<FansView
						flexDirection="row"
						flex="1"
						gap={{ xs: 27, md: 86 }}
					>
						<SuccessStepMilestone step={0} />

						<FansView flex="1" style={tw.style("md:max-w-[570px]")}>
							<FypText
								fontSize={{ xs: 17, md: 31 }}
								lineHeight={{ xs: 22, md: 41 }}
								fontWeight={500}
								color="grey-b1"
							>
								STEP 1
							</FypText>
							<FansGap height={{ xs: 34, md: 46 }} />
							<FypSvg
								svg={FirstSuccessStepTitleImage}
								width={{ xs: 140, md: 386 }}
								height={{ xs: 69, md: 173 }}
							/>
							<FansGap height={{ xs: 20, md: 36 }} />
							<FansView>
								<FypText
									fontSize={{ xs: 17, md: 27 }}
									lineHeight={{ xs: 26, md: 42 }}
									color="black-1d"
									style={tw.style("hidden md:flex")}
								>
									Start by Signing up with your email and
									password. Click Become a Creator on the
									homepage
								</FypText>
								<FypText
									fontSize={{ xs: 17, md: 27 }}
									lineHeight={{ xs: 26, md: 42 }}
									color="black-1d"
									style={tw.style("md:hidden")}
								>
									Sign up with your email and click Become a
									Creator on the homepage to start a
									membership
								</FypText>
							</FansView>
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

const SecondStepToSuccess = () => {
	return (
		<FansView
			padding={{ x: 40 }}
			style={tw.style("min-h-screen justify-center")}
		>
			<FansView>
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					lineHeight={{ xs: 40, md: 100 }}
					fontWeight={500}
					color="black-1d"
					textAlign="center"
				>
					3 steps to success
				</FypText>
				<FansGap height={{ xs: 36, md: 130 }} />
				<FansView
					gap={{ xs: 36, md: 0 }}
					style={tw.style("md:flex-row md:items-center")}
				>
					<FansView
						flex="1"
						style={tw.style("items-center md:items-end md:pr-20")}
					>
						<FansView
							width={{ xs: 264, md: 444 }}
							height={{ xs: 240, md: 437 }}
							position="relative"
						>
							<FansView
								position="absolute"
								bottom={0}
								left={0}
								width={{ xs: 123, md: 255 }}
								height={{ xs: 165, md: 343 }}
							>
								<Image
									source={{
										uri: tw.prefixMatch("md")
											? require("@assets/images/landing/success-step-2-1.webp")
											: require("@assets/images/landing/success-step-mobile-2-1.webp"),
									}}
									style={tw.style("w-full h-full")}
									resizeMode="contain"
								/>
							</FansView>
							<FansView
								position="absolute"
								top={0}
								right={0}
								width={{ xs: 188, md: 320 }}
								height={{ xs: 208, md: 360 }}
							>
								<Image
									source={{
										uri: tw.prefixMatch("md")
											? require("@assets/images/landing/success-step-2-2.webp")
											: require("@assets/images/landing/success-step-mobile-2-2.webp"),
									}}
									style={tw.style("w-full h-full")}
									resizeMode="contain"
								/>
							</FansView>
						</FansView>
					</FansView>
					<FansView
						flexDirection="row"
						flex="1"
						gap={{ xs: 27, md: 86 }}
					>
						<SuccessStepMilestone step={1} />

						<FansView flex="1" style={tw.style("md:max-w-[570px]")}>
							<FypText
								fontSize={{ xs: 17, md: 31 }}
								lineHeight={{ xs: 22, md: 41 }}
								fontWeight={500}
								color="grey-b1"
							>
								STEP 2
							</FypText>
							<FansGap height={{ xs: 34, md: 46 }} />
							<FypSvg
								svg={SecondSuccessStepTitleImage}
								width={{ xs: 160, md: 452 }}
								height={{ xs: 69, md: 173 }}
							/>

							<FansGap height={{ xs: 20, md: 36 }} />
							<FypText
								fontSize={{ xs: 17, md: 27 }}
								lineHeight={{ xs: 26, md: 42 }}
								color="black-1d"
							>
								Choose your unique username and subscription
								price to set up your page
							</FypText>
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

const ThirdStepToSuccess = () => {
	const router = useRouter();
	const handleStart = () => {
		router.push("/auth/register");
	};
	return (
		<FansView
			padding={{ x: 40 }}
			style={tw.style("min-h-screen justify-center")}
		>
			<FansView>
				<FypText
					fontSize={{ xs: 30, md: 85 }}
					lineHeight={{ xs: 40, md: 100 }}
					fontWeight={500}
					color="black-1d"
					textAlign="center"
				>
					3 steps to success
				</FypText>
				<FansGap height={{ xs: 36, md: 130 }} />
				<FansView
					gap={{ xs: 36, md: 0 }}
					style={tw.style("md:flex-row md:items-center")}
				>
					<FansView
						flex="1"
						style={tw.style("items-center md:items-end md:pr-20")}
					>
						<FansView
							width={{ xs: 264, md: 445 }}
							height={{ xs: 240, md: 437 }}
							position="relative"
						>
							<FansView
								position="absolute"
								top={0}
								left={0}
								width={{ xs: 123, md: 219 }}
								height={{ xs: 165, md: 295 }}
							>
								<Image
									source={{
										uri: tw.prefixMatch("md")
											? require("@assets/images/landing/success-step-3-1.webp")
											: require("@assets/images/landing/success-step-mobile-3-1.webp"),
									}}
									style={tw.style("w-full h-full")}
									resizeMode="contain"
								/>
							</FansView>
							<FansView
								position="absolute"
								bottom={0}
								right={0}
								width={{ xs: 187, md: 320 }}
								height={{ xs: 208, md: 360 }}
							>
								<Image
									source={{
										uri: tw.prefixMatch("md")
											? require("@assets/images/landing/success-step-3-2.webp")
											: require("@assets/images/landing/success-step-mobile-3-2.webp"),
									}}
									style={tw.style("w-full h-full")}
									resizeMode="contain"
								/>
							</FansView>
						</FansView>
					</FansView>
					<FansView
						flexDirection="row"
						flex="1"
						gap={{ xs: 27, md: 86 }}
					>
						<SuccessStepMilestone step={2} />

						<FansView flex="1" style={tw.style("md:max-w-[570px]")}>
							<FypText
								fontSize={{ xs: 17, md: 31 }}
								lineHeight={{ xs: 22, md: 41 }}
								fontWeight={500}
								color="grey-b1"
							>
								STEP 3
							</FypText>
							<FansGap height={{ xs: 34, md: 46 }} />
							<FypSvg
								svg={ThirdSuccessStepTitleImage}
								width={{ xs: 178, md: 500 }}
								height={{ xs: 69, md: 172 }}
							/>

							<FansGap height={{ xs: 20, md: 36 }} />
							<FypText
								fontSize={{ xs: 17, md: 27 }}
								lineHeight={{ xs: 26, md: 42 }}
								color="black-1d"
							>
								Start posting content and promoting your link to
								fans. Cash out earnings effortlessly with
								payouts to banks, Revolut, or Payoneer
								{tw.prefixMatch("md") ? "" : ". "}
								<FypText
									fontSize={{ xs: 17, md: 27 }}
									lineHeight={{ xs: 26, md: 42 }}
									color="black-1d"
									fontWeight={600}
									style={tw.style("md:hidden underline")}
									onPress={handleStart}
								>
									Start now
								</FypText>
							</FypText>
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

const LandingScreen = () => {
	return (
		<FansScreen1 contentStyle={tw.style("h-full", "p-0")}>
			<ScrollView
				style={tw.style("grow")}
				pagingEnabled
				scrollEventThrottle={50}
				decelerationRate="normal"
			>
				<BannerSection />
				<MembershipSection />
				<CreatorsSection />
				<SmarterSection />
				<EarningsSection />
				<SmartDataSection />

				<ScrollView
					style={tw.style("h-screen")}
					showsVerticalScrollIndicator={false}
					pagingEnabled
					scrollEventThrottle={50}
					decelerationRate="normal"
				>
					<FirstStepToSuccess />
					<SecondStepToSuccess />
					<ThirdStepToSuccess />
				</ScrollView>
				<ScrollView
					style={tw.style("h-screen")}
					showsVerticalScrollIndicator={false}
				>
					<PlatformsSection />
				</ScrollView>
				<ScrollView
					style={tw.style(tw.prefixMatch("lg") ? "" : "h-screen")}
					showsVerticalScrollIndicator={false}
				>
					<FaqSection />
				</ScrollView>
				<FooterSection />
			</ScrollView>
		</FansScreen1>
	);
};

export default LandingScreen;
