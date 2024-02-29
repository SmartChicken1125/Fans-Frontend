import {
	PayPalSvg,
	ThreeDotsSvg,
	Bank2Svg,
	RevolutSvg,
} from "@assets/svgs/common";
import { FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { PaymentMethodType } from "@usertypes/commonEnums";
import React, { FC } from "react";
import { Image } from "react-native";

interface Props {
	paymentMethodType: PaymentMethodType;
	title: string;
	paymentInformation: string;
	onClickDots: () => void;
}

const PaymentMethod: FC<Props> = (props) => {
	const { paymentMethodType, title, paymentInformation, onClickDots } = props;

	const getIcons = () => {
		switch (paymentMethodType) {
			case PaymentMethodType.Bank:
				return (
					<FypSvg
						svg={Bank2Svg}
						width={22}
						height={24}
						color="fans-white"
					/>
				);
			case PaymentMethodType.PayPal:
				return (
					<FypSvg
						svg={PayPalSvg}
						width={26}
						height={26}
						color="fans-white"
					/>
				);
			case PaymentMethodType.Payoneer:
				return (
					<Image
						source={{
							uri: require("@assets/images/common/payoneer.png"),
						}}
						resizeMode="contain"
						style={tw.style("w-[27px] h-[27px]")}
					/>
				);
			case PaymentMethodType.Revolut:
				return (
					<FypSvg
						svg={RevolutSvg}
						width={18}
						height={23}
						color="fans-white"
					/>
				);
			default:
				return (
					<FypSvg
						svg={Bank2Svg}
						width={22}
						height={24}
						color="fans-white"
					/>
				);
		}
	};

	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			gap={12}
			padding={{ x: 18, y: 20 }}
			borderRadius={15}
			style={tw.style(
				"border border-fans-grey-de dark:border-fans-grey-50",
			)}
		>
			<FansView
				width={46}
				height={46}
				borderRadius={46}
				alignItems="center"
				justifyContent="center"
				style={tw.style({
					"bg-fans-blue-5e":
						paymentMethodType === PaymentMethodType.Bank,
					"bg-[#002d91]":
						paymentMethodType === PaymentMethodType.PayPal,
					"bg-[#232325]":
						paymentMethodType === PaymentMethodType.Payoneer,
					"bg-fans-black":
						paymentMethodType === PaymentMethodType.Revolut,
				})}
			>
				{getIcons()}
			</FansView>
			<FansView flex="1">
				<FypText
					fontSize={19}
					lineHeight={24}
					fontWeight={600}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{title}
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{paymentInformation}
				</FypText>
			</FansView>
			<FansView
				width={18}
				height={18}
				alignItems="center"
				justifyContent="center"
				pressableProps={{
					onPress: onClickDots,
				}}
			>
				<FypSvg
					svg={ThreeDotsSvg}
					width={18}
					height={18}
					color="fans-black dark:fans-white"
				/>
			</FansView>
		</FansView>
	);
};

export default PaymentMethod;
