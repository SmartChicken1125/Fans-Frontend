import UserAvatar from "@components/avatar/UserAvatar";
import {
	FansButton3,
	FansGap,
	FansModal2,
	FansText,
	FansView,
} from "@components/controls";
import { FansModalProps } from "@usertypes/components";
import { IUser } from "@usertypes/types";
import React, { FC } from "react";

interface Props extends FansModalProps {
	user: IUser;
}

const UnblockModal: FC<Props> = (props) => {
	const { user, onClose: handleClose, onSubmit: trigSubmit } = props;

	const handlePressConfirm = () => trigSubmit("");

	return (
		<FansModal2
			width={{ md: 433 }}
			height={{ md: 370 }}
			modalStyle={{
				alignItems: "center",
				padding: {
					xs: { x: 17, t: 26, b: 17 },
					md: { x: 34.5, t: 26, b: 33.5 },
				},
			}}
			{...props}
		>
			<UserAvatar size="86px" />
			<FansGap height={22} />
			<FansView maxWidth={230}>
				<FansText
					fontFamily="inter-bold"
					fontSize={21}
					textAlign="center"
				>
					Are you sure you want to unblock {user.displayName}?
				</FansText>
			</FansView>
			<FansGap height={20} />
			<FansView maxWidth={317}>
				<FansText fontSize={16} textAlign="center">
					If in immediate danger contact local authorities. In lower
					risk situations contact{" "}
					<FansText color="purple-a8" fontFamily="inter-semibold">
						support@fyp.fans
					</FansText>
				</FansText>
			</FansView>
			<FansGap height={28} />
			<FansView alignSelf="stretch" flexDirection="row" gap={14}>
				<FansButton3
					title="Cancel"
					buttonStyle={{
						backgroundColor: "white",
						flex: "1",
					}}
					textStyle1={{ color: "purple-a8" }}
					onPress={handleClose}
				>
					Cancel
				</FansButton3>
				<FansButton3
					title="Confirm"
					buttonStyle={{
						flex: "1",
					}}
					onPress={handlePressConfirm}
				/>
			</FansView>
		</FansModal2>
	);
};

export default UnblockModal;
