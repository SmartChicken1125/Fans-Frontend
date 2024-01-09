import { CloseSvg, DocumentEditSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { FansText, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { IUploadForm } from "@usertypes/types";
import React, { FC } from "react";
import { View } from "react-native";

interface Props {
	data: IUploadForm;
	onDelete: () => void;
}

const UploadDocument: FC<Props> = (props) => {
	const { data, onDelete } = props;
	return (
		<View
			style={tw.style(
				"relative border p-[17px] rounded-[7px] flex-row items-center",
				"border-fans-grey dark:border-fans-grey-43",
			)}
		>
			<View
				style={tw.style(
					"w-[77px] h-[77px] flex-row items-center justify-center rounded-full",
					"bg-fans-purple-f6 dark:bg-fans-purple-47",
				)}
			>
				<DocumentEditSvg width={31.3} height={35} />
			</View>

			<View style={tw.style("ml-[22px] flex-1")}>
				<FansText
					fontSize={17}
					lineHeight={22}
					style={tw.style(
						"font-semibold text-fans-black dark:text-fans-white",
					)}
				>
					{data.origin}
				</FansText>
			</View>
			<FansIconButton
				size={24}
				onPress={onDelete}
				style={tw.style("absolute top-[7px] right-[7px]")}
			>
				<FypSvg
					svg={CloseSvg}
					width={11}
					height={11}
					color="fans-grey-70 dark:fans-grey-b1"
				/>
			</FansIconButton>
		</View>
	);
};

export default UploadDocument;
