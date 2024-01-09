import { FypText, FypSwitch } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	label: string;
	value: boolean;
	onChange: (val: boolean) => void;
}

const SwitchInput: FC<Props> = (props) => {
	const { label, value, onChange } = props;

	return (
		<View
			style={tw.style("flex-row items-center justify-between py-[14px]")}
		>
			<FypText
				fontSize={18}
				lineHeight={24}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{label}
			</FypText>
			<FypSwitch value={value} onValueChange={onChange} />
		</View>
	);
};

export default SwitchInput;
