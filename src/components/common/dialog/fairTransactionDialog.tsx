import { CloseSvg } from "@assets/svgs/common";
import { TransactionImage } from "@assets/svgs/images";
import TextButton from "@components/common/TextButton";
import { FypModal, FypLink, FypSvg } from "@components/common/base";
import { FansText, FansIconButton, FansView } from "@components/controls";
import { FAIR_TRANSACTION_DIALOG_ID } from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import { useAppContext, ModalActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { useBlankLink } from "@utils/useBlankLink";
import React from "react";
import RoundButton from "../RoundButton";

const FairTransactionDialog = () => {
	const [openLink] = useBlankLink();
	const { state, dispatch } = useAppContext();
	const modals = state.modal.modals;
	const modal = modals.find(
		(m) => m.id === FAIR_TRANSACTION_DIALOG_ID,
	) as ModalState;
	const visible = !!modal && modal.show;

	const handleClose = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: FAIR_TRANSACTION_DIALOG_ID, show: false },
		});
	};

	const onContactSupport = () => {
		openLink("https://support.fyp.fans/");
	};

	const onLearnMore = () => {};

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
					<FypSvg svg={TransactionImage} width={88} height={82} />
				</FansView>
				<FansText
					fontSize={23}
					lineHeight={31}
					style={tw.style("text-center font-bold mb-[18px]")}
				>
					IMPORTANT READ:{"\n"}Fair Transactions
				</FansText>
				<FansView gap={30} margin={{ b: 24 }}>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-center")}
					>
						If you are unhappy by a purchase,{" "}
						<FypLink onPress={onContactSupport} color="purple">
							CONTACT US
						</FypLink>
						, and we will FULLY REFUND YOU, without any questions
						asked.
					</FansText>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-center")}
					>
						At FYP.Fans, trust and community safety are central. If
						you face transaction issues, please contact our&nbsp;
						<FypLink onPress={onContactSupport} color="purple">
							support
						</FypLink>
						&nbsp;before initiating a chargeback through your bank.
						Accounts involved in chargebacks without prior
						communication may be subject to permanent closure.
					</FansText>
				</FansView>

				<FansView gap={8}>
					<RoundButton onPress={onContactSupport}>
						Contact Support
					</RoundButton>
					<TextButton onPress={handleClose}>Close</TextButton>
				</FansView>
			</FansView>
		</FypModal>
	);
};

export default FairTransactionDialog;
