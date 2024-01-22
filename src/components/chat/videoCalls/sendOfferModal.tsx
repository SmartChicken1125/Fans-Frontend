import { ChevronLeftSvg } from "@assets/svgs/common";
import { ApprovePendingImage, GiftImage } from "@assets/svgs/images";
import { RoundTextInput2 } from "@components/common/RoundTextInput";
import { FypSvg, FypText, FypNullableView } from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { BlurView } from "expo-blur";
import React, { FC, useState } from "react";
import { Modal } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

type SendOfferTab = "start" | "requestTime" | "sendTributeFee";

interface StartScreenProps {
	handleChangeTab: (val: SendOfferTab) => void;
}

const StartScreen: FC<StartScreenProps> = (props) => {
	const { handleChangeTab } = props;
	return (
		<FansView
			flex="1"
			padding={{ x: 18, b: 20 }}
			style={tw.style("md:pt-5")}
		>
			<FypText
				fontSize={19}
				lineHeight={26}
				fontWeight={700}
				textAlign="center"
				margin={{ b: 32 }}
				style={tw.style("text-fans-white")}
			>
				Send offer
			</FypText>
			<FansView gap={10}>
				<FansView
					height={70}
					borderRadius={7}
					flexDirection="row"
					alignItems="center"
					padding={{ x: 20 }}
					style={tw.style("border border-fans-white/20")}
					pressableProps={{
						onPress: () => handleChangeTab("requestTime"),
					}}
				>
					<FansView width={32} margin={{ r: 20 }}>
						<FypSvg
							svg={ApprovePendingImage}
							width={32}
							height={32}
						/>
					</FansView>
					<FypText
						fontSize={16}
						lineHeight={21}
						fontWeight={600}
						style={tw.style("text-fans-white")}
					>
						Request time increase
					</FypText>
				</FansView>

				<FansView
					height={70}
					borderRadius={7}
					flexDirection="row"
					alignItems="center"
					padding={{ x: 20 }}
					style={tw.style("border border-fans-white/20")}
					pressableProps={{
						onPress: () => handleChangeTab("sendTributeFee"),
					}}
				>
					<FansView width={32} margin={{ r: 20 }}>
						<FypSvg svg={GiftImage} width={28} height={28} />
					</FansView>
					<FypText
						fontSize={16}
						lineHeight={21}
						fontWeight={600}
						style={tw.style("text-fans-white")}
					>
						Send tribute fee
					</FypText>
				</FansView>
			</FansView>
		</FansView>
	);
};

interface RequestTimeScreenProps {
	handleBack: () => void;
	handleSubmit: (time: number) => void;
}

const RequestTimeScreen: FC<RequestTimeScreenProps> = (props) => {
	const { handleBack, handleSubmit } = props;
	const [time, setTime] = useState(0);
	return (
		<FansView
			flex="1"
			padding={{ x: 18, b: 20 }}
			position="relative"
			style={tw.style("md:pt-5")}
		>
			<FansIconButton
				size={30}
				style={tw.style("absolute left-[5px] top-2")}
				onPress={handleBack}
				backgroundColor="bg-fans-transparent"
			>
				<FypSvg
					svg={ChevronLeftSvg}
					width={13}
					height={13}
					color="fans-white"
				/>
			</FansIconButton>
			<FypSvg
				svg={ApprovePendingImage}
				width={67}
				height={67}
				style={tw.style("mx-auto mb-5")}
			/>
			<FypText
				fontSize={19}
				lineHeight={26}
				fontWeight={700}
				textAlign="center"
				margin={{ b: 22 }}
				style={tw.style("text-fans-white")}
			>
				Request time increase
			</FypText>
			<FypText
				fontSize={16}
				lineHeight={21}
				textAlign="center"
				margin={{ b: 26 }}
				style={tw.style("text-fans-white")}
			>
				Encourage your fan to extend the duration of the video call by
				paying more
			</FypText>
			<FypText
				fontSize={17}
				lineHeight={22}
				fontWeight={600}
				margin={{ b: 15 }}
				style={tw.style("text-fans-white")}
			>
				Duration & prices
			</FypText>
			<FansView
				flexDirection="row"
				alignItems="center"
				flexWrap="wrap"
				margin={{ x: -6, b: 16 }}
				width="full"
			>
				{[15, 30, 45, 60].map((el) => (
					<FansView key={el} padding={3} style={tw.style("w-1/3")}>
						<FansView
							height={77}
							borderRadius={7}
							justifyContent="center"
							style={tw.style(
								"border",
								time === el
									? "border-fans-purple border-[2px]"
									: "border-fans-white/20",
							)}
							pressableProps={{
								onPress: () => setTime(el),
							}}
						>
							<FypText
								fontSize={16}
								fontWeight={500}
								textAlign="center"
								lineHeight={21}
								style={tw.style("text-fans-white")}
							>
								{`${el} min`}
							</FypText>
							<FypText
								fontSize={19}
								fontWeight={600}
								textAlign="center"
								lineHeight={26}
								style={tw.style("text-fans-purple")}
							>
								{`$${el}`}
							</FypText>
						</FansView>
					</FansView>
				))}
			</FansView>
			<FansView
				height={42}
				borderRadius={42}
				alignItems="center"
				justifyContent="center"
				style={tw.style("bg-fans-purple")}
				pressableProps={{
					onPress: () => {
						if (time !== 0) handleSubmit(time);
					},
				}}
			>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style("text-fans-white")}
				>
					Request
				</FypText>
			</FansView>
		</FansView>
	);
};

