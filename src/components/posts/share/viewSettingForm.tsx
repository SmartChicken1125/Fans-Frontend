import { LockSvg } from "@assets/svgs/common";
import { FypSvg, FypCollapsible, FypText } from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import { FansDivider, FansText, FansView } from "@components/controls";
import { SelectableUserListItem } from "@components/posts/common";
import tw from "@lib/tailwind";
import { SubscriptionTypes } from "@usertypes/commonEnums";
import {
	IRole,
	ISubscriptionTier,
	IPostFormViewType,
	IFansUser,
} from "@usertypes/types";
import React, { FC, Fragment, useState } from "react";
import FansUsersSearchForm from "./fansUsersSearchForm";
import ManageRolesForm from "./manageRolesForm";
import PaymentFansForm from "./paymentFansForm";

interface Props {
	roles: IRole[];
	viewType: IPostFormViewType;
	subscriptionType: SubscriptionTypes;
	onChangeViewType: (val: IPostFormViewType) => void;
	onCreateRole: () => void;
	onEditRole: (roleId: string) => void;
	onDeleteRole: (roleId: string) => void;
	onToggleRole: (roleId: string, val: boolean) => void;
	tiers: ISubscriptionTier[];
	tierIds: string[];
	onToggleTier: (tierId: string, val: boolean) => void;
	onCreateTier: () => void;
	fanUsers: IFansUser[];
	onRemoveFanUser: (userId: string) => void;
	onAddFanUsers: (users: IFansUser[]) => void;
}

const ViewSettingForm: FC<Props> = (props) => {
	const {
		onChangeViewType,
		onCreateRole,
		roles,
		viewType,
		onEditRole,
		onDeleteRole,
		onToggleRole,
		tiers,
		tierIds,
		onToggleTier,
		onCreateTier,
		fanUsers,
		onAddFanUsers,
		onRemoveFanUser,
		subscriptionType,
	} = props;

	const [showSearchForm, setShowSearchForm] = useState(false);

	return (
		<FansView>
			{showSearchForm ? (
				<FansUsersSearchForm
					handleSave={(users) => {
						setShowSearchForm(false);
						onAddFanUsers(users);
					}}
				/>
			) : null}
			{!showSearchForm && (
				<>
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"text-center mb-9",
							"text-fans-black dark:text-fans-white",
						)}
					>
						Choose who can see your post by selecting permissions
						and roles for specific fans
					</FansText>

					<FansView padding={{ y: 16 }}>
						<CustomRadio
							label="All subscribers"
							checked={viewType === "All"}
							onPress={() => onChangeViewType("All")}
						/>
					</FansView>

					<FansDivider />

					{subscriptionType === SubscriptionTypes.Tier ? (
						<Fragment>
							<FansView padding={{ y: 16 }}>
								<CustomRadio
									label="Payment tiers"
									checked={viewType === "PaymentTiers"}
									onPress={() =>
										onChangeViewType("PaymentTiers")
									}
								/>
							</FansView>
							<FansDivider />
						</Fragment>
					) : null}

					<FansView padding={{ b: 22 }}>
						<FansView
							padding={{ y: 16 }}
							flexDirection="row"
							alignItems="center"
						>
							<CustomRadio
								label="Exclusive (Loyal fans)"
								checked={viewType === "XPLevels"}
								onPress={() => onChangeViewType("XPLevels")}
							/>
							<FypSvg
								svg={LockSvg}
								width={13.46}
								height={17.57}
								style={tw.style("ml-[30px]")}
								color="fans-black dark:fans-white"
							/>
						</FansView>
						<FansText
							color="grey-70"
							fontSize={16}
							lineHeight={21}
							style={tw.style(
								"pl-10",
								"text-fans-black dark:text-fans-white",
							)}
						>
							Offer exclusive content to your loyal fans by
							selecting specific fan levels that can access the
							content
						</FansText>
					</FansView>

					<FansDivider />

					<FansView padding={{ y: 16 }}>
						<CustomRadio
							label="Specific fans"
							checked={viewType === "SpecificFans"}
							onPress={() => onChangeViewType("SpecificFans")}
						/>
					</FansView>

					<ManageRolesForm
						collapsed={viewType !== "XPLevels"}
						roles={roles}
						onEditRole={onEditRole}
						onDeleteRole={onDeleteRole}
						onToggleRole={onToggleRole}
						onCreateRole={onCreateRole}
					/>

					<PaymentFansForm
						tiers={tiers}
						tierIds={tierIds}
						onToggleTier={onToggleTier}
						collapsed={viewType !== "PaymentTiers"}
						onPressCreateTier={onCreateTier}
					/>

					<FypCollapsible collapsed={viewType !== "SpecificFans"}>
						<FansView>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								margin={{ b: 15 }}
							>
								Fans
							</FypText>
							<FansView
								height={42}
								borderRadius={42}
								flexDirection="row"
								alignItems="center"
								padding={{ l: 20 }}
								style={tw.style(
									"bg-fans-grey-f0 dark:bg-fans-grey-43",
								)}
								pressableProps={{
									onPress: () => setShowSearchForm(true),
								}}
							>
								<FypText
									fontSize={18}
									lineHeight={24}
									fontWeight={600}
								>
									Add:{" "}
									<FypText
										fontSize={18}
										lineHeight={24}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										Fan
									</FypText>
								</FypText>
							</FansView>

							<FansView>
								{fanUsers.map((user) => (
									<SelectableUserListItem
										key={user.id}
										avatar={user.avatar}
										username={user.username}
										displayName={user.displayName}
										onSelect={() =>
											onRemoveFanUser(user.id)
										}
										selected
									/>
								))}
							</FansView>
						</FansView>
					</FypCollapsible>
				</>
			)}
		</FansView>
	);
};

export default ViewSettingForm;
