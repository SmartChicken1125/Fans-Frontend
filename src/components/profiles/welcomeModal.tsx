import { CloseSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { FC } from "react";
import { Image, View } from "react-native";
import { IconButton, Modal, Portal } from "react-native-paper";

interface Props {
	visible: boolean;
	handleClose: () => void;
}

const WelcomeModal: FC<Props> = (props) => {
	const { visible, handleClose } = props;

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={handleClose}
				contentContainerStyle={tw.style(
					"bg-white rounded-[15px] mx-[18px]",
				)}
			>
				<View style={tw.style("relative")}>
					<Image
						source={require("@assets/images/profile/welcome-hero.jpg")}
						resizeMode="cover"
						style={tw.style("rounded-t-[15px] w-full h-[148px]")}
					/>
					<IconButton
						icon={() => (
							<CloseSvg width={9.33} height={9.33} color="#fff" />
						)}
						mode="contained"
						containerColor="rgba(0,0,0,0.3)"
						style={tw.style(
							"w-[25px] h-[25px] absolute top-[14px] right-[14px]",
						)}
						onPress={handleClose}
					/>
				</View>

				<View style={tw.style("pt-[30px] px-[28px] pb-[34px]")}>
					<FypText
						fontSize={23}
						lineHeight={31}
						fontWeight={700}
						textAlign="center"
						margin={{ b: 18 }}
						style={tw.style("text-black")}
					>
						Welcome to FYP.Fans!
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						textAlign="center"
						margin={{ b: 26 }}
						style={tw.style("text-black")}
					>
						Get set to customize your page and create your
						membership. You're just a few steps away from sharing
						your unique content with the world!
					</FypText>

					<View style={tw.style("w-[170px] mx-auto")}>
						<RoundButton
							variant={RoundButtonType.OUTLINE_PRIMARY}
							onPress={handleClose}
						>
							Get started
						</RoundButton>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default WelcomeModal;
