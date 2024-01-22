import {
	StarCheckSvg,
	ThreeDotsVerticalSvg,
	RoundedTip1Svg,
	ChatSvg,
	RefreshSvg,
} from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
} from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { FC } from "react";
import { Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");

interface Props {
	type: "creator" | "fan";
	profile: IProfile;
	handleClose: () => void;
	handleBuyMoreTime?: () => void;
	handleTipUser?: () => void;
	handleSendOffer?: () => void;
	handlePressThreeDots: () => void;
	handleWaitCallback: () => void;
	handlePressChat: () => void;
}

const TopNavbar: FC<Props> = (props) => {
	const {
		type,
		profile,
		handleClose,
		handleBuyMoreTime,
		handleTipUser,
		handleSendOffer,
		handlePressThreeDots,
		handleWaitCallback,
		handlePressChat,
	} = props;

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			justifyContent="between"
			position="absolute"
			width="full"
			flexWrap="wrap"
			style={tw.style("px-4 top-3 md:pl-9 md:pr-8 md:top-6 z-10")}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				position="relative"
				borderRadius={60}
				style={tw.style("md:py-[7px] md:pl-[10px] md:bg-fans-black/40")}
			>
				<AvatarWithStatus
					avatar={profile.avatar}
					size={tw.prefixMatch("md") ? 46 : 34}
				/>
				<FansView style={tw.style("ml-3 md:ml-4")}>
					<FansView flexDirection="row" alignItems="center" gap={11}>
						<FypText
							fontSize={{ xs: 16, md: 19 }}
							lineHeight={26}
							fontWeight={tw.prefixMatch("md") ? 700 : 600}
							numberOfLines={1}
							style={[
								tw.style("text-fans-white"),
								{ maxWidth: windowWidth * 0.3 },
							]}
						>
							{profile.displayName}
						</FypText>
						<FypSvg svg={StarCheckSvg} width={16} height={15} />
					</FansView>
					<FypText
						fontSize={{ xs: 14, md: 16 }}
						lineHeight={{ xs: 19, md: 21 }}
						style={tw.style("text-fans-white")}
					>
						00:15
					</FypText>
				</FansView>
				<FansIconButton
					size={tw.prefixMatch("md") ? 32 : 22}
					backgroundColor="bg-transparent"
					onPress={handlePressThreeDots}
				>
					<FypSvg
						svg={ThreeDotsVerticalSvg}
						width={18}
						height={18}
						color="fans-white"
					/>
				</FansIconButton>
			</FansView>

			{tw.prefixMatch("md") ? (
				<FansView
					width={182}
					height={42}
					borderRadius={42}
					alignItems="center"
					justifyContent="center"
					style={tw.style("bg-fans-black/40")}
					pressableProps={{
						onPress: handleClose,
					}}
				>
					<FypText
						fontSize={19}
						fontWeight={700}
						lineHeight={26}
						style={tw.style("text-fans-white")}
					>
						Exit video call
					</FypText>
				</FansView>
			) : (
				<FansView flexDirection="row" alignItems="center" gap={7}>
					<FansIconButton
						size={30}
						backgroundColor="bg-fans-black/40"
						style={tw.style("md:hidden")}
						onPress={handlePressChat}
					>
						<FypSvg
							svg={ChatSvg}
							width={17}
							height={17}
							color="fans-white"
						/>
					</FansIconButton>
					<FansIconButton
						size={30}
						backgroundColor="bg-fans-black/40"
						style={tw.style("md:hidden")}
					>
						<FypSvg
							svg={RefreshSvg}
							width={16}
							height={16}
							color="fans-white"
						/>
					</FansIconButton>
					<FypText
						fontSize={17}
						fontWeight={600}
						lineHeight={22}
						style={tw.style("text-fans-white")}
						onPress={handleClose}
					>
						End
					</FypText>
				</FansView>
			)}

			<FansView
				flexDirection="row"
				gap={14}
				style={[
					tw.style(
						tw.prefixMatch("md")
							? "absolute top-2 left-1/2"
							: "w-full mt-8",
					),
					{
						transform: tw.prefixMatch("md")
							? [{ translateX: type === "fan" ? -180 : -86 }]
							: [],
					},
				]}
			>
				{handleBuyMoreTime ? (
					<FansView
						height={42}
						borderRadius={42}
						alignItems="center"
						justifyContent="center"
						style={tw.style(
							"bg-fans-black/40",
							tw.prefixMatch("md") ? "w-[172px]" : "flex-1",
						)}
						pressableProps={{
							onPress: handleBuyMoreTime,
						}}
					>
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							style={tw.style("text-fans-white")}
						>
							Buy more time
						</FypText>
					</FansView>
				) : null}
				{handleTipUser ? (
					<FansView
						height={42}
						borderRadius={42}
						alignItems="center"
						justifyContent="center"
						style={tw.style(
							"bg-fans-black/40",
							tw.prefixMatch("md") ? "w-[172px]" : "flex-1",
						)}
						gap={9}
						flexDirection="row"
						pressableProps={{
							onPress: handleTipUser,
						}}
					>
						<FypSvg
							svg={RoundedTip1Svg}
							width={15}
							height={15}
							color="fans-white"
						/>
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							style={tw.style("text-fans-white")}
						>
							Tip Jane
						</FypText>
					</FansView>
				) : null}
				{handleSendOffer ? (
					<FansView
						height={42}
						borderRadius={42}
						alignItems="center"
						justifyContent="center"
						width={172}
						style={tw.style("bg-fans-black/40 mx-auto")}
						gap={9}
						flexDirection="row"
						pressableProps={{
							onPress: handleSendOffer,
						}}
					>
						<FypSvg
							svg={RoundedTip1Svg}
							width={15}
							height={15}
							color="fans-white"
						/>
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							style={tw.style("text-fans-white")}
						>
							Send offer
						</FypText>
					</FansView>
				) : null}
			</FansView>

			<FansView
				width="full"
				margin={{ t: 17 }}
				style={tw.style("md:hidden")}
			>
				<FansView
					position="relative"
					height={9}
					borderRadius={9}
					style={tw.style("bg-fans-white")}
				>
					<FypLinearGradientView
						colors={["#1d21e5", "#d885ff"]}
						height="full"
						borderRadius={9}
						style={tw.style("w-1/2")}
					></FypLinearGradientView>
				</FansView>
				<FansView margin={{ t: 12 }}>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						textAlign="center"
						style={tw.style("text-fans-white")}
					>
						Time left
					</FypText>
					<FypText
						fontSize={42}
						lineHeight={56}
						textAlign="center"
						fontWeight={700}
						margin={{ t: -7 }}
						style={tw.style("text-fans-white")}
						onPress={handleWaitCallback}
					>
						00:30
					</FypText>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default TopNavbar;
