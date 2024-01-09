import { PayPalSvg, ThreeDotsSvg, BankSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { FansText, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { PaymentMethodType } from "@usertypes/commonEnums";
import React, { FC } from "react";
import { View } from "react-native";

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
				return <BankSvg size={25} color="#fff" />;
			case PaymentMethodType.PayPal:
				return <PayPalSvg size={26.5} color="#fff" />;
			default:
				return <BankSvg size={25} color="#fff" />;
		}
	};

	return (
		<View style={tw.style("flex-row items-center")}>
			<View
				style={tw.style(
					"w-[46px] h-[46px] rounded-full items-center justify-center mr-3",
					{
						"bg-fans-purple":
							paymentMethodType === PaymentMethodType.Bank,
						"bg-[#002d91]":
							paymentMethodType === PaymentMethodType.PayPal,
					},
				)}
			>
				{getIcons()}
			</View>
			<View>
				<FansText
					fontSize={19}
					lineHeight={26}
					style={tw.style(
						"font-semibold",
						"text-fans-black dark:text-fans-white",
					)}
				>
					{title}
				</FansText>
				<FansText
					color="grey-70"
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"mt-[-3px]",
						"text-fans-grey-70 dark:text-fans-grey-b1",
					)}
				>
					{paymentInformation}
				</FansText>
			</View>
			<FansIconButton
				size={18}
				onPress={onClickDots}
				style={tw.style("ml-auto")}
			>
				<FypSvg
					svg={ThreeDotsSvg}
					width={18}
					height={18}
					color="fans-black dark:fans-white"
				/>
			</FansIconButton>
		</View>
	);
};

export default PaymentMethod;
