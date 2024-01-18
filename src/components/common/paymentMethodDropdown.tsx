import { ChevronDownSvg, PlusSvg, VisaSvg } from "@assets/svgs/common";
import { FypCollapsible, FypText, FypSvg } from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IPaymentMethod } from "@usertypes/types";
import React, { FC, useState } from "react";
import { ViewStyle, TextStyle } from "react-native";

interface Props {
	options: IPaymentMethod[];
	handleAddMethod: () => void;
	value: string;
	onChange: (
		customerPaymentProfileId: string,
		method: IPaymentMethod,
	) => void;
	style?: ViewStyle;
	textStyle?: TextStyle;
}

const PaymentMethodDropdown: FC<Props> = (props) => {
	const { handleAddMethod, value, onChange, options, style, textStyle } =
		props;
	const [closeDropdown, setCloseDropdown] = useState(true);

	const getPaymentMethod = () => {
		const selectedPayment = options.find(
			(el) => el.customerPaymentProfileId === value,
		);

		const label = `**** **** **** ${selectedPayment?.cardNumber.slice(-4)}`;
		switch (selectedPayment?.cardType) {
			case "Visa":
				return {
					icon: <VisaSvg width={34} height={34} />,
					label: label,
				};
			case "MasterCard":
				return {
					icon: <VisaSvg width={34} height={34} />,
					label: label,
				};
			case "AmericanExpress":
				return {
					icon: <VisaSvg width={34} height={34} />,
					label: label,
				};
			case "Discover":
				return {
					icon: <VisaSvg width={34} height={34} />,
					label: label,
				};
			default:
				return { icon: null, label: "Select card" };
		}
	};

	return (
		<FansView
			borderRadius={24}
			style={[
				tw.style(
					"border border-fans-dark-grey dark:border-fans-grey-b1",
				),
				style,
			]}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				padding={{ y: 4, l: 4, r: 18 }}
				height={42}
				pressableProps={{
					onPress: () => setCloseDropdown(!closeDropdown),
				}}
			>
				{getPaymentMethod().icon}
				<FypText
					fontSize={16}
					lineHeight={21}
					style={[tw.style("ml-2 mr-auto"), textStyle]}
				>
					{getPaymentMethod().label}
				</FypText>
				<FypSvg
					svg={ChevronDownSvg}
					width={14}
					height={8}
					color="fans-grey-70 dark:fans-grey-b1"
				/>
			</FansView>
			<FypCollapsible collapsed={closeDropdown}>
				<FansView padding={{ b: 20 }}>
					<FansDivider style={tw.style("h-[1px]")} />

					{options.map((option) => (
						<FansView
							key={option.id}
							flexDirection="row"
							alignItems="center"
							padding={{ x: 16, y: 8 }}
							pressableProps={{
								onPress: () => {
									onChange(
										option.customerPaymentProfileId,
										option,
									);
									setCloseDropdown(true);
								},
							}}
						>
							<VisaSvg width={22} height={22} />
							<FypText
								fontSize={16}
								lineHeight={21}
								margin={{ l: 8 }}
							>
								**** **** **** {option.cardNumber.slice(-4)}
							</FypText>
						</FansView>
					))}

					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ l: 16 }}
						height={38}
						style={tw.style("bg-fans-purple")}
						pressableProps={{
							onPress: handleAddMethod,
						}}
					>
						<FansView
							width={22}
							justifyContent="center"
							flexDirection="row"
						>
							<PlusSvg width={14} height={14} color="#fff" />
						</FansView>
						<FypText
							fontSize={18}
							lineHeight={24}
							margin={{ l: 8 }}
							style={tw.style("text-white")}
						>
							Add payment method
						</FypText>
					</FansView>
				</FansView>
			</FypCollapsible>
		</FansView>
	);
};

export default PaymentMethodDropdown;
