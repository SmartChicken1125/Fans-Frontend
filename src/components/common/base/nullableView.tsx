import React, { FC } from "react";

interface Props {
	visible: boolean;
	children: React.ReactNode;
}

export const FypNullableView: FC<Props> = (props) => {
	const { visible, children } = props;
	return visible ? children : null;
};
