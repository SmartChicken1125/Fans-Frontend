import { CloseSvg } from "@assets/svgs/common";
import { SubmitImage } from "@assets/svgs/images";
import RoundButton from "@components/common/RoundButton";
import { FansSvg, FansText, FansView } from "@components/controls";
import { FansModal3 } from "@components/controls/Modal";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IFansModal } from "@usertypes/components";
import React, { FC } from "react";
import { View, Text, Image } from "react-native";
import { Modal, Portal, IconButton } from "react-native-paper";

interface Props {
	visible: boolean;
	handleClose: () => void;
}

const ReportModal: IFansModal = (props) => {
	const { onClose: handleClose } = props;

	return (
		<FansModal3 width={{ lg: 741 }} {...props}>
			<View style={tw.style("flex gap-[10px]", "m-[15px]")}>
				<IconButton
					icon={() => (
						<CloseSvg width={9.33} height={9.33} color="#fff" />
					)}
					mode="contained"
					containerColor="rgba(0,0,0,0.3)"
					style={tw.style(
						"w-[25px] h-[25px] absolute top-[0px] right-[0px]",
					)}
					onPress={handleClose}
				/>
				<FansView style={tw.style("self-center")}>
					<FansSvg width={81.26} height={78} svg={SubmitImage} />
				</FansView>
				<FansText
					fontFamily="inter-bold"
					fontSize={23}
					textAlign="center"
				>
					Submitted
				</FansText>
				<FansText fontFamily="inter-semibold" fontSize={17}>
					Current status
				</FansText>
				<FansText>
					We've received your report and have temporarily concealed
					the contentious post from your view
				</FansText>
				<FansText fontFamily="inter-semibold" fontSize={17}>
					Next steps
				</FansText>
				<FansText>
					Our team will need a few days to assess your report, but
					rest assured we are working on it
				</FansText>
				<FansText>
					Prevent @MokuFinance from following you, seeing your posts,
					or messaging you by blocking them, which will also disable
					their tweets and notifications from appearing to you
				</FansText>
				<RoundButton variant={RoundButtonType.OUTLINE} color="#F00">
					Block @MokuFinance
				</RoundButton>
			</View>
		</FansModal3>
	);
};

export default ReportModal;
