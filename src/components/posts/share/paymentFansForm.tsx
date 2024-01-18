import UserAvatar from "@components/avatar/UserAvatar";
import { FypText, FypSwitch, FypCollapsible } from "@components/common/base";
import { FansView, FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import { ISubscriptionTier } from "@usertypes/types";
import React, { FC, Fragment } from "react";

interface Props {
	collapsed: boolean;
	tiers: ISubscriptionTier[];
	tierIds: string[];
	onToggleTier: (tierId: string, val: boolean) => void;
	onPressCreateTier: () => void;
}

const PaymentFansForm: FC<Props> = (props) => {
	const { collapsed, tiers, tierIds, onToggleTier, onPressCreateTier } =
		props;
	return (
		<FypCollapsible collapsed={collapsed}>
			<FansView>
				<FypText
					fontSize={17}
					fontWeight={600}
					lineHeight={22}
					margin={{ b: 12 }}
				>
					Tiers
				</FypText>
				<FansView>
					{tiers.map((tier, index) => (
						<Fragment key={tier.id}>
							<FansView
								flexDirection="row"
								alignItems="center"
								justifyContent="between"
								padding={{ y: 16 }}
							>
								<FansView
									flexDirection="row"
									gap={13}
									alignItems="center"
									flex="1"
								>
									<UserAvatar
										size="46px"
										image={tier.cover}
									/>
									<FansView flex="1">
										<FypText
											fontSize={19}
											fontWeight={600}
											lineHeight={26}
											numberOfLines={1}
										>
											{tier.title}
										</FypText>
										<FypText
											fontSize={16}
											lineHeight={21}
											margin={{ t: -3 }}
											numberOfLines={1}
											style={tw.style(
												"text-fans-grey-70 dark:text-fans-grey-b1",
											)}
										>
											{tier.description}
										</FypText>
									</FansView>
								</FansView>
								<FansView
									flexDirection="row"
									alignItems="center"
									gap={14}
								>
									<FypText
										fontSize={16}
										fontWeight={500}
										lineHeight={21}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										{`$${tier.price}/month`}
									</FypText>
									<FypSwitch
										value={tierIds.includes(tier.id)}
										onValueChange={(val) =>
											onToggleTier(tier.id, val)
										}
									/>
								</FansView>
							</FansView>
							{index !== tiers.length - 1 && <FansDivider />}
						</Fragment>
					))}
				</FansView>

				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					height={42}
					borderRadius={42}
					margin={{ t: 12 }}
					style={tw.style("border border-fans-purple")}
					pressableProps={{
						onPress: onPressCreateTier,
					}}
				>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						style={tw.style("text-fans-purple")}
					>
						Create tier
					</FypText>
				</FansView>
			</FansView>
		</FypCollapsible>
	);
};

export default PaymentFansForm;
