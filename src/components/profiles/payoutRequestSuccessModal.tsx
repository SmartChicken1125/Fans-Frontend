import { CloseSvg } from "@assets/svgs/common";
import { FypModal, FypText, FypButton2, FypSvg } from "@components/common/base";
import {
	FansIconButton,
	FansView,
	FansGap,
	FansDivider,
} from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Image } from "react-native";

interface Props {
	visible: boolean;
	handleClose: () => void;
}

const PayoutRequestSuccessModal: FC<Props> = (props) => {
	const { visible, handleClose } = props;

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView position="relative" borderRadius={15}>
				<FansIconButton
					size={25}
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					style={tw.style("absolute top-[14px] right-[14px] z-1")}
					onPress={handleClose}
				>
					<FypSvg
						svg={CloseSvg}
						width={12}
						height={12}
						color="fans-white dark:fans-black-1d"
					/>
				</FansIconButton>
				<FansView height={148}>
					<Image
						source={{
							uri: require("@assets/images/profile/payout-request-success.png"),
						}}
						style={tw.style("w-full h-full rounded-t-[15px]")}
						resizeMode="cover"
					/>
				</FansView>
				<FansView
					padding={{ t: 25, b: 20, x: 18 }}
					style={tw.style(
						"bg-fans-white dark:bg-fans-black-1d rounded-b-[15px]",
					)}
				>
					<FypText
						fontSize={21}
						fontWeight={700}
						textAlign="center"
						fontFamily="inter-v"
						lineHeight={28}
					>
						{`Payout requested${`\n`}successfully`}
					</FypText>
					<FansGap height={18} />
					<FypText
						fontSize={32}
						lineHeight={32}
						textAlign="center"
						fontFamily="inter-v"
						style={tw.style("text-fans-green-29")}
					>
						$100
					</FypText>
					<FansGap height={28} />
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						fontFamily="inter-v"
						fontWeight={600}
					>
						Time estimate:{" "}
						<FypText
							fontSize={16}
							lineHeight={21}
							fontFamily="inter-v"
							style={tw.style(
								"text-fans-grey-48 dark:text-fans-grey-b1",
							)}
						>
							12/12/24 10:30 pm
						</FypText>
					</FypText>
					<FansGap height={18} />
					<FansDivider />
					<FansGap height={18} />
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						fontFamily="inter-v"
					>
						Thank you for choosing FYP.Fans!
					</FypText>
					<FansGap height={24} />
					<FypButton2
						style={tw.style("bg-fans-purple")}
						textStyle={tw.style("text-fans-white")}
						pressableProps={{
							onPress: handleClose,
						}}
					>
						OK
					</FypButton2>
				</FansView>
			</FansView>
		</FypModal>
	);
};

export default PayoutRequestSuccessModal;
