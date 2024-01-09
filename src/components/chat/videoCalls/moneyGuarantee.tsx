import {
	SuccessImage,
	Money1Image,
	Money2Image,
	Money3Image,
	Money4Image,
	Money5Image,
} from "@assets/svgs/images";
import { FypSvg, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React from "react";

const MoneyGuarantee = () => {
	return (
		<FansView
			borderRadius={15}
			padding={{ x: 18, t: 20, b: 14 }}
			style={tw.style(
				"border border-fans-grey-de dark:border-fans-grey-50",
			)}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				gap={14}
				margin={{ b: 16 }}
			>
				<FypSvg svg={SuccessImage} width={32} height={30} />
				<FypText fontSize={19} lineHeight={26} fontWeight={600}>
					Money back guarantee
				</FypText>
			</FansView>
			<FypText
				fontSize={16}
				margin={{ b: 30 }}
				style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
			>
				When you pay on the web using a card for a video call, we
				authorize the amount when you schedule the call, but your card
				is only charged once the call has been accepted
			</FypText>
			<FypText
				fontSize={16}
				margin={{ b: 25 }}
				style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
			>
				If you schedule a video call on the web using an alternate
				payment method, rest assured that we will always issue a full
				refund if the creator doesn’t respond or attend the scheduled
				call
			</FypText>
			<FansView flexDirection="row" justifyContent="between" gap={7}>
				<FansView
					flex="1"
					height={40}
					borderRadius={5}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border border-fans-grey-de dark:border-fans-grey-50",
					)}
				>
					<FypSvg svg={Money1Image} width={30} height={24} />
				</FansView>
				<FansView
					flex="1"
					height={40}
					borderRadius={5}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border border-fans-grey-de dark:border-fans-grey-50",
					)}
				>
					<FypSvg svg={Money2Image} width={41} height={13} />
				</FansView>
				<FansView
					flex="1"
					height={40}
					borderRadius={5}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border border-fans-grey-de dark:border-fans-grey-50",
					)}
				>
					<FypSvg svg={Money3Image} width={37} height={23} />
				</FansView>
				<FansView
					flex="1"
					height={40}
					borderRadius={5}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border border-fans-grey-de dark:border-fans-grey-50",
					)}
				>
					<FypSvg svg={Money4Image} width={19} height={23} />
				</FansView>
				<FansView
					flex="1"
					height={40}
					borderRadius={5}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border border-fans-grey-de dark:border-fans-grey-50",
					)}
				>
					<FypSvg svg={Money5Image} width={50} height={9} />
				</FansView>
			</FansView>
		</FansView>
	);
};

export default MoneyGuarantee;
