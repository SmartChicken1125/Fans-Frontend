import { DocumentImage } from "@assets/svgs/images";
import RoundButton from "@components/common/RoundButton";
import {
	FypModal,
	FypLink,
	FypCheckbox,
	FypText,
	FypSvg,
} from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { useBlankLink } from "@utils/useBlankLink";
import { createURL } from "expo-linking";
import React, { FC, useState } from "react";

interface Props {
	open: boolean;
	handleClose: () => void;
	handleAgree: (value: boolean) => void;
}

const SexualPolicyModal: FC<Props> = (props) => {
	const { open, handleClose, handleAgree } = props;
	const [openLink] = useBlankLink();

	const [isAgree, setIsAgree] = useState(false);

	const handlePressTerms = () => {
		const url = createURL(`/terms`);
		openLink(url);
	};

	return (
		<FypModal
			visible={open}
			onDismiss={handleClose}
			width={{ xs: "full", md: 740 }}
			maxWidth={740}
		>
			<FansView position="relative" padding={{ x: 18, t: 22, b: 26 }}>
				<FansView alignItems="center" margin={{ b: 15 }}>
					<FypSvg svg={DocumentImage} width={78} height={90} />
				</FansView>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					textAlign="center"
					margin={{ b: 20 }}
				>
					Sexual Content Policy Agreement
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					margin={{ b: 24 }}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					As a creator on our platform, you’re accountable for
					ensuring your content respects our community and adheres to
					all local and international laws. Producing or disseminating
					sexual content involving misrepresentation, non-consent, or
					minors is strictly prohibited, will result in immediate
					suspension, and reporting to law enforcement authorities. By
					enabling sexual content, you accept these terms and the full
					legal consequences for any violations. Review our{" "}
					<FypLink
						fontSize={16}
						lineHeight={21}
						style={tw.style("text-fans-purple")}
						onPress={handlePressTerms}
					>
						Terms of Service
					</FypLink>{" "}
					for complete details. This is your responsibility. Proceed
					with understanding and caution
				</FypText>
				<FansView
					height={52}
					justifyContent="center"
					margin={{ b: 10 }}
				>
					<FypCheckbox
						label="Agree to Terms of Service"
						checked={isAgree}
						onPress={() => setIsAgree(!isAgree)}
					/>
				</FansView>
				<RoundButton
					disabled={!isAgree}
					onPress={() => handleAgree(isAgree)}
				>
					Agree to terms
				</RoundButton>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					textAlign="center"
					margin={{ t: 14 }}
					style={tw.style("text-fans-purple")}
					onPress={handleClose}
				>
					Cancel
				</FypText>
			</FansView>
		</FypModal>
	);
};

export default SexualPolicyModal;
