import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import CustomRadio from "@components/common/customRadio";
import { FansDivider, FansText } from "@components/controls";
import {
	BLOCK_CREATOR_MODAL_ID,
	MESSAGE_REPORT_DIALOG_ID,
} from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import { ModalActionType, useAppContext } from "@context/useAppContext";
import { createMessageReport } from "@helper/endpoints/chat/apis";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

const MESSAGE_REPORT_FLAG = [
	{ code: "ILLEGAL_CONTENT", label: "Illegal content" },
	{ code: "UNDERAGE_CONTENT", label: "Underage content" },
	{ code: "GRAPHIC_VOILENCE_OR_GORE", label: "Graphic violence or gore" },
	{ code: "HARASSMENT_OR_BULLYING", label: "Harassment or bullying" },
	{
		code: "SELF_HARM_OR_SUICIDE_CONTENT",
		label: "Self-harm or suicide content",
	},
	{ code: "NON_CONSENSUAL_CONTENT", label: "Non-consensual content" },
	{ code: "SPAM_OR_SCAM", label: "Spam or scam" },
	{
		code: "INFRINGEMENT_OF_MY_COPYRIGHT",
		label: "Infringement of my copyright",
	},
	{ code: "OTHER", label: "Other" },
] as const;

const ChatReportDialog: React.FC = () => {
	const { state, dispatch } = useAppContext();
	const modals = state.modal.modals;
	const modal = modals.find(
		(m) => m.id === MESSAGE_REPORT_DIALOG_ID,
	) as ModalState<{ messageId: string }>;
	const messageId = modal?.payload?.messageId;
	const [index, setIndex] = useState(0);
	const [reason, setReason] = useState("");

	const handleClose = useCallback(() => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: MESSAGE_REPORT_DIALOG_ID, show: false },
		});
	}, []);

	const handleSubmit = useCallback(async () => {
		if (messageId) {
			const resp = await createMessageReport({
				messageId: messageId,
				reportFlag: MESSAGE_REPORT_FLAG[index].code,
				reason: reason.length > 0 ? reason : undefined,
			});

			if (resp.ok) {
				dispatch.setModal({
					type: ModalActionType.showModal,
					data: { id: MESSAGE_REPORT_DIALOG_ID, show: false },
				});
			}
		}
	}, [messageId, index, reason]);

	return (
		<BottomSheetWrapper open={!!modal && modal.show} onClose={handleClose}>
			<View style={tw.style("m-[15px]", "flex gap-[15px]")}>
				<FansText
					fontFamily="inter-bold"
					fontSize={19}
					textAlign="center"
				>
					Why are you reporting?
				</FansText>
				<View style={tw.style("h-[20px]")} />

				{MESSAGE_REPORT_FLAG.map((flag, i) => (
					<React.Fragment key={i}>
						<CustomRadio
							key={flag.code}
							label={flag.label}
							checked={index === i}
							onPress={() => setIndex(i)}
						/>
						{i < MESSAGE_REPORT_FLAG.length - 1 && <FansDivider />}
					</React.Fragment>
				))}

				{MESSAGE_REPORT_FLAG[index].code === "OTHER" && (
					<RoundTextInput
						placeholder={"Describe your issue"}
						value={reason}
						onChangeText={setReason}
					/>
				)}

				<RoundButton
					// disabled={}
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={handleSubmit}
				>
					<FansText>Submit</FansText>
				</RoundButton>
			</View>
		</BottomSheetWrapper>
	);
};

export default ChatReportDialog;
