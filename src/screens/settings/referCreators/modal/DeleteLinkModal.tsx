import { CloseSvg, Warning2Svg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import {
	FansButton,
	FansButton3,
	FansGap,
	FansHorizontalDivider,
	FansText,
	FansView,
} from "@components/controls";
import { FansModal3 } from "@components/controls/Modal";
import tw from "@lib/tailwind";
import { IFansModal } from "@usertypes/components";
import React, { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

const DeleteLinkModal: IFansModal = (props) => {
	const { visible, onClose, onSubmit, ...props_ } = props;

	const handlePressCancel = () => onClose();
	const handlePressDelete = () => onSubmit(undefined);

	return (
		<FansModal3 {...props}>
			<View
				style={tw.style(
					"absolute right-[15px] top-[15px] md:flex w-7.5 h-7.5",
				)}
			>
				<IconButton
					icon={() => <CloseSvg size={13.2} color="#fff" />}
					containerColor="rgba(0,0,0,0.3)"
					style={tw.style("m-0 w-7.5 h-7.5 ")}
					onPress={onClose}
				/>
			</View>

			<FansView
				style={tw.style("flex items-center", "mx-[20px] my-[15px]")}
			>
				<FypSvg
					color="fans-red"
					width={77}
					height={69}
					svg={Warning2Svg}
				/>
				<FansGap height={22} />
				<FansHorizontalDivider width={{ lg: 358, xs: "full" }} />
				<FansGap height={18} />
				<FansText style={tw.style("font-inter-bold", "text-[23px]")}>
					Warning
				</FansText>
				<FansGap height={18} />
				<FansText
					style={tw.style("text-[16px] text-center leading-[21px]")}
				>
					Removing this link will stop all{"\n"}
					future incoming revenue
				</FansText>
				<FansGap height={{ lg: 34.5, xs: 25 }} />
				<FansView
					style={tw.style(
						"w-full h-[42px]",
						"flex-row gap-[14px] justify-between",
					)}
				>
					<FansButton3
						buttonStyle={{
							backgroundColor: "white",
							borderColor: "red-eb",
						}}
						textStyle1={{
							color: "red-eb",
						}}
						title="Cancel"
						onPress={handlePressCancel}
						height={42}
						style={tw.style("px-[0] flex-1")}
					/>

					<FansButton
						title="Delete"
						colorFans="fans-red"
						onPress={handlePressDelete}
						style={{ flex: 1, height: 42 }}
						containerStyle={tw.style("text-19px")}
					/>
					{/* </FansView> */}
				</FansView>
			</FansView>
		</FansModal3>
	);
};

export default DeleteLinkModal;
