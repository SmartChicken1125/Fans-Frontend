import { SearchSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import React, { FC } from "react";
import { TextInputProps } from "react-native";
import RoundTextInput from "./RoundTextInput";

interface Props extends TextInputProps {
	placeholder?: string;
	value: string;
	onChangeText: (val: string) => void;
}

const SearchTextInput: FC<Props> = (props) => {
	const { placeholder, value, onChangeText, ...others } = props;

	return (
		<RoundTextInput
			placeholder={placeholder ?? "Search"}
			value={value}
			onChangeText={onChangeText}
			icon={
				<FypSvg
					width={15.14}
					height={15.26}
					svg={SearchSvg}
					color="fans-black dark:fans-white"
				/>
			}
			{...others}
		/>
	);
};

export default SearchTextInput;
