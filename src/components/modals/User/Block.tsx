import UserAvatar from "@components/avatar/UserAvatar";
import {
	FansButton3,
	FansGap,
	FansHorizontalDivider,
	FansModal1,
	FansModal2,
	FansText,
	FansView,
} from "@components/controls";
import { FansModalProps, IFansModal } from "@usertypes/components";
import { IUser } from "@usertypes/types";
import React, { FC } from "react";

interface Props extends FansModalProps {
	user: IUser;
}

const BlockModal: FC<Props> = (props) => {
	const { user, onClose: handleClose, onSubmit: trigSubmit } = props;

	const handlePressConfirm = () => trigSubmit("");

	return (
		<FansModal2
			modalStyle={{
				alignItems: "center",
				padding: { x: 17, t: 26, b: 17 },
			}}
			{...props}
		>
			<UserAvatar size="86px" />
			<FansGap height={28} />
			<FansView maxWidth={230}>
				<FansText
					fontFamily="inter-bold"
					fontSize={21}
					textAlign="center"
				>
					Are you sure you want to block {user.displayName}?
				</FansText>
			</FansView>
			<FansGap height={19} />
			<FansView maxWidth={317}>
				<FansText fontSize={16} textAlign="center">
					Blocking will remove your subscription, remove access to
					their profile, and not let them interact with you
				</FansText>
			</FansView>
			<FansGap height={24} />
			<FansView alignSelf="stretch" flexDirection="row" gap={14}>
				<FansButton3
					title="Cancel"
					buttonStyle={{
						backgroundColor: "white",
						borderColor: "red-eb",
						flex: "1",
					}}
					textStyle1={{ color: "red-eb" }}
					onPress={handleClose}
				>
					Cancel
				</FansButton3>
				<FansButton3
					title="Confirm"
					buttonStyle={{
						backgroundColor: "red-eb",
						borderColor: "red-eb",
						flex: "1",
					}}
					onPress={handlePressConfirm}
				/>
			</FansView>
		</FansModal2>
	);
};

export default BlockModal;
