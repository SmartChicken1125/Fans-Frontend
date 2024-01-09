import { GemSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypText } from "@components/common/base";
import tw from "@lib/tailwind";
import { IFansUser } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	data: IFansUser;
}

const IndividualFan: FC<Props> = (props) => {
	const { data } = props;
	return (
		<View
			style={tw.style(
				"flex-row items-center py-3 border-b border-fans-grey",
			)}
		>
			<UserAvatar size="46px" image={data.avatar ?? ""} />

			<View style={tw.style("ml-3")}>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{data.username}
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ t: -3 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{`Level ${data.level?.level ?? 1}`}
				</FypText>
			</View>

			<View style={tw.style("flex-row items-center ml-auto")}>
				<GemSvg size={15} />
				<FypText
					fontSize={16}
					lineHeight={21}
					fontWeight={500}
					margin={{ l: 8 }}
					style={tw.style("text-fans-purple")}
				>
					{data.level?.xp ?? 0}
				</FypText>
			</View>
		</View>
	);
};

export default IndividualFan;
