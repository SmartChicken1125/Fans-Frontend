import { ListMarkSvg, ChatSvg } from "@assets/svgs/common";
import { FaqImage, BadgeBenefit } from "@assets/svgs/images";
import {
	EnthusiastIcon,
	DiamondDevoteeIcon,
	GoldPatronIcon,
} from "@assets/svgs/images/Badges";
import RoundButton from "@components/common/RoundButton";
import { FypCollapsible, FypSvg } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import { FansView, FansDivider, FansSvg, FansText } from "@components/controls";
import { badgeTiers } from "@constants/common";
import BadgeIconComponents from "@helper/badgeIconComponents";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { IBadgeTier } from "@usertypes/types";
import { formatNumber } from "@utils/stringHelper";
import React, { FC, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";

interface BadgeTierProps {
	data: IBadgeTier;
}

export const BadgeTier: FC<BadgeTierProps> = (props) => {
	const { data } = props;
	const BadgeComponent = Object.hasOwnProperty.call(
		BadgeIconComponents,
		data.type,
	)
		? BadgeIconComponents[data.type]
		: undefined;
	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			borderRadius={15}
			height={102}
			padding={{ l: 20 }}
			style={tw.style(
				"border border-fans-grey-f0 dark:border-fans-grey-43",
			)}
		>
			<FansView width={60} height={60} margin={{ r: 12 }}>
				{BadgeComponent ? <BadgeComponent size={60} /> : null}
			</FansView>
			<FansView>
				<FansText
					fontSize={19}
					lineHeight={26}
					style={tw.style(
						"font-semibold mb-[3px] text-fans-black dark:text-fans-white",
					)}
				>
					{data.title}
				</FansText>
				<FansText
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
					fontSize={16}
					lineHeight={21}
				>
					{data.description}
					<FansText
						color="purple-a8"
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"font-semibold",
							!data.price && "hidden",
						)}
					>
						{` $${formatNumber(data.price ?? null)}`}
					</FansText>
				</FansText>
			</FansView>
		</FansView>
	);
};

interface FaqItemProps {
	question: string;
	children: string;
}

export const FaqItem: FC<FaqItemProps> = (props) => {
	const { question, children } = props;
	const [collapsed, setCollapsed] = useState(true);
	return (
		<FansView>
			<Pressable onPress={() => setCollapsed(!collapsed)}>
				<FansView position="relative" padding={{ l: 18 }}>
					<FansSvg
						size={12.6}
						svg={ListMarkSvg}
						color="#a854f5"
						style={tw.style("absolute left-0 top-[6px]")}
					/>

					<FansText
						fontSize={18}
						lineHeight={24}
						style={tw.style(
							"font-semibold",
							"text-fans-black dark:text-fans-white",
						)}
					>
						{question}
					</FansText>
				</FansView>
			</Pressable>
			<FypCollapsible collapsed={collapsed}>
				<FansView padding={{ t: 16 }}>
					<FansView
						padding={{ x: 16, y: 16 }}
						borderRadius={15}
						background="fans-grey-f0/49"
					>
						<FansText
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
							fontSize={16}
							lineHeight={21}
						>
							{children}
						</FansText>
					</FansView>
				</FansView>
			</FypCollapsible>
		</FansView>
	);
};

const BadgeSystemScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Badge">,
) => {
	const { navigation } = props;

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<CustomTopNavBar
							title="Badge system"
							onClickLeft={() => navigation.goBack()}
							style="absolute z-10 w-full"
							darkMode
						/>
						<FansView
							padding={{ x: 18, b: 150 }}
							style={tw.style(
								"pt-[85px] md:pt-[140px] bg-fans-purple-6a",
							)}
						>
							<FansText
								fontSize={23}
								lineHeight={31}
								style={tw.style(
									"font-bold mb-[18px]",
									"text-center",
									"text-fans-white dark:text-fans-black-1d",
								)}
							>
								Earn your badges
							</FansText>
							<FansText
								fontSize={16}
								lineHeight={21}
								textAlign="center"
								style={tw.style(
									"text-fans-white dark:text-fans-black-1d",
								)}
							>
								Support your favorite creators and level up your
								fan status!
							</FansText>
						</FansView>

						<FansView padding={{ x: 18, b: 50 }}>
							<FansView
								borderRadius={15}
								padding={{ x: 28, b: 32 }}
								margin={{ t: -100, b: 36 }}
								style={[
									{
										shadowColor: tw.prefixMatch("dark")
											? "rgba(255,255,255,0.16)"
											: "rgba(0,0,0,0.16)",
										shadowOffset: {
											width: 0,
											height: 1,
										},
										shadowRadius: 6,
									},
									tw.style(
										"bg-fans-white dark:bg-fans-black-1d",
									),
								]}
							>
								<FansView
									position="relative"
									width={137}
									height={122}
									style={tw.style("mx-auto mt-[-23px] mb-3")}
								>
									<FansView
										position="absolute"
										style={tw.style("left-[30px] top-0")}
									>
										<DiamondDevoteeIcon size={46} />
									</FansView>
									<FansView
										position="absolute"
										style={tw.style(
											"bottom-[30px] right-0",
										)}
									>
										<EnthusiastIcon size={60} />
									</FansView>
									<FansView
										position="absolute"
										style={tw.style("bottom-0 left-0")}
									>
										<GoldPatronIcon size={71} />
									</FansView>
								</FansView>

								<FansText
									fontSize={23}
									lineHeight={28}
									style={tw.style(
										"font-bold mb-4",
										"text-center",
										"text-fans-black dark:text-fans-white",
									)}
								>
									How the Badge{"\n"} System Works
								</FansText>
								<FansText
									fontSize={16}
									lineHeight={21}
									textAlign="center"
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									We value and reward your engagement. With
									every contribution, subscription, cameo, and
									more, you earn points. These points
									accumulate to unlock increasingly
									prestigious badges,{" "}
									<FansText
										fontSize={16}
										lineHeight={21}
										style={tw.style(
											"font-semibold text-fans-purple-a8",
										)}
									>
										elevating your fan status
									</FansText>
								</FansText>
							</FansView>

							<FansView margin={{ b: 35 }}>
								<FansText
									fontSize={19}
									lineHeight={24}
									style={tw.style(
										"font-semibold mb-2.5",
										"text-center text-fans-black dark:text-fans-white",
									)}
								>
									Badge tiers
								</FansText>
								<FansText
									fontSize={16}
									lineHeight={21}
									textAlign="center"
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									Progress through our ten unique badge tiers,
									starting from being a{" "}
									<FansText
										color="purple-a8"
										style={tw.style("font-semibold")}
										fontSize={17}
									>
										New Fan
									</FansText>{" "}
									and advancing all the way up to becoming a{" "}
									<FansText
										color="purple-a8"
										style={tw.style("font-semibold")}
										fontSize={17}
									>
										Diamond Devotee
									</FansText>
								</FansText>
							</FansView>

							<FansView gap={8} margin={{ b: 44 }}>
								{badgeTiers.map((badge) => (
									<BadgeTier data={badge} key={badge.type} />
								))}
							</FansView>

							<FansView>
								<FansView
									alignItems="center"
									margin={{ b: 14 }}
								>
									<BadgeBenefit size={126} />
								</FansView>
								<FansText
									fontSize={19}
									lineHeight={24}
									style={tw.style(
										"font-semibold mb-[10px]",
										"text-center",
										"text-fans-black dark:text-fans-white",
									)}
								>
									Badge benefits
								</FansText>
								<FansText
									fontSize={16}
									lineHeight={21}
									style={tw.style(
										"mb-5",
										"text-center",
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									Not only does your badge represent your
									ranking in the community, but{" "}
									<FansText
										color="purple-a8"
										style={tw.style("font-semibold")}
										fontSize={17}
									>
										each badge comes with its unique
										benefits.
									</FansText>{" "}
									Enjoy early access to exclusive content,
									special discounts, VIP event invitations,
									and much more. The higher your badge tier,
									the more exciting the perks
								</FansText>
								<RoundButton
									variant={RoundButtonType.OUTLINE_PRIMARY}
								>
									Search creators
								</RoundButton>
							</FansView>

							<FansDivider style={tw.style("mt-10 mb-[34px]")} />

							<FansView>
								<FansView
									alignItems="center"
									margin={{ b: 16 }}
								>
									<FaqImage size={108} />
								</FansView>

								<FansText
									fontSize={23}
									lineHeight={31}
									style={tw.style(
										"font-bold mb-9",
										"text-center",
										"text-fans-black dark:text-fans-white",
									)}
								>
									Frequently Asked Questions
								</FansText>

								<FansView gap={30} margin={{ b: 32 }}>
									<FaqItem question="How do I earn a badge?">
										You earn badges by making purchases on
										FYP.Fans. This includes subscriptions,
										donations, purchasing cameos, and other
										ways of supporting creators on the
										platform
									</FaqItem>
									<FaqItem question="Do my badges ever expire?">
										You earn badges by making purchases on
										FYP.Fans. This includes subscriptions,
										donations, purchasing cameos, and other
										ways of supporting creators on the
										platform
									</FaqItem>

									<FaqItem question="Can I loge my badge if I decrease my spending or stop subscribing?">
										You earn badges by making purchases on
										FYP.Fans. This includes subscriptions,
										donations, purchasing cameos, and other
										ways of supporting creators on the
										platform
									</FaqItem>

									<FaqItem question="What benefits do I get from earning badges?">
										You earn badges by making purchases on
										FYP.Fans. This includes subscriptions,
										donations, purchasing cameos, and other
										ways of supporting creators on the
										platform
									</FaqItem>

									<FaqItem question="What does the total spend include?">
										You earn badges by making purchases on
										FYP.Fans. This includes subscriptions,
										donations, purchasing cameos, and other
										ways of supporting creators on the
										platform
									</FaqItem>
								</FansView>

								<FansView
									borderRadius={15}
									padding={{ x: 18, t: 21, b: 28 }}
									style={tw.style(
										"border-fans-grey-de dark:border-fans-grey-50",
									)}
								>
									<FansText
										fontSize={17}
										lineHeight={22}
										style={tw.style(
											"font-semibold mb-4",
											"text-center",
											"text-fans-black dark:text-fans-white",
										)}
									>
										Still need help?
									</FansText>
									<RoundButton>
										<FypSvg
											svg={ChatSvg}
											width={14.33}
											height={14.33}
											color="fans-white dark:fans-black-1d"
											style={tw.style("mr-[10px]")}
										/>
										Chat to us
									</RoundButton>
								</FansView>
							</FansView>
						</FansView>
					</LayoutContentsContainer>
				</ScrollView>
			</View>
		</AppLayout>
	);
};

export default BadgeSystemScreen;
