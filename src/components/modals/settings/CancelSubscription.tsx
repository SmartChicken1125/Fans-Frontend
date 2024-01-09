import RoundButton from "@components/common/RoundButton";
import { FansDivider, FansGap, FansText, FansView } from "@components/controls";
import { FansModal3 } from "@components/controls/Modal";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IFansModal } from "@usertypes/components";
import React from "react";
import { View } from "react-native";
import AvatarWithStatus from "../../common/AvatarWithStatus";

interface Props {
	visible: boolean;
	handleClose: () => void;
	handleConfirm: () => void;
}

const CancelSubscriptionModal: IFansModal = (props) => {
	const { onClose: handleClose, onSubmit: handleSubmit } = props;

	return (
		<FansModal3
			width={{ lg: 433 }}
			modalStyle={{ padding: { x: 17, t: 25, b: 27 } }}
			{...props}
		>
			<View style={tw.style("flex-row justify-center")}>
				<AvatarWithStatus avatar="" size={79} />
			</View>

			<FansGap height={19} />

			<FansDivider style={tw.style("h-[1px]")} />

			<FansGap height={18} />

			<FansView padding={{ x: 40 }}>
				<FansText
					fontFamily="inter-bold"
					fontSize={19}
					textAlign="center"
				>
					Are you sure you want to cancel your subscription?
				</FansText>
			</FansView>

			<FansGap height={21} />

			<View style={tw.style("flex-row gap-x-[14px]")}>
				<View style={tw.style("flex-1")}>
					<RoundButton
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={handleClose}
					>
						Go back
					</RoundButton>
				</View>
				<View style={tw.style("flex-1")}>
					<RoundButton
						onPress={() => {
							handleSubmit();
						}}
					>
						Yes cancel
					</RoundButton>
				</View>
			</View>
		</FansModal3>
	);
};

export default CancelSubscriptionModal;
