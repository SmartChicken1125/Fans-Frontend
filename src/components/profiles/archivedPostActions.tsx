import { TrashSvg, ArchivedPostSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { MenuItem } from "@components/posts/common";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	open: boolean;
	onClose: () => void;
	onClickUnarchive: () => void;
	onClickDelete: () => void;
	tab: "post" | "story";
}

const ArchivedPostActions: FC<Props> = (props) => {
	const { open, onClose, onClickUnarchive, onClickDelete, tab } = props;

	return (
		<BottomSheetWrapper
			open={open}
			onClose={() => {
				onClose();
			}}
		>
			<View>
				<MenuItem
					title={
						tab === "post" ? "Unarchive post" : "Unarchive story"
					}
					icon={
						<FypSvg
							svg={ArchivedPostSvg}
							width={22.87}
							height={23}
							color="fans-black dark:fans-white"
						/>
					}
					onPress={onClickUnarchive}
				/>

				<MenuItem
					title="Delete"
					icon={<TrashSvg width={18.5} height={23} color="#eb2121" />}
					labelClass="text-[#eb2121]"
					onPress={onClickDelete}
				/>
			</View>
		</BottomSheetWrapper>
	);
};

export default ArchivedPostActions;
