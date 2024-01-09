import { LockSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import { FansDivider, FansText, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IRole } from "@usertypes/types";
import React, { FC } from "react";
import ManageRolesForm from "./manageRolesForm";

interface Props {
	roles: IRole[];
	isAll: boolean;
	onClickAllSubscribers: (val: boolean) => void;
	onCreateRole: () => void;
	onEditRole: (roleId: string) => void;
	onDeleteRole: (roleId: string) => void;
	onToggleRole: (roleId: string, val: boolean) => void;
}

const ViewSettingForm: FC<Props> = (props) => {
	const {
		onClickAllSubscribers,
		onCreateRole,
		roles,
		isAll,
		onEditRole,
		onDeleteRole,
		onToggleRole,
	} = props;

	return (
		<FansView>
			<FansText
				fontSize={16}
				lineHeight={21}
				style={tw.style(
					"text-center mb-9",
					"text-fans-black dark:text-fans-white",
				)}
			>
				Choose who can see your post by selecting permissions and roles
				for specific fans
			</FansText>

			<FansView padding={{ y: 16 }}>
				<CustomRadio
					label="All subscribers"
					checked={isAll}
					onPress={() => onClickAllSubscribers(true)}
				/>
			</FansView>

			<FansDivider />

			<FansView padding={{ b: 22 }}>
				<FansView
					padding={{ y: 16 }}
					flexDirection="row"
					alignItems="center"
				>
					<CustomRadio
						label="Exclusive (Loyal fans)"
						checked={!isAll}
						onPress={() => onClickAllSubscribers(false)}
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
					Offer exclusive content to your loyal fans by selecting
					specific fan levels that can access the content
				</FansText>
			</FansView>

			<ManageRolesForm
				collapsed={isAll}
				roles={roles}
				onEditRole={onEditRole}
				onDeleteRole={onDeleteRole}
				onToggleRole={onToggleRole}
				onCreateRole={onCreateRole}
			/>
		</FansView>
	);
};

export default ViewSettingForm;
