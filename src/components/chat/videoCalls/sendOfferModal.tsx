import { ChevronLeftSvg } from "@assets/svgs/common";
import { ApprovePendingImage, GiftImage } from "@assets/svgs/images";
import FormControl from "@components/common/FormControl";
import { FypSvg, FypText, FypNullableView } from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
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
					style={tw.style(
						"border border-fans-grey-de dark:border-fans-grey-50",
					)}
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
					<FypText fontSize={16} lineHeight={21} fontWeight={600}>
						Request time increase
					</FypText>
				</FansView>

				<FansView
					height={70}
					borderRadius={7}
					flexDirection="row"
					alignItems="center"
					padding={{ x: 20 }}
					style={tw.style(
						"border border-fans-grey-de dark:border-fans-grey-50",
					)}
					pressableProps={{
						onPress: () => handleChangeTab("sendTributeFee"),
					}}
				>
					<FansView width={32} margin={{ r: 20 }}>
						<FypSvg svg={GiftImage} width={28} height={28} />
					</FansView>
					<FypText fontSize={16} lineHeight={21} fontWeight={600}>
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
					color="fans-grey-70 dark:fans-grey-b1"
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
			>
				Request time increase
			</FypText>
			<FypText
				fontSize={16}
				lineHeight={21}
				textAlign="center"
				margin={{ b: 26 }}
			>
				Encourage your fan to extend the duration of the video call by
				paying more
			</FypText>
			<FypText
				fontSize={17}
				lineHeight={22}
				fontWeight={600}
				margin={{ b: 15 }}
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
									: "border-fans-grey-f0 dark:border-fans-grey-43",
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
					color="fans-grey-70 dark:fans-grey-b1"
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
			>
				Send tribute fee
			</FypText>
			<FypText
				fontSize={16}
				lineHeight={21}
				textAlign="center"
				margin={{ b: 28 }}
			>
				Invite your fan to express their appreciation through a tip
			</FypText>
			<FormControl
				label="Tribute fee"
				value={fee}
				onChangeText={setFee}
				placeholder="Enter amount ($)"
				keyboardType="numeric"
			/>
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
					style={tw.style(
						"w-full md:w-[450px]",
						"h-auto max-h-9/10",
						"rounded-t-[7px] md:rounded-[15px] md:rounded-t-[15px]",
						"bg-fans-white dark:bg-fans-black-1d",
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
										"bg-fans-grey-70/40 dark:bg-fans-grey-b1/40 mx-auto",
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
				</FansView>
			</FansView>
		</Modal>
	);
};

export default SendOfferModal;
