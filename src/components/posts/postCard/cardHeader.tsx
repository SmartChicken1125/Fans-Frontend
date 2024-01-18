import {
	StarCheckSvg,
	ThreeDotsSvg,
	RoundedBorderSvg,
	Pin2Svg,
} from "@assets/svgs/common";
import { FypText, FypNullableView, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IPost } from "@usertypes/types";
import { getAgoTime } from "@utils/common";
import { useRouter } from "expo-router";
import React, { FC, useState } from "react";
import AvatarWithStatus from "../../common/AvatarWithStatus";

interface Props {
	data: IPost;
	handlePressDots: () => void;
}

const CardHeader: FC<Props> = (props) => {
	const { data, handlePressDots } = props;
	const router = useRouter();
	const [width, setWidth] = useState(0);

	const onGoToProfile = () => {
		const profileLink = data.profile?.profileLink;
		if (profileLink) {
			router.push(`/${profileLink}`);
		}
	};

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			justifyContent="between"
			gap={8}
			style={tw.style("px-[18px] md:px-0", data.isExclusive && "px-0")}
		>
			<FansView flexDirection="row" alignItems="center" flex="1">
				<FansView
					pressableProps={{
						onPress: onGoToProfile,
					}}
				>
					<FansView width={34} height={34} position="relative">
						<AvatarWithStatus
							avatar={data.profile?.avatar ?? ""}
							size={34}
							onPress={onGoToProfile}
						/>
						<FypNullableView
							visible={
								(data.profile?.activeStories?.length ?? 0) > 0
							}
						>
							<RoundedBorderSvg
								size={38}
								style={tw.style(
									"absolute top-[-2px] left-[-2px]",
								)}
							/>
						</FypNullableView>
					</FansView>
				</FansView>
				<FansView
					flexDirection="row"
					alignItems="center"
					flex="1"
					onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
				>
					<FansView
						pressableProps={{
							onPress: onGoToProfile,
						}}
						margin={{ l: 12 }}
						style={[
							{
								maxWidth:
									width -
									(tw.prefixMatch("md") ? 234 : 50) -
									20,
							},
						]}
					>
						<FypText
							fontSize={17}
							fontWeight={600}
							numberOfLines={1}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							{data.profile?.displayName ?? ""}
						</FypText>
					</FansView>

					<FypSvg
						svg={StarCheckSvg}
						width={13.66}
						height={13}
						style={tw.style("ml-4 mr-2")}
					/>

					<FansView
						width={4}
						height={4}
						borderRadius={4}
						margin={{ r: 8 }}
						style={tw.style(
							"bg-fans-grey-70 dark:bg-fans-grey-b1 hidden md:flex",
						)}
					></FansView>

					<FypText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"min-w-30 text-fans-grey-70 dark:text-fans-grey-b1 hidden md:flex",
						)}
					>
						{getAgoTime(data.createdAt ?? "")}
					</FypText>
					<FypNullableView visible={data.isPinned}>
						<FansView margin={{ l: 4 }}>
							<FypSvg
								svg={Pin2Svg}
								width={16}
								height={16}
								color="fans-black dark:fans-white"
							/>
						</FansView>
					</FypNullableView>
				</FansView>
			</FansView>

			<FansView flexDirection="row" alignItems="center" gap={11}>
				<FypNullableView visible={data.isExclusive}>
					<FansView
						width={100}
						height={30}
						borderRadius={30}
						justifyContent="center"
						alignItems="center"
						style={tw.style(
							"bg-fans-purple-f6 dark:bg-fans-purple-47",
						)}
					>
						<FypText
							fontSize={13}
							fontWeight={600}
							lineHeight={17}
							style={tw.style("text-fans-purple")}
						>
							EXCLUSIVE
						</FypText>
					</FansView>
				</FypNullableView>

				<FansView
					touchableOpacityProps={{
						onPress: handlePressDots,
					}}
					width={18}
					height={18}
					alignItems="center"
					justifyContent="center"
				>
					<FypSvg
						svg={ThreeDotsSvg}
						width={18}
						height={18}
						color="fans-black dark:fans-white"
					/>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default CardHeader;
