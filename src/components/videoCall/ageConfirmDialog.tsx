import { OutlinedInfoSvg, EighteenOrverSvg } from "@assets/svgs/common";
import { FypSvg, FypButton2, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { Modal } from "react-native";

interface Props {
	visible: boolean;
	handleVerify: () => void;
	handleLeave: () => void;
}

const AgeConfirmDialog: FC<Props> = (props) => {
	const { visible, handleLeave, handleVerify } = props;

	return (
		<Modal transparent visible={visible}>
			<FansView
				width="screen"
				height="screen"
				position="relative"
				padding={{ x: 18 }}
				alignItems="center"
				justifyContent="center"
				style={tw.style("bg-fans-black/80")}
			>
				<FansView maxWidth={358}>
					<FansView alignItems="center" margin={{ b: 26 }}>
						<FypSvg
							svg={EighteenOrverSvg}
							width={112}
							height={112}
							color="fans-white"
						/>
					</FansView>
					<FypText
						fontSize={23}
						fontWeight={700}
						lineHeight={31}
						margin={{ b: 30 }}
						textAlign="center"
						style={tw.style("text-fans-white")}
					>
						This page is 18+
					</FypText>
					<FypText
						textAlign="center"
						fontSize={16}
						lineHeight={25}
						margin={{ b: 36 }}
						style={tw.style("text-fans-white")}
					>
						Please confirm your age with a valild ID or Passport.
						this secure process takes two minutes. Thank you for
						ensuring a safe community!
					</FypText>
					<FypButton2
						style={tw.style("bg-fans-purple mb-2")}
						textStyle={tw.style("text-fans-white")}
						pressableProps={{
							onPress: handleVerify,
						}}
					>
						Verify
					</FypButton2>
					<FypButton2
						style={tw.style("border border-fans-white")}
						textStyle={tw.style("text-fans-white")}
						pressableProps={{
							onPress: handleLeave,
						}}
					>
						Leave this page
					</FypButton2>
				</FansView>

				<FansView
					position="absolute"
					left={0}
					width="full"
					justifyContent="center"
					flexDirection="row"
					padding={{ x: 18 }}
					style={tw.style("bottom-5 md:bottom-[58px]")}
				>
					<FansView
						padding={{ y: 13, x: 36 }}
						flexDirection="row"
						alignItems="center"
						borderRadius={15}
						gap={16}
						style={tw.style("bg-fans-white/20", "max-w-full")}
					>
						<FypSvg
							svg={OutlinedInfoSvg}
							width={15}
							height={15}
							color="fans-white"
						/>
						<FypText
							fontSize={16}
							style={tw.style("text-fans-white")}
						>
							ID Verification processed safely by third party
							Ondato LLC
						</FypText>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default AgeConfirmDialog;
