import { IFansGap } from "@usertypes/components";
import React from "react";
import { FansView } from "./View";

export const FansGap: IFansGap = (props) => {
	const { width, height, grow, viewStyle } = props;

	return (
		<FansView width={width} height={height} grow={grow} {...viewStyle} />
	);
};
