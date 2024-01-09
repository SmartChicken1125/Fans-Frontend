import { CloseSvg } from "@assets/svgs/common";
import TextButton from "@components/common/TextButton";
import { FypModal } from "@components/common/base";
import { FansText, FansIconButton, FansView } from "@components/controls";
import { NOTICE_CHARGEBACKS_DIALOG_ID } from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import { useAppContext, ModalActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { useBlankLink } from "@utils/useBlankLink";
import React from "react";
import { Image } from "react-native";
import RoundButton from "../RoundButton";

const NoticeChargeBackDialog = () => {
	const [openLink] = useBlankLink();
	const { state, dispatch } = useAppContext();
	const modals = state.modal.modals;
	const modal = modals.find(
		(m) => m.id === NOTICE_CHARGEBACKS_DIALOG_ID,
	) as ModalState;
	const visible = !!modal && modal.show;

	const handleClose = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: NOTICE_CHARGEBACKS_DIALOG_ID, show: false },
		});
	};

	const onContactSupport = () => {
		openLink("https://support.fyp.fans/");
	};

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView position="relative" padding={{ x: 18, t: 38, b: 14 }}>
				<FansIconButton
					size={25}
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					style={tw.style("absolute top-[13.5px] right-4")}
					onPress={handleClose}
				>
					<CloseSvg size={10} color="#fff" />
				</FansIconButton>
				<FansView alignItems="center" margin={{ b: 18 }}>
					<Image
						source={require("@assets/images/common/charge-back.png")}
						style={{ width: 80, height: 80 }}
					/>
				</FansView>
				<FansText
					fontSize={23}
					lineHeight={31}
					style={tw.style("text-center font-bold mb-[22px]")}
				>
					Notice on Chargebacks
				</FansText>
				<FansView gap={10} margin={{ b: 24 }}>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-center")}
					>
						Dear [User’s First Name],
					</FansText>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-center")}
					>
						We’ve noted a chargeback initiated by you. Frequent
						chargebacks adversely affect our platform and community.
					</FansText>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-center")}
					>
						Further chargebacks will lead to the permanent
						termination of your FYP.Fans account for the trust and
						safety of all members.
					</FansText>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-center")}
					>
						If you have concerns, please contact our support first.
						We’re here to help.
					</FansText>
				</FansView>

				<RoundButton onPress={onContactSupport}>
					Contact Support
				</RoundButton>
				<TextButton onPress={handleClose}>Close</TextButton>
			</FansView>
		</FypModal>
	);
};

export default NoticeChargeBackDialog;
