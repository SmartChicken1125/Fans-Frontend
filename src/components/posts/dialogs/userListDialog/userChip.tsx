import { CloseSvg } from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FypText, FypSvg } from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { FC } from "react";

interface Props {
	creator: IProfile;
	onCancel: () => void;
}

const UserChip: FC<Props> = (props) => {
	const { onCancel, creator } = props;

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			padding={{ y: 2.5, l: 3, r: 3 }}
			borderRadius={30}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<AvatarWithStatus avatar={creator.avatar} size={29} />
			<FypText
				fontSize={17}
				lineHeight={22}
				style={tw.style(
					"ml-[5.5px] mr-[18px]",
					"text-fans-black dark:text-fans-white",
				)}
				numberOfLines={1}
			>
				{creator.displayName}
			</FypText>
			<FansIconButton
				onPress={onCancel}
				size={24}
				backgroundColor="transparent"
			>
				<FypSvg
					svg={CloseSvg}
					width={9.1}
					height={9.1}
					color="fans-black dark:fans-white"
				/>
			</FansIconButton>
		</FansView>
	);
};

export default UserChip;
