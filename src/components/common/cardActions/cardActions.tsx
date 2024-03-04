import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import tw from "@lib/tailwind";
import { ICardAction } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";
import MenuItem from "./menuItem";

interface Props {
	open: boolean;
	onClose: () => void;
	actions: ICardAction[];
}

const CardActions: FC<Props> = (props) => {
	const { open, onClose, actions } = props;

	return (
		<BottomSheetWrapper open={open} onClose={onClose}>
			<View style={tw.style("pb-10 lg:pb-0")}>
				{actions
					.filter((el) => !el.hide)
					.map((action) => (
						<MenuItem key={action.title} data={action} />
					))}
			</View>
		</BottomSheetWrapper>
	);
};

export default CardActions;
