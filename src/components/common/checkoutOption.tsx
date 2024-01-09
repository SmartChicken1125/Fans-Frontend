import { PayPalSvg, StripeSvg, CreditCardSvg } from "@assets/svgs/common";
import tw from "@lib/tailwind";
import { CheckoutType } from "@usertypes/commonEnums";
import { ICheckoutOption } from "@usertypes/types";
import React, { FC } from "react";
import { View, Pressable } from "react-native";
import { FypText } from "./base";

interface Props {
	selected: boolean;
	onSelect: () => void;
	data: ICheckoutOption;
}

const CheckoutOption: FC<Props> = (props) => {
	const { selected, onSelect, data } = props;

	const getIcons = () => {
		switch (data.type) {
			case CheckoutType.PayPal:
				return <PayPalSvg width={23.17} height={26.5} color="#fff" />;
			case CheckoutType.Stripe:
				return <StripeSvg width={18} height={25.38} color="#fff" />;
			case CheckoutType.CreditCard:
				return (
					<CreditCardSvg width={26.6} height={19.5} color="#fff" />
				);
			default:
				return null;
		}
	};

	return (
		<Pressable
			style={tw.style(
				"h-[108px] border border-fans-grey rounded-[7px] justify-center flex-1 items-center relative",
				selected && "border-transparent",
			)}
			onPress={onSelect}
		>
			<View
				style={tw.style(
					"w-[46px] h-[46px] flex-row items-center justify-center rounded-full",
					data.type === CheckoutType.CreditCard && "bg-fans-purple",
					data.type === CheckoutType.Stripe && "bg-[#665bff]",
					data.type === CheckoutType.PayPal && "bg-[#002d91]",
				)}
			>
				{getIcons()}
			</View>
			<FypText
				fontSize={16}
				lineHeight={21}
				fontWeight={500}
				margin={{ t: 8 }}
			>
				{data.name}
			</FypText>
			{selected ? (
				<View
					style={tw.style(
						"w-full h-full absolute top-0 left-0 rounded-[7px] border-[2px]",
						data.type === CheckoutType.CreditCard &&
							"border-fans-purple",
						data.type === CheckoutType.Stripe && "border-[#665bff]",
						data.type === CheckoutType.PayPal && "border-[#002d91]",
					)}
				></View>
			) : null}
		</Pressable>
	);
};

export default CheckoutOption;
