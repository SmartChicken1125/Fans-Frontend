import { MailSvg, CloseSvg } from "@assets/svgs/common";
import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View, Pressable } from "react-native";

interface Props {
	email: string;
	onCancel: () => void;
}

const EmailChip: FC<Props> = (props) => {
	const { email, onCancel } = props;

	return (
		<View
			style={tw.style(
				"bg-white h-[34px] rounded-[34px] px-3 flex-row items-center",
			)}
		>
			<MailSvg width={16.85} height={13.5} color="#707070" />

			<FypText
				fontSize={16}
				lineHeight={21}
				margin={{ l: 6, r: 12 }}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{email}
			</FypText>

			<Pressable onPress={onCancel}>
				<CloseSvg width={11.1} height={11.1} color="#707070" />
			</Pressable>
		</View>
	);
};

export default EmailChip;
