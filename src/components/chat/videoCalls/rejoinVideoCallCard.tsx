import { VideoCameraSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
	FypButton2,
} from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { useRouter } from "expo-router";
import React from "react";

const RejoinVideoCallCard = () => {
	const router = useRouter();

	const handlePressJoin = () => {
		router.replace({
			pathname: "video-call",
			params: { screen: "Creator" },
		});
	};

	const handleCancel = () => {
		router.replace({
			pathname: "video-call",
			params: { screen: "Fan" },
		});
	};

	return (
		<FypLinearGradientView
			colors={["#D885FF", "#A854f5", "#1D21E5"]}
			start={[1, 0]}
			end={[0, 1]}
			borderRadius={15}
			padding={{ y: 16, x: 18 }}
		>
			<FansView
				flexDirection="row"
				alignItems="start"
				gap={14}
				margin={{ b: 16 }}
			>
				<FansView width={46} height={46} position="relative">
					<UserAvatar size="46px" />
					<FansView
						width={24}
						height={24}
						borderRadius={24}
						alignItems="center"
						justifyContent="center"
						position="absolute"
						style={tw.style(
							"border-[2px] border-fans-purple-76",
							"right-[-3px] bottom-[-4px]",
						)}
					>
						<FypLinearGradientView
							colors={["#D885FF", "#A854f5", "#1D21E5"]}
							start={[1, 0]}
							end={[0, 1]}
							borderRadius={20}
							width="full"
							height="full"
							alignItems="center"
							justifyContent="center"
						>
							<FypSvg
								svg={VideoCameraSvg}
								width={11}
								height={10}
								color="fans-white"
							/>
						</FypLinearGradientView>
					</FansView>
				</FansView>
				<FansView flex="1">
					<FypText
						fontSize={17}
						fontWeight={700}
						lineHeight={22}
						margin={{ b: 4 }}
						style={tw.style("text-fans-white")}
					>
						Re-join active video call
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={20}
						margin={{ b: 9 }}
						style={tw.style("text-fans-white")}
					>
						Time left 04:59
					</FypText>
					<FansView
						position="relative"
						height={5}
						borderRadius={5}
						style={tw.style("bg-fans-white/30")}
					>
						<FansView
							height="full"
							borderRadius={5}
							style={tw.style("bg-fans-white w-1/2")}
						></FansView>
					</FansView>
				</FansView>
			</FansView>
			<FansView flexDirection="row" gap={7}>
				<FansView flex="1">
					<FypButton2
						style={tw.style("border border-fans-white")}
						textStyle={tw.style("text-fans-white")}
						pressableProps={{
							onPress: handleCancel,
						}}
					>
						Cancel
					</FypButton2>
				</FansView>
				<FansView flex="1">
					<FypButton2
						style={tw.style("bg-fans-white")}
						textStyle={tw.style("text-fans-purple")}
						pressableProps={{
							onPress: handlePressJoin,
						}}
					>
						Join
					</FypButton2>
				</FansView>
			</FansView>
		</FypLinearGradientView>
	);
};

export default RejoinVideoCallCard;
