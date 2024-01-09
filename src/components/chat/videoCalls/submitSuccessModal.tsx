import { CloseSvg } from "@assets/svgs/common";
import { SuccessImage } from "@assets/svgs/images";
import { FypSvg, FypText } from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Modal } from "react-native";

interface Props {
	open: boolean;
	handleClose: () => void;
	handleSubmit: () => void;
}

const SubmitSuccessModal: FC<Props> = (props) => {
	const { open, handleClose, handleSubmit } = props;
	return (
		<Modal transparent visible={open}>
			<FansView
				width="full"
				height="full"
				position="relative"
				alignItems="center"
				justifyContent="center"
				style={tw.style("bg-fans-black/30 px-[18px]")}
				touchableOpacityProps={{
					activeOpacity: 1,
					onPress: handleClose,
				}}
			>
				<FansView
					touchableOpacityProps={{ activeOpacity: 1 }}
					padding={{ b: 20, x: 18, t: 38 }}
					position="relative"
					style={tw.style(
						"w-full md:w-[450px]",
						"h-auto max-h-9/10",
						"rounded-[15px] px-[14px]",
						"bg-fans-white dark:bg-fans-black-1d",
					)}
				>
					<FansIconButton
						size={25}
						backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
						onPress={handleClose}
						style={tw.style("absolute top-[14px] right-[14px]")}
					>
						<FypSvg
							svg={CloseSvg}
							width={11}
							height={11}
							color="fans-white dark:fans-black-1d"
						/>
					</FansIconButton>
					<FypSvg
						svg={SuccessImage}
						width={82}
						height={78}
						style={tw.style("mx-auto")}
					/>
					<FypText
						fontSize={23}
						lineHeight={31}
						fontWeight={700}
						textAlign="center"
						margin={{ t: 20, b: 18 }}
					>
						Submitted
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						margin={{ b: 48 }}
					>
						We will respond promptly to assist you. However, if you
						are in immediate danger or need urgent help, please call
						your local authorities immediately
					</FypText>
					<FansView
						height={42}
						borderRadius={42}
						alignItems="center"
						justifyContent="center"
						style={tw.style("bg-fans-purple")}
						pressableProps={{
							onPress: handleSubmit,
						}}
					>
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							style={tw.style("text-fans-white")}
						>
							Return to home
						</FypText>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default SubmitSuccessModal;
