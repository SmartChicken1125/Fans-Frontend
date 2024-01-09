import SwitchInput from "@components/common/switchInput";
import { FansView } from "@components/controls";
import { IPostAdvanced } from "@usertypes/types";
import React, { FC } from "react";

interface Props {
	data: IPostAdvanced;
	onChange: (name: string, val: boolean) => void;
}

const AdvancedSettingsForm: FC<Props> = (props) => {
	const { data, onChange } = props;

	return (
		<FansView gap={4}>
			<SwitchInput
				label="Hide like and view counts on post"
				value={data.isHideLikeViewCount}
				onChange={(val) => onChange("isHideLikeViewCount", val)}
			/>

			<SwitchInput
				label="Turn off commenting"
				value={data.isTurnOffComment}
				onChange={(val) => onChange("isTurnOffComment", val)}
			/>

			<SwitchInput
				label="Add paid ad label/disclaimer"
				value={data.isPaidLabelDisclaimer}
				onChange={(val) => onChange("isPaidLabelDisclaimer", val)}
			/>
		</FansView>
	);
};

export default AdvancedSettingsForm;
