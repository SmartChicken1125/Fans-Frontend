import {
	CloseSvg,
	SingleGem,
	CheckSvg,
	StarCheckSvg,
	OfflineAccessSvg,
	FilledHeartSvg,
	PushNotificationSvg,
	ChevronLeftSvg,
} from "@assets/svgs/common";
import { GemImage } from "@assets/svgs/images";
import RoundButton from "@components/common/RoundButton";
import {
	FypModal,
	FypLink,
	FypText,
	FypNullableView,
	FypLinearGradientView,
} from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import { PWA_INSTALL_DIALOG_ID } from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import {
	useAppContext,
	ModalActionType,
	CommonActionType,
} from "@context/useAppContext";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { FC } from "react";
import { Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type PwaInstallModalSteps = "start" | "info" | "success";

interface StartContentsProps {
	onChangeStep: (step: PwaInstallModalSteps) => void;
}

export const StartContents: FC<StartContentsProps> = (props) => {
	const { onChangeStep } = props;

	const { dispatch, state } = useAppContext();
	const { pwaPromptEvent } = state.common;

	const handleInstall = async () => {
		if (pwaPromptEvent) {
			pwaPromptEvent?.prompt();
			const choiceResult = await pwaPromptEvent?.userChoice;
			if (choiceResult?.outcome === "accepted") {
				onChangeStep("success");
				localStorage.setItem("hidePWAInstallPrompt", "true");
			}
			dispatch.setCommon({
				type: CommonActionType.SetPwaPromptEvent,
				data: null,
			});
		} else {
			// Todo Prince: Show Custom IOS Install Prompt
			// localStorage.setItem("hidePWAInstallPrompt", "true");
		}
	};

	const onPressMoreInfo = () => {
		onChangeStep("info");
	};

	return (
		<Animated.View entering={FadeIn} exiting={FadeOut}>
			<FansView
				width={84}
				height={84}
				borderRadius={15}
				alignItems="center"
				justifyContent="center"
				margin={{ b: 28 }}
				style={[
					tw.style("mx-auto"),
					{
						shadowColor: tw.prefixMatch("dark")
							? "rgba(255,255,255,0.16)"
							: "rgba(0,0,0,0.16)",
						shadowOffset: {
							width: 0,
							height: 3,
						},
						shadowRadius: 6,
					},
				]}
			>
				<FansView
					width={59}
					height={59}
					alignItems="center"
					justifyContent="center"
				>
					<GemImage />
				</FansView>
			</FansView>

			<FansView margin={{ b: 28 }}>
				<FansView alignItems="center" margin={{ b: 20 }}>
					<Image
						source={{
							uri: require("@assets/images/common/fyp-fans-app.png"),
						}}
						style={{ width: 159, height: 27 }}
					/>
				</FansView>
				<FypText fontSize={16} lineHeight={21} textAlign="center">
					Install the PWA app on your device to easily access it
					anytime. No app store, no hassle.
				</FypText>
			</FansView>

			<FansView gap={13}>
				<RoundButton
					variant={RoundButtonType.PRIMARY}
					onPress={handleInstall}
				>
					Install
				</RoundButton>
				<FypLink
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					color="purple"
					hideUnderline
					style={tw.style("mx-auto")}
					onPress={onPressMoreInfo}
				>
					More info
				</FypLink>
			</FansView>
		</Animated.View>
	);
};

interface SuccessContentsProps {
	handleClose: () => void;
}

export const SuccessContents: FC<SuccessContentsProps> = (props) => {
	const { handleClose } = props;
	return (
		<Animated.View entering={FadeIn} exiting={FadeOut}>
			<FansView
				position="relative"
				width={95}
				height={95}
				margin={{ b: 18 }}
				style={tw.style("mx-auto")}
			>
				<FypLinearGradientView
					width={95}
					height={95}
					colors={["#1d21e5", "#d885ff"]}
					alignItems="center"
					justifyContent="center"
					borderRadius={95}
				>
					<SingleGem color="#fff" size={57} />
				</FypLinearGradientView>
				<FypLinearGradientView
					width={43}
					height={43}
					colors={["#1d21e5", "#d885ff"]}
					alignItems="center"
					justifyContent="center"
					borderRadius={35}
					border={4}
					borderColor="white"
					position="absolute"
					style={tw.style("right-[-4px] bottom-[-10px]")}
				>
					<CheckSvg color="#fff" size={18} />
				</FypLinearGradientView>
			</FansView>

			<FansView margin={{ b: 28 }} gap={18}>
				<FypText
					fontSize={23}
					lineHeight={31}
					fontWeight={700}
					textAlign="center"
				>
					FYP.Fans installed!
				</FypText>
				<FypText fontSize={16} lineHeight={21} textAlign="center">
					The app was successfully installed to your home screen
				</FypText>
			</FansView>

			<FansView gap={13}>
				<RoundButton variant={RoundButtonType.PRIMARY}>
					Go to the app
				</RoundButton>
				<FypLink
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					color="purple"
					hideUnderline
					style={tw.style("mx-auto")}
					onPress={handleClose}
				>
					Close
				</FypLink>
			</FansView>
		</Animated.View>
	);
};

interface InformationProps {
	title: string;
	description: string;
	icon: React.ReactNode;
}

export const Information: FC<InformationProps> = (props) => {
	const { title, description, icon } = props;

	return (
		<FansView position="relative" padding={{ l: 40 }}>
			<FansView position="absolute" style={tw.style("top-1 left-0")}>
				{icon}
			</FansView>
			<FansView gap={10}>
				<FypText fontSize={17} lineHeight={24} fontWeight={600}>
					{title}
				</FypText>
				<FypText fontSize={16} lineHeight={21} color="grey-70">
					{description}
				</FypText>
			</FansView>
		</FansView>
	);
};

interface InformationContentsProps {
	handleClose: () => void;
	onChangeStep: (step: PwaInstallModalSteps) => void;
}

export const InformationContents: FC<InformationContentsProps> = (props) => {
	const { handleClose, onChangeStep } = props;

	const onPressInstall = () => {
		onChangeStep("start");
	};

	return (
		<Animated.View entering={FadeIn} exiting={FadeOut}>
			<FansView
				width={66}
				height={66}
				borderRadius={15}
				alignItems="center"
				justifyContent="center"
				margin={{ b: 36 }}
				style={[
					tw.style("mx-auto"),
					{
						shadowColor: tw.prefixMatch("dark")
							? "rgba(255,255,255,0.16)"
							: "rgba(0,0,0,0.16)",
						shadowOffset: {
							width: 0,
							height: 3,
						},
						shadowRadius: 6,
					},
				]}
			>
				<FansView
					width={46}
					height={46}
					alignItems="center"
					justifyContent="center"
				>
					<GemImage />
				</FansView>
			</FansView>

			<FansView gap={42} margin={{ b: 28 }}>
				<Information
					title="App-like feel"
					description="Enjoy a fast, engaging app experience directly from your phone homescreen"
					icon={
						<FilledHeartSvg
							width={20}
							height={18}
							color="#a854f5"
						/>
					}
				/>
				<Information
					title="Push notifications"
					description="Stay updated with real-time notifications for purchases, updates, and messages"
					icon={<PushNotificationSvg size={25} color="#a854f5" />}
				/>
				<Information
					title="Offline access"
					description="Use our app even with poor or no internet connection, ensuring uninterrupted access"
					icon={<OfflineAccessSvg size={24} color="#a854f5" />}
				/>
				<Information
					title="No app-store needed"
					description="Skip the app store downloads and updates. Our PWA is always current and ready to use"
					icon={
						<StarCheckSvg width={22} height={21} color="#a854f5" />
					}
				/>
			</FansView>

			<FansView gap={13}>
				<RoundButton
					variant={RoundButtonType.PRIMARY}
					onPress={onPressInstall}
				>
					Install now
				</RoundButton>
				<FypLink
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					color="purple"
					hideUnderline
					style={tw.style("mx-auto")}
					onPress={handleClose}
				>
					Not now
				</FypLink>
			</FansView>
		</Animated.View>
	);
};

const PwaInstallModal = () => {
	const { state, dispatch } = useAppContext();
	const modals = state.modal.modals;
	const modal = modals.find(
		(m) => m.id === PWA_INSTALL_DIALOG_ID,
	) as ModalState<{ step: PwaInstallModalSteps; hidePrevBtn?: boolean }>;
	const visible = !!modal && modal.show;

	const step = modal?.payload?.step ?? "start";
	const hidePrevBtn = modal?.payload?.hidePrevBtn;

	const handleClose = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: PWA_INSTALL_DIALOG_ID, show: false },
		});
	};

	const onChangeStep = (val: PwaInstallModalSteps) => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: PWA_INSTALL_DIALOG_ID,
				show: true,
				payload: { step: val, hidePrevBtn: false },
			},
		});
	};

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView padding={{ t: 36, x: 18, b: 15 }} position="relative">
				<FypNullableView visible={step === "info" && !hidePrevBtn}>
					<FansIconButton
						size={25}
						backgroundColor="bg-transparent"
						style={tw.style("absolute left-[14px] top-[14px]")}
						onPress={() => onChangeStep("start")}
					>
						<ChevronLeftSvg size={13} color="#707070" />
					</FansIconButton>
				</FypNullableView>
				<FansIconButton
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					size={25}
					onPress={handleClose}
					style={tw.style("absolute top-[14px] right-[14px]")}
				>
					<CloseSvg size={10} color="#fff" />
				</FansIconButton>

				<FypNullableView visible={step === "start"}>
					<StartContents onChangeStep={onChangeStep} />
				</FypNullableView>
				<FypNullableView visible={step === "success"}>
					<SuccessContents handleClose={handleClose} />
				</FypNullableView>
				<FypNullableView visible={step === "info"}>
					<InformationContents
						handleClose={handleClose}
						onChangeStep={onChangeStep}
					/>
				</FypNullableView>
			</FansView>
		</FypModal>
	);
};

export default PwaInstallModal;
