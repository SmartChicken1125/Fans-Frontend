import { PictureCamera, RecordSvg, HeartSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	photos: number;
	videos: number;
	likes: number;
}

const CountsDetails: FC<Props> = (props) => {
	const { photos, videos, likes } = props;

	return (
		<View style={tw.style("flex-row items-center gap-x-3")}>
			<View style={tw.style("flex-row items-center")}>
				<FypSvg
					svg={PictureCamera}
					width={20}
					height={17}
					color="fans-grey-70 dark:fans-grey-b1"
				/>
				<FypText
					fontSize={15}
					lineHeight={20}
					margin={{ l: 8 }}
					fontWeight={500}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{photos}
				</FypText>
			</View>

			<View style={tw.style("flex-row items-center")}>
				<FypSvg
					svg={RecordSvg}
					width={24}
					height={16}
					color="fans-grey-70 dark:fans-grey-b1"
				/>
				<FypText
					fontSize={15}
					lineHeight={20}
					margin={{ l: 8 }}
					fontWeight={500}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{videos}
				</FypText>
			</View>

			<View style={tw.style("flex-row items-center")}>
				<FypSvg
					svg={HeartSvg}
					width={19}
					height={17}
					color="fans-grey-70 dark:fans-grey-b1"
				/>
				<FypText
					fontSize={15}
					lineHeight={20}
					margin={{ l: 8 }}
					fontWeight={500}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{likes}
				</FypText>
			</View>
		</View>
	);
};

export default CountsDetails;
