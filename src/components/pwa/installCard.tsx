import { SingleGem, CloseSvg } from "@assets/svgs/common";
import {
	FypText,
	FypLink,
	FypLinearGradientView,
	FypSvg,
} from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import { PWA_INSTALL_DIALOG_ID } from "@constants/modal";
import {
	useAppContext,
	ModalActionType,
	CommonActionType,
} from "@context/useAppContext";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { FC } from "react";
import RoundButton from "../common/RoundButton";

interface Props {
	description?: string;
}

const PwaInstallCard: FC<Props> = (props) => {
	const { description } = props;
	const { dispatch } = useAppContext();

	const onPressMoreInfo = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: PWA_INSTALL_DIALOG_ID,
				show: true,
				payload: { hidePrevBtn: true, step: "info" },
			},
		});
	};

	const onPressInstall = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: PWA_INSTALL_DIALOG_ID,
				show: true,
				payload: { step: "start" },
			},
		});
	};

	const onHandleClose = () => {
		dispatch.setCommon({
			type: CommonActionType.SetShowPWAInstallPrompt,
			data: false,
		});
		localStorage.setItem("hidePWAInstallPrompt", "true");
	};

	return (
		<FansView
			borderRadius={15}
			padding={{ y: 20, x: 18 }}
			position="relative"
			style={tw.style("border border-fans-grey dark:border-fans-grey-43")}
		>
			<FansIconButton
				size={25}
				backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
				style={tw.style("absolute top-4 right-[14px]")}
				onPress={onHandleClose}
			>
				<FypSvg
					svg={CloseSvg}
					width={10}
					height={10}
					color="fans-white dark:fans-black"
				/>
			</FansIconButton>
			<FansView flexDirection="row" margin={{ b: 16 }} gap={16}>
				<FypLinearGradientView
					colors={["#1d21e5", "#d885ff"]}
					size={75}
					borderRadius={75}
					alignItems="center"
					justifyContent="center"
				>
					<SingleGem color="#fff" size={45} />
				</FypLinearGradientView>
				<FansView flex="1">
					<FypText
						fontSize={19}
						lineHeight={21}
						fontWeight={600}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Install FYP.Fans
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						margin={{ t: 6 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{description ??
							"Install the PWA app on your device to easily access it anytime."}
						{"\n"}
						<FypLink
							color="purple"
							hideUnderline
							fontWeight={600}
							onPress={onPressMoreInfo}
						>
							More info
						</FypLink>
					</FypText>
				</FansView>
			</FansView>

			<RoundButton
				variant={RoundButtonType.OUTLINE_PRIMARY}
				onPress={onPressInstall}
			>
				Install
			</RoundButton>
		</FansView>
	);
};

export default PwaInstallCard;
