import { CloseSvg, Warning2Svg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypModal, FypLink, FypText, FypSvg } from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { FC } from "react";

interface Props {
	visible: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const DeleteAccountRequestModal: FC<Props> = (props) => {
	const { visible, onClose, onConfirm } = props;

	return (
		<FypModal
			visible={visible}
			onDismiss={onClose}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView padding={{ t: 42, x: 18, b: 15 }} position="relative">
				<FansIconButton
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					size={25}
					onPress={onClose}
					style={tw.style("absolute top-[14px] right-3")}
				>
					<CloseSvg size={10} color="#fff" />
				</FansIconButton>
				<FansView alignItems="center" margin={{ b: 23 }}>
					<FypSvg
						color="fans-red-eb"
						width={77}
						height={69}
						svg={Warning2Svg}
					/>
				</FansView>
				<FypText
					fontSize={23}
					fontWeight={700}
					lineHeight={31}
					textAlign="center"
					margin={{ b: 15 }}
				>
					Confirm account{"\n"}deletion request
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					textAlign="center"
					margin={{ b: 26 }}
				>
					Your data will be permanently deleted 3 months after your
					request. You can reactivate your account anytime before this
					period ends
				</FypText>
				<FansView gap={13}>
					<RoundButton
						variant={RoundButtonType.CONTAINED_RED_EB}
						onPress={onConfirm}
					>
						Confirm
					</RoundButton>
					<FypLink
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						textAlign="center"
						hideUnderline
						onPress={onClose}
					>
						Go back
					</FypLink>
				</FansView>
			</FansView>
		</FypModal>
	);
};

export default DeleteAccountRequestModal;
