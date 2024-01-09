// Step1.tsx
import { FansGap, FansText, FansView } from "@components/controls";
import React from "react";
import { View } from "react-native";
import PricesForm from "./pricesForm";

const PriceDurationStep = () => (
	<View>
		<FansView>
			<FansView>
				<FansGap height={27} />
				<FansText
					textAlign="center"
					fontFamily="inter-semibold"
					fontSize={27}
				>
					Pricing & duration
				</FansText>
				<FansGap height={12} />
				<FansText textAlign="center" fontSize={16}>
					Set your price for different video durations. Higher
					duration videos should be more expensive
				</FansText>
			</FansView>
			<FansGap height={42} />
		</FansView>
		<FansView>
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Prices
			</FansText>
			<FansGap height={12} />
			<FansText color="grey-70" fontSize={16}>
				Create prices for different video call durations. Provide up to
				10 time options for fans to buy
			</FansText>
		</FansView>
		<FansGap height={24.5} />
		<FansView>
			<PricesForm />
		</FansView>
		<FansGap height={180} />
	</View>
);

export default PriceDurationStep;
