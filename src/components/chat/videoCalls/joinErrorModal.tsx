import { CloseSvg, VideoCameraSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
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

const JoinErrorModal: FC<Props> = (props) => {
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
					padding={{ b: 20, x: 18, t: 30 }}
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
					<FansView
						width={95}
						height={95}
						position="relative"
						margin={{ b: 18 }}
						style={tw.style("mx-auto")}
					>
						<UserAvatar size="95px" />
						<FansView
							width={42}
							height={42}
							borderRadius={42}
							alignItems="center"
							justifyContent="center"
							position="absolute"
							style={tw.style(
								"border-[4px] border-fans-white dark:border-fans-black-1d bg-fans-red",
								"right-[-4px] bottom-[-10.5px]",
							)}
						>
							<FypSvg
								svg={VideoCameraSvg}
								width={19}
								height={17}
								color="fans-white"
							/>
						</FansView>
					</FansView>
					<FypText
						fontSize={23}
						lineHeight={31}
						fontWeight={700}
						textAlign="center"
						margin={{ t: 20, b: 18 }}
					>
						We'are sorry, it seems the creator couldn't join!
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						margin={{ b: 24 }}
					>
						We apologize for any inconvenience caused. Please know
						that you will receive a 100% refund promptly (process
						within 7 days)
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

export default JoinErrorModal;
