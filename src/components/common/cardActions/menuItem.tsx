import { FypText, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import IconComponents from "@helper/iconComponents";
import tw from "@lib/tailwind";
import { ICardAction } from "@usertypes/types";
import React, { FC } from "react";

interface Props {
	data: ICardAction;
}

const MenuItem: FC<Props> = (props) => {
	const { title, iconType, iconColor, onClick, labelClass, iconSize } =
		props.data;

	const IconComponent = Object.hasOwnProperty.call(IconComponents, iconType)
		? IconComponents[iconType]
		: undefined;

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			padding={{ x: 18 }}
			height={52}
			pressableProps={{
				onPress: onClick,
			}}
		>
			<FansView
				width={28}
				alignItems="center"
				justifyContent="center"
				margin={{ r: 18 }}
			>
				{IconComponent ? (
					<FypSvg
						width={iconSize ?? 24}
						height={iconSize ?? 24}
						color={
							iconColor ? iconColor : "fans-black dark:fans-white"
						}
						svg={IconComponent}
					/>
				) : null}
			</FansView>
			<FypText
				fontSize={18}
				lineHeight={24}
				style={tw.style(
					labelClass ?? "text-fans-black dark:text-fans-white",
				)}
			>
				{title}
			</FypText>
		</FansView>
	);
};

export default MenuItem;
