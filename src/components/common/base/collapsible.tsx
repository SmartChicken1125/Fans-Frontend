import React, { FC } from "react";
import Collapsible, { CollapsibleProps } from "react-native-collapsible";

export const FypCollapsible: FC<CollapsibleProps> = (props) => {
	return <Collapsible {...props} />;
};
