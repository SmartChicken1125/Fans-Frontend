import { CloseSvg, ReportSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypModal,
	FypSvg,
	FypLinearGradientView,
	FypText,
	FypButton2,
} from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { IProfile, IVideoCallMeeting } from "@usertypes/types";
import React, { FC } from "react";

interface Props {
	visible: boolean;
	profile: IProfile;
	meeting?: IVideoCallMeeting;
	handleClose: () => void;
	handleConfirm: () => void;
}

const ConfirmCancelOrderModal: FC<Props> = (props) => {
	const { visible, handleClose, handleConfirm, profile, meeting } = props;

	const attendant = meeting?.attendees
		? meeting.attendees.find((el) => el.id !== profile.userId)
		: null;

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 600 }}
		>
			<FansView position="relative" padding={{ x: 18, t: 26, b: 15 }}>
				<FansIconButton
					size={25}
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					style={tw.style("absolute top-[13px] right-[13px]")}
					onPress={handleClose}
				>
					<CloseSvg size={10} color="#fff" />
				</FansIconButton>
				<FansView
					width={86}
					height={86}
					position="relative"
					margin={{ b: 25 }}
					style={tw.style("mx-auto p-1")}
				>
					<UserAvatar size="78px" image={attendant?.avatar} />
					<FansView
						width={42}
						height={42}
						borderRadius={42}
						position="absolute"
						style={tw.style(
							"border-[4px] border-fans-white bg-fans-red dark:border-fans-black-1d",
							"right-[-4px] bottom-[-10.5px]",
						)}
					>
						<FypLinearGradientView
							colors={["#E53EC6", "#EB2121", "#F98C28"]}
							start={[0, 1]}
							end={[1, 0]}
							width={34}
							height={34}
							borderRadius={42}
							alignItems="center"
							justifyContent="center"
						>
							<FypSvg
								svg={ReportSvg}
								width={18}
								height={16}
								color="fans-white"
							/>
						</FypLinearGradientView>
					</FansView>
				</FansView>
				{attendant ? (
					<FypText
						fontSize={21}
						fontWeight={700}
						lineHeight={28}
						margin={{ b: 16 }}
						textAlign="center"
					>
						{`Confirm cancellation of ${attendant.displayName}'s order'`}
					</FypText>
				) : null}

				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ b: 26 }}
					textAlign="center"
				>
					A full refund of {`$${meeting?.price.amount}`} will be
					issued. Note: Frequent cancellations may lead to removal of
					this feature from your creator account
				</FypText>
				<FypButton2
					style={tw.style("bg-fans-red")}
					textStyle={tw.style("text-fans-white")}
					pressableProps={{
						onPress: handleConfirm,
					}}
				>
					Confirm
				</FypButton2>
				<FypButton2
					textStyle={tw.style("text-fans-black dark:text-fans-white")}
					pressableProps={{
						onPress: handleClose,
					}}
				>
					Go back
				</FypButton2>
			</FansView>
		</FypModal>
	);
};

export default ConfirmCancelOrderModal;
