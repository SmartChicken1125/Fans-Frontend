import { ChevronLeftSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { FansText, FansDivider, FansView } from "@components/controls";
import IconComponents from "@helper/iconComponents";
import tw from "@lib/tailwind";
import { IconTypes } from "@usertypes/commonEnums";
import React, { Fragment, FC } from "react";
import { ActivityIndicator } from "react-native-paper";

interface Props {
	title: string;
	rightLabel?: string;
	onClickRight?: () => void;
	onClickLeft: () => void;
	titleIcon?: IconTypes;
	leftIcon?: IconTypes;
	loading?: boolean;
}

const ModalHeader: FC<Props> = (props) => {
	const {
		title,
		rightLabel,
		onClickRight,
		onClickLeft,
		titleIcon,
		leftIcon,
		loading,
	} = props;

	const getTitleIcon = () => {
		if (titleIcon) {
			const TitleIcon = Object.hasOwnProperty.call(
				IconComponents,
				titleIcon,
			)
				? IconComponents[titleIcon]
				: undefined;

			return TitleIcon ? (
				<FypSvg
					width={18}
					height={18}
					svg={TitleIcon}
					color="fans-black dark:fans-white"
				/>
			) : null;
		} else {
			return null;
		}
	};

	const getLeftIcon = () => {
		if (leftIcon) {
			const LeftIcon = Object.hasOwnProperty.call(
				IconComponents,
				leftIcon,
			)
				? IconComponents[leftIcon]
				: null;
			return LeftIcon ? (
				<FypSvg
					width={14.3}
					height={14.3}
					svg={LeftIcon}
					color="fans-black dark:fans-white"
				/>
			) : null;
		} else {
			return (
				<FypSvg
					width={16}
					height={16}
					svg={ChevronLeftSvg}
					color="fans-grey-70 dark:fans-grey-b1"
				/>
			);
		}
	};

	return (
		<Fragment>
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				position="absolute"
				style={tw.style("py-[34px] top-[-100px] w-full")}
			>
				<FansView
					position="absolute"
					alignItems="center"
					justifyContent="center"
					flexDirection="row"
					width={20}
					height={20}
					left={40}
					pressableProps={{
						onPress: onClickLeft,
					}}
				>
					{getLeftIcon()}
				</FansView>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					gap={10}
				>
					{getTitleIcon()}
					<FansText
						fontSize={23}
						lineHeight={31}
						style={tw.style(
							"font-bold text-fans-black dark:text-fans-white",
						)}
					>
						{title}
					</FansText>
				</FansView>

				<FansView
					style={tw.style(
						"absolute right-8 flex-row items-center",
						!onClickRight && "hidden",
					)}
					pressableProps={{
						onPress: () => {
							if (!loading && onClickRight) {
								onClickRight();
							}
						},
					}}
				>
					<ActivityIndicator
						animating={!!loading}
						color="#a854f5"
						size={16}
					/>
					<FansText
						fontSize={19}
						lineHeight={26}
						style={tw.style(
							"font-bold text-fans-purple ml-2",
							"text-fans-black dark:text-fans-white",
							loading && "opacity-50",
						)}
					>
						{rightLabel}
					</FansText>
				</FansView>
			</FansView>
			<FansDivider style={tw.style("mx-8")} />
		</Fragment>
	);
};

export default ModalHeader;
