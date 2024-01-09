import { AddressSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import { RoundButtonType } from "@usertypes/commonEnums";
import React, { FC } from "react";

interface Props {
	location: string;
	onChangeLocation: (location: string) => void;
	onPressSave: () => void;
}

const LocationForm: FC<Props> = (props) => {
	const { onChangeLocation, onPressSave, location } = props;

	return (
		<FansView>
			<RoundTextInput
				icon={
					<FypSvg
						svg={AddressSvg}
						width={15}
						height={18}
						color="fans-black dark:fans-white"
					/>
				}
				value={location}
				onChangeText={onChangeLocation}
				maxLength={50}
			/>
			<FansView margin={{ t: 25 }}>
				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={onPressSave}
				>
					Save
				</RoundButton>
			</FansView>
		</FansView>
	);
};

export default LocationForm;
