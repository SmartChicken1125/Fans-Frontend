import UserAvatar from "@components/avatar/UserAvatar";
import RoundButton from "@components/common/RoundButton";
import { FypText, FypLinearGradientView } from "@components/common/base";
import { FansView } from "@components/controls";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { ComponentSizeTypes, RoundButtonType } from "@usertypes/commonEnums";
import { IProfile } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { Image } from "react-native";

interface Props {
	data: IProfile;
}

const SuggestProfile: FC<Props> = (props) => {
	const { data } = props;
	const router = useRouter();
	const { dispatch } = useAppContext();

	const onClickView = () => {
		if (data.profileLink) {
			const username = data.profileLink;
			router.push(`/${username}`);
			dispatch.setCommon({
				type: CommonActionType.setCreatorUsername,
				data: username,
			});
		}
	};

	return (
		<FansView
			position="relative"
			borderRadius={15}
			pressableProps={{
				onPress: onClickView,
			}}
			style={tw.style(
				"border border-fans-grey-f0 dark:border-fans-grey-43",
			)}
		>
			<FansView height={63} width="full" borderRadius={{ t: 15 }}>
				{data.cover.length > 0 ? (
					<Image
						source={{ uri: cdnURL(data.cover[0]) }}
						style={tw.style("w-full h-full rounded-t-[15px]")}
						resizeMode="cover"
					/>
				) : (
					<FypLinearGradientView
						colors={["#8a49f1", "#d885ff"]}
						width="full"
						height="full"
						borderRadius={{ t: 15 }}
					/>
				)}
			</FansView>

			<FansView
				alignItems="center"
				flexDirection="row"
				justifyContent="between"
				padding={{ r: 12, l: 106 }}
				borderRadius={{ b: 15 }}
			>
				<FansView padding={{ t: 8, b: 12 }} flex="1">
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={700}
						style={tw.style("text-fans-black dark:text-fans-white")}
						numberOfLines={1}
						onPress={onClickView}
					>
						{data.displayName}
					</FypText>
					<FypText
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1",
						)}
						fontSize={16}
						lineHeight={21}
						margin={{ t: -2 }}
						numberOfLines={1}
					>
						{`@${data.username}`}
					</FypText>
				</FansView>

				<FansView width={89}>
					<RoundButton
						variant={RoundButtonType.OUTLINE_PRIMARY}
						onPress={onClickView}
						size={ComponentSizeTypes.md}
					>
						View
					</RoundButton>
				</FansView>
			</FansView>

			<FansView
				borderRadius={75}
				position="absolute"
				left={11}
				top={28}
				style={tw.style(
					"border-[4px] border-fans-white dark:border-fans-black-1d",
				)}
			>
				<UserAvatar image={data.avatar} size="75px" />
			</FansView>
		</FansView>
	);
};

export default SuggestProfile;
