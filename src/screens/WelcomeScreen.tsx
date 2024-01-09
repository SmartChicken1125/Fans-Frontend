import RoundButton from "@components/common/RoundButton";
import { WelcomeLayout } from "@components/layouts";
import tw from "@lib/tailwind";
import { StackActions } from "@react-navigation/native";
import { RoundButtonType } from "@usertypes/commonEnums";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

const WelcomeScreen = () => {
	const router = useRouter();

	return (
		<WelcomeLayout>
			<View
				style={tw.style(
					"absolute left-[17px] right-[19px] bottom-10",
					"flex flex-col",
				)}
			>
				<Text
					style={tw`font-inter-semibold text-center leading-8 text-white text-[23px]`}
				>
					Join the ultimate platform for exclusive content
				</Text>
				<RoundButton
					variant={RoundButtonType.OUTLINE_WHITE}
					customStyles={"mt-[38px]"}
					onPress={() => router.push("/auth/login")}
				>
					Continue
				</RoundButton>
			</View>
		</WelcomeLayout>
	);
};

export default WelcomeScreen;
