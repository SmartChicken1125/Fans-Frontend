import { CloseSvg } from "@assets/svgs/common";
import { SuccessImage } from "@assets/svgs/images";
import RoundButton from "@components/common/RoundButton";
import { FypModal, FypLink, FypText } from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import { DELETE_ACCOUNT_SUCCESS_DIALOG_ID } from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import { useAppContext, ModalActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { useRouter } from "expo-router";
import React from "react";

const DeleteAccountSuccessModal = () => {
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const modals = state.modal.modals;
	const modal = modals.find(
		(m) => m.id === DELETE_ACCOUNT_SUCCESS_DIALOG_ID,
	) as ModalState;
	const visible = !!modal && modal.show;

	const onClose = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: DELETE_ACCOUNT_SUCCESS_DIALOG_ID, show: false },
		});
	};

	const onPressCreateNew = () => {
		onClose();
		router.replace("/auth/register");
	};

	return (
		<FypModal
			visible={visible}
			onDismiss={onClose}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView padding={{ t: 38, x: 18, b: 15 }} position="relative">
				<FansIconButton
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					size={25}
					onPress={onClose}
					style={tw.style("absolute top-[14px] right-3")}
				>
					<CloseSvg size={10} color="#fff" />
				</FansIconButton>
				<FansView alignItems="center" margin={{ b: 18 }}>
					<SuccessImage size={82} />
				</FansView>
				<FypText
					fontSize={23}
					fontWeight={700}
					lineHeight={31}
					textAlign="center"
					margin={{ b: 15 }}
				>
					Your account deletion{"\n"}
					process has begun
				</FypText>
				<FansView gap={33} margin={{ b: 26 }}>
					<FypText fontSize={16} lineHeight={21} textAlign="center">
						In accordance with GDPR and to ensure the safety and
						security of our community, we will retain your
						information for up to three months. This allows us to
						review any potential illicit activities or fraud related
						to your account.
					</FypText>
					<FypText fontSize={16} lineHeight={21} textAlign="center">
						Your personal data will be fully deleted from our
						systems after this safety review period, in accordance
						with legal and regulatory requirements. Thank you for
						being a part of our community
					</FypText>
				</FansView>

				<FansView gap={13}>
					<RoundButton onPress={onClose}>OK</RoundButton>
					<FypLink
						color="purple"
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						textAlign="center"
						hideUnderline
						onPress={onPressCreateNew}
					>
						Create new account
					</FypLink>
				</FansView>
			</FansView>
		</FypModal>
	);
};

export default DeleteAccountSuccessModal;