interface SendTributeFeeScreenProps {
	handleBack: () => void;
	handleSubmit: (fee: number) => void;
}

const SendTributeFeeScreen: FC<SendTributeFeeScreenProps> = (props) => {
	const { handleBack, handleSubmit } = props;
	const [fee, setFee] = useState("");
	return (
		<FansView
			flex="1"
			padding={{ x: 18, b: 20 }}
			position="relative"
			style={tw.style("md:pt-5")}
		>
			<FansIconButton
				size={30}
				style={tw.style("absolute left-[5px] top-2")}
				onPress={handleBack}
				backgroundColor="bg-fans-transparent"
			>
				<FypSvg
					svg={ChevronLeftSvg}
					width={13}
					height={13}
					color="fans-white"
				/>
			</FansIconButton>
			<FypSvg
				svg={GiftImage}
				width={64}
				height={64}
				style={tw.style("mx-auto mb-5")}
			/>
			<FypText
				fontSize={19}
				lineHeight={26}
				fontWeight={700}
				textAlign="center"
				margin={{ b: 22 }}
				style={tw.style("text-fans-white")}
			>
				Send tribute fee
			</FypText>
			<FypText
				fontSize={16}
				lineHeight={21}
				textAlign="center"
				margin={{ b: 28 }}
				style={tw.style("text-fans-white")}
			>
				Invite your fan to express their appreciation through a tip
			</FypText>
			<FansView>
				<FypText
					fontSize={17}
					fontWeight={600}
					lineHeight={22}
					style={tw.style("text-fans-white")}
					margin={{ b: 14 }}
				>
					Tribute fee
				</FypText>
				<RoundTextInput2
					value={fee}
					onChangeText={setFee}
					placeholder="Enter amount ($)"
					keyboardType="numeric"
					customStyles="bg-fans-white/20 text-fans-white"
				/>
			</FansView>

			<FansView
				height={42}
				borderRadius={42}
				alignItems="center"
				justifyContent="center"
				margin={{ t: 17 }}
				style={tw.style("bg-fans-purple")}
				pressableProps={{
					onPress: () => {
						if (fee !== "") handleSubmit(parseFloat(fee));
					},
				}}
			>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style("text-fans-white")}
				>
					Send
				</FypText>
			</FansView>
		</FansView>
	);
};

interface Props {
	open: boolean;
	handleClose: () => void;
	handleRequestTime: (time: number) => void;
	handleSendTributeFee: (amount: number) => void;
}

const SendOfferModal: FC<Props> = (props) => {
	const { open, handleClose, handleRequestTime, handleSendTributeFee } =
		props;
	const positionY = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onBegin((e) => {
			positionY.value = e.translationY;
		})
		.onEnd((e) => {
			if (positionY.value < e.translationY) {
				handleClose();
			}
		});

	const [tab, setTab] = useState<SendOfferTab>("start");

	return (
		<Modal transparent visible={open}>
			<FansView
				width="full"
				height="full"
				position="relative"
				alignItems="center"
				style={tw.style(
					"bg-fans-black/30 justify-end md:justify-center",
				)}
				touchableOpacityProps={{
					activeOpacity: 1,
					onPress: handleClose,
				}}
			>
				<FansView
					touchableOpacityProps={{ activeOpacity: 1 }}
					style={tw.style("w-full md:w-[450px]", "h-auto max-h-9/10")}
				>
					<BlurView
						intensity={55}
						tint="dark"
						style={tw.style(
							"rounded-t-[7px] md:rounded-[15px] md:rounded-t-[15px] flex-1",
						)}
					>
						<FansView height={40} style={tw.style("md:hidden")}>
							<GestureDetector gesture={panGesture}>
								<FansView padding={{ t: 16, b: 20 }}>
									<FansView
										width={38}
										height={4}
										borderRadius={4}
										style={tw.style(
											"bg-fans-grey-b1/40 mx-auto",
										)}
									></FansView>
								</FansView>
							</GestureDetector>
						</FansView>
						<FypNullableView visible={tab === "start"}>
							<StartScreen handleChangeTab={setTab} />
						</FypNullableView>
						<FypNullableView visible={tab === "requestTime"}>
							<RequestTimeScreen
								handleBack={() => setTab("start")}
								handleSubmit={handleRequestTime}
							/>
						</FypNullableView>
						<FypNullableView visible={tab === "sendTributeFee"}>
							<SendTributeFeeScreen
								handleBack={() => setTab("start")}
								handleSubmit={handleSendTributeFee}
							/>
						</FypNullableView>
					</BlurView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default SendOfferModal;
