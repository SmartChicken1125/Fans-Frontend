import { CloseSvg, StarCheckSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypSvg, FypText } from "@components/common/base";
import { FansIconButton, FansView } from "@components/controls";
import { hasFlags } from "@helper/Utils";
import tw from "@lib/tailwind";
import { IProfile, ProfileFlags } from "@usertypes/types";
import React, { FC } from "react";
import { Modal, useWindowDimensions } from "react-native";

interface Props {
	visible: boolean;
	onDismiss: () => void;
	profile?: IProfile;
}

const ProfilePictureDialog: FC<Props> = (props) => {
	const { visible, onDismiss, profile } = props;
	const { width: screenWidth } = useWindowDimensions();
	return (
		<Modal transparent visible={visible}>
			<FansView
				width="screen"
				height="screen"
				style={tw.style("bg-fans-black/75")}
			>
				<FansView width="full" height="full" position="relative">
					<FansView
						flexDirection="row"
						alignItems="center"
						justifyContent="between"
						style={tw.style(
							"px-[18px] md:px-[140px] pt-4 md:pt-[58px]",
						)}
					>
						<FansView flexDirection="row" alignItems="center">
							<UserAvatar size="46px" image={profile?.avatar} />
							<FypText
								fontSize={{ xs: 16, md: 19 }}
								lineHeight={{ xs: 21, md: 26 }}
								style={[
									tw.style(
										"font-semibold md:font-bold text-fans-white",
										"mr-[14px] md:mr-3",
										"ml-3 md:ml-4",
									),
									{
										maxWidth: screenWidth / 2,
									},
								]}
								numberOfLines={1}
							>
								{profile?.displayName}
							</FypText>
							{hasFlags(
								profile?.flags ?? 0,
								ProfileFlags.VERIFIED,
							) && <StarCheckSvg width={16} height={16} />}
						</FansView>
						<FansIconButton
							size={tw.prefixMatch("md") ? 30 : 25}
							backgroundColor="bg-fans-grey-70 md:bg-fans-white"
							onPress={onDismiss}
						>
							<FypSvg
								svg={CloseSvg}
								width={{ xs: 10, md: 12 }}
								height={{ xs: 10, md: 12 }}
								color={
									tw.prefixMatch("md")
										? "fans-black"
										: "fans-white"
								}
							/>
						</FansIconButton>
					</FansView>
					<FansView
						position="absolute"
						style={[
							tw.style("top-1/2 left-1/2"),
							{
								transform: [
									{
										translateX: tw.prefixMatch("md")
											? -288
											: -149,
									},
									{
										translateY: tw.prefixMatch("md")
											? -288
											: -149,
									},
								],
							},
						]}
					>
						<UserAvatar
							size={tw.prefixMatch("md") ? "576px" : "298px"}
							image={profile?.avatar}
						/>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

export default ProfilePictureDialog;
