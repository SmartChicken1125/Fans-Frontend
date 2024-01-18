import { UserSvg } from "@assets/svgs/common";
import { FypText, FypCheckbox } from "@components/common/base";
import tw from "@lib/tailwind";
import { ProfileThemeType } from "@usertypes/commonEnums";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	title: ProfileThemeType;
	selected: boolean;
	onSelect: () => void;
}

const ProfileTheme: FC<Props> = (props) => {
	const { title, selected, onSelect } = props;

	return (
		<View>
			<View
				style={tw.style(
					"w-[132px] h-[165px] bg-fans-grey rounded-[7px] pt-6 relative",
				)}
			>
				<View
					style={tw.style(
						"bg-white rounded-full w-[46px] h-[46px] items-center justify-center flex-row mx-auto",
					)}
				>
					<UserSvg width={24.38} height={24.82} color="#000" />
				</View>
				<FypCheckbox
					checked={selected}
					onPress={onSelect}
					style={tw.style("absolute top-[10px] right-[10px]")}
				/>
			</View>

			<FypText
				fontSize={16}
				lineHeight={21}
				textAlign="center"
				fontWeight={500}
				style={tw.style("text-fans-dark-grey mt-2")}
			>
				{title}
			</FypText>
		</View>
	);
};

export default ProfileTheme;
