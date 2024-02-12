import {
	Expand1Svg,
	Play1Svg,
	Record2Svg,
	Record1Svg,
	VolumnSvg,
	Volumn1Svg,
	Mic1Svg,
	MicSvg,
	PhoneSvg,
	ChevronUp1Svg,
	ChevronDownSvg,
} from "@assets/svgs/common";
import { FypSvg, FypText, FypRadio } from "@components/common/base";
import { FansView, FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC, useState } from "react";
import { ViewStyle } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface ControlButtonProps {
	isActive?: boolean;
	onPress: () => void;
	children: React.ReactNode;
	style?: ViewStyle;
}

const ControlButton: FC<ControlButtonProps> = (props) => {
	const { isActive, onPress, children, style } = props;
	return (
		<FansView
			width={{ xs: 42, md: 74 }}
			height={{ xs: 42, md: 74 }}
			alignItems="center"
			justifyContent="center"
			borderRadius={74}
			style={[
				tw.style(isActive ? "bg-fans-white" : "bg-fans-black/40"),
				style,
			]}
			pressableProps={{
				onPress: onPress,
			}}
		>
			{children}
		</FansView>
	);
};

interface DevicePopupProps {
	onOutsidePress: () => void;
}

const DevicePopup: FC<DevicePopupProps> = (props) => {
	const { onOutsidePress } = props;
	const [output, setOutput] = useState("default");
	return (
		<OutsidePressHandler
			onOutsidePress={onOutsidePress}
			style={[
				tw.style("absolute", "w-[394px] left-1/2 bottom-25"),
				{
					transform: [{ translateX: -194 }],
				},
			]}
		>
			<Animated.View
				entering={FadeIn}
				exiting={FadeOut}
				style={[
					tw.style(
						"pt-6 pb-3 px-[18px] rounded-[15px]",
						"bg-fans-black/50",
					),
				]}
			>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					textAlign="center"
					margin={{ b: 30 }}
					style={tw.style("text-fans-white")}
				>
					Devices
				</FypText>
				<FansView margin={{ b: 28 }}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
						style={tw.style("text-fans-white")}
					>
						Input device
					</FypText>
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={true}
							label="Default"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => {}}
						/>
					</FansView>
				</FansView>
				<FansView>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
						style={tw.style("text-fans-white")}
					>
						Output device
					</FypText>
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={output === "default"}
							label="Default"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => setOutput("default")}
						/>
					</FansView>
					<FansDivider style={tw.style("bg-fans-black-2f")} />
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={output === "headphones"}
							label="Headphones"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => setOutput("headphones")}
						/>
					</FansView>
					<FansDivider style={tw.style("bg-fans-black-2f")} />
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={output === "headphones2"}
							label="Headphones2"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => setOutput("headphones2")}
						/>
					</FansView>
				</FansView>
			</Animated.View>
		</OutsidePressHandler>
	);
};

interface Props {
	handleExpand: () => void;
}

const ControlButtons: FC<Props> = (props) => {
	const { handleExpand } = props;
	const [isExpanded, setIsExpanded] = useState(false);
	const [isStopped, setIsStopped] = useState(false);
	const [isRecord, setIsRecord] = useState(false);
	const [isStopSpeaker, setIsStopSpicker] = useState(false);
	const [isStopDevice, setIsStopDevice] = useState(false);
	const [openDevicePopup, setOpenDevicePopup] = useState(false);

	const handleCancelCall = () => {};

	return (
		<FansView
			position="absolute"
			flexDirection="row"
			justifyContent="center"
			alignItems="center"
			gap={{ xs: 11, md: 20 }}
			style={[
				tw.style(
					"w-full md:w-auto bottom-2 md:bottom-[70px] left-0 md:left-1/2 z-1",
				),
				{
					transform: [
						{ translateX: tw.prefixMatch("md") ? -272 : 0 },
					],
				},
			]}
		>
			<ControlButton isActive={isExpanded} onPress={handleExpand}>
				<FypSvg
					svg={Expand1Svg}
					width={{ xs: 18, md: 30 }}
					height={{ xs: 18, md: 30 }}
					color={isExpanded ? "fans-red" : "fans-white"}
				/>
			</ControlButton>
			<ControlButton
				isActive={isStopped}
				onPress={() => setIsStopped(!isStopped)}
			>
				{isStopped ? (
					<FansView
						width={{ xs: 18, md: 30 }}
						height={{ xs: 18, md: 30 }}
						borderRadius={30}
						style={tw.style("bg-fans-red")}
					></FansView>
				) : (
					<FypSvg
						svg={Play1Svg}
						width={{ xs: 20, md: 34 }}
						height={{ xs: 20, md: 34 }}
						color="fans-white"
					/>
				)}
			</ControlButton>
			<ControlButton
				isActive={isRecord}
				onPress={() => setIsRecord(!isRecord)}
			>
				{isRecord ? (
					<FypSvg
						svg={Record2Svg}
						width={{ xs: 23, md: 37 }}
						height={{ xs: 16, md: 25 }}
						color="fans-red"
					/>
				) : (
					<FypSvg
						svg={Record1Svg}
						width={{ xs: 23, md: 37 }}
						height={{ xs: 16, md: 25 }}
						color="fans-white"
					/>
				)}
			</ControlButton>
			<ControlButton
				isActive={isStopSpeaker}
				onPress={() => setIsStopSpicker(!isStopSpeaker)}
			>
				{isStopSpeaker ? (
					<FypSvg
						svg={Volumn1Svg}
						width={{ xs: 25, md: 40 }}
						height={{ xs: 18, md: 29 }}
						color="fans-red"
					/>
				) : (
					<FypSvg
						svg={VolumnSvg}
						width={{ xs: 25, md: 40 }}
						height={{ xs: 18, md: 29 }}
						color="fans-white"
					/>
				)}
			</ControlButton>
			<ControlButton
				isActive={isStopDevice}
				onPress={() => setIsStopDevice(!isStopDevice)}
			>
				{isStopDevice ? (
					<FypSvg
						svg={Mic1Svg}
						width={{ xs: 19, md: 30 }}
						height={{ xs: 23, md: 38 }}
						color="fans-red"
					/>
				) : (
					<FypSvg
						svg={MicSvg}
						width={{ xs: 19, md: 30 }}
						height={{ xs: 23, md: 38 }}
						color="fans-white"
					/>
				)}
				<FansView
					width={46}
					height={46}
					borderRadius={46}
					position="absolute"
					bottom={-14}
					right={-20}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border-[3px] bg-fans-black-34 border-[#583922] hidden md:flex",
					)}
					pressableProps={{
						onPress: () => setOpenDevicePopup(!openDevicePopup),
					}}
				>
					<FypSvg
						svg={openDevicePopup ? ChevronUp1Svg : ChevronDownSvg}
						width={17}
						height={9}
						color="fans-white"
					/>
				</FansView>
				{openDevicePopup ? (
					<DevicePopup
						onOutsidePress={() => setOpenDevicePopup(false)}
					/>
				) : null}
			</ControlButton>
			<ControlButton
				onPress={handleCancelCall}
				style={tw.style("bg-fans-red")}
			>
				<FypSvg
					svg={PhoneSvg}
					width={{ xs: 22, md: 35 }}
					height={{ xs: 23, md: 38 }}
					color="fans-white"
				/>
			</ControlButton>
		</FansView>
	);
};

export default ControlButtons;
