import { CloseSvg, RoundedPlusSvg } from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import { roleIcons } from "@constants/common";
import { cdnURL } from "@helper/Utils";
import { getFansUsers } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import {
	ISubscriptionTier,
	IRole,
	IFansUser,
	IPostForm,
	IPaidPostAccessForm,
} from "@usertypes/types";
import React, { FC, useEffect, useState } from "react";
import { Image } from "react-native";

interface AccessItemProps {
	selected: boolean;
	title: string;
	subTitle: string;
	image: string;
	role?: IRole;
	handleSelect: (val: boolean) => void;
}

export const AccessItem: FC<AccessItemProps> = (props) => {
	const { selected, title, subTitle, handleSelect, image, role } = props;
	const getIcon = () => {
		if (!!role && roleIcons.map((el) => el.name).includes(image)) {
			const icon = roleIcons.find((el) => el.name === image);
			return (
				<FansView
					width={46}
					height={46}
					borderRadius={46}
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					position="relative"
				>
					<Image
						source={icon?.icon}
						style={{
							width: icon?.width ?? 0,
							height: icon?.height ?? 0,
						}}
					/>
					<FansView
						style={{
							width: 46,
							height: 46,
							borderRadius: 46,
							backgroundColor: role.color,
							opacity: 0.15,
							position: "absolute",
							top: 0,
							left: 0,
						}}
					></FansView>
				</FansView>
			);
		} else {
			return (
				<Image
					source={{ uri: cdnURL(image) }}
					style={tw.style("w-[46px] h-[46px] rounded-full")}
				/>
			);
		}
	};
	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			height={78}
			gap={22}
			style={tw.style(
				"border-b border-fans-grey dark:border-fans-grey-43",
			)}
			pressableProps={{
				onPress: () => handleSelect(!selected),
			}}
		>
			<FansView
				width={25}
				height={25}
				alignItems="center"
				justifyContent="center"
				borderRadius={25}
				style={tw.style(selected && "bg-fans-black dark:bg-fans-white")}
			>
				{selected ? (
					<FypSvg
						svg={CloseSvg}
						width={10}
						height={10}
						color="fans-white dark:fans-black-1d"
					/>
				) : (
					<FypSvg
						svg={RoundedPlusSvg}
						width={25}
						height={25}
						color="fans-grey-70 dark:fans-grey-b1"
					/>
				)}
			</FansView>
			<FansView flex="1" flexDirection="row" alignItems="center" gap={13}>
				<FansView width={46} height={46}>
					{getIcon()}
				</FansView>
				<FansView flex="1">
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={600}
						numberOfLines={1}
					>
						{title}
					</FypText>
					<FypText
						fontSize={16}
						margin={{ t: -3 }}
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1",
						)}
					>
						{subTitle}
					</FypText>
				</FansView>
			</FansView>
		</FansView>
	);
};

interface Props {
	postForm: IPostForm;
	tiers: ISubscriptionTier[];
	roles: IRole[];
	handleSave: (paidPostAccess: IPaidPostAccessForm) => void;
}

const PaidPostAccessForm: FC<Props> = (props) => {
	const { tiers, roles, handleSave, postForm } = props;

	const [fanUsers, setFanUsers] = useState<IFansUser[]>([]);
	const [acccessRoles, setAccessRoles] = useState<string[]>([]);
	const [accessTiers, setAccessTiers] = useState<string[]>([]);
	const [accessFans, setAccessFans] = useState<string[]>([]);
	const [selectedNames, setSelectedNames] = useState("");

	const fetchFanUsers = async () => {
		const resp = await getFansUsers();
		if (resp.ok) {
			setFanUsers(resp.data.fans);
		}
	};

	const handleToggleTier = (tierId: string) => {
		setAccessTiers(
			accessTiers.includes(tierId)
				? accessTiers.filter((el) => el !== tierId)
				: [...accessTiers, tierId],
		);
	};

	const handleToggleRole = (roleId: string) => {
		setAccessRoles(
			acccessRoles.includes(roleId)
				? acccessRoles.filter((el) => el !== roleId)
				: [...acccessRoles, roleId],
		);
	};

	const handleToggleFansUser = (userId: string) => {
		setAccessFans(
			accessFans.includes(userId)
				? accessFans.filter((el) => el !== userId)
				: [...accessFans, userId],
		);
	};

	const handlePressCancel = () => {
		handleSave({
			roleIds: acccessRoles,
			tierIds: accessTiers,
			fanUsers: fanUsers.filter((user) => accessFans.includes(user.id)),
		});
	};

	useEffect(() => {
		fetchFanUsers();
	}, []);

	useEffect(() => {
		setAccessRoles(postForm.paidPostAccess.roleIds);
		setAccessTiers(postForm.paidPostAccess.tierIds);
		setAccessFans(postForm.paidPostAccess.fanUsers.map((user) => user.id));
	}, [postForm.paidPostAccess]);

	useEffect(() => {
		const _roles = roles
			.filter((role) => acccessRoles.includes(role.id))
			.map((el) => el.name);
		const _users = fanUsers
			.filter((user) => accessFans.includes(user.id))
			.map((el) => el.displayName);
		const _tiers = tiers
			.filter((tier) => accessTiers.includes(tier.id))
			.map((el) => el.title);
		setSelectedNames([..._roles, ..._users, ..._tiers].join(", "));
	}, [acccessRoles, accessTiers, accessFans]);

	return (
		<FansView>
			<FansView
				flexDirection="row"
				alignItems="center"
				gap={24}
				margin={{ b: 32 }}
			>
				<FansView
					position="relative"
					flex="1"
					padding={{ x: 20, y: 9 }}
					height={42}
					borderRadius={42}
					style={tw.style("bg-fans-grey-f0 dark:bg-fans-grey-43")}
				>
					<FypText
						fontSize={18}
						fontWeight={600}
						lineHeight={24}
						numberOfLines={1}
					>
						{`Add: ${selectedNames}`}
					</FypText>
				</FansView>
				<FypText
					fontSize={17}
					lineHeight={22}
					onPress={handlePressCancel}
				>
					Done
				</FypText>
			</FansView>
			<FansView margin={{ b: 13 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 15 }}
				>
					Tiers
				</FypText>
				<FansView>
					{tiers.map((tier) => (
						<AccessItem
							key={tier.id}
							selected={accessTiers.includes(tier.id)}
							title={tier.title}
							subTitle="0 fans"
							image={tier.cover}
							handleSelect={() => handleToggleTier(tier.id)}
						/>
					))}
				</FansView>
			</FansView>
			<FansView margin={{ b: 13 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 15 }}
				>
					Roles
				</FypText>
				<FansView>
					{roles.map((role) => (
						<AccessItem
							key={role.id}
							selected={acccessRoles.includes(role.id)}
							title={role.name}
							subTitle={`${role.fans} fans`}
							image={role.icon}
							role={role}
							handleSelect={() => handleToggleRole(role.id)}
						/>
					))}
				</FansView>
			</FansView>
			<FansView margin={{ b: 13 }}>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					margin={{ b: 15 }}
				>
					Members
				</FypText>
				<FansView>
					{fanUsers.map((user) => (
						<AccessItem
							key={user.id}
							selected={accessFans.includes(user.id)}
							title={user.displayName ?? ""}
							subTitle={user.username}
							image={user.avatar ?? ""}
							handleSelect={() => handleToggleFansUser(user.id)}
						/>
					))}
				</FansView>
			</FansView>
		</FansView>
	);
};

export default PaidPostAccessForm;
