import { FypSortButton, FypText } from "@components/common/base";
import { FansView } from "@components/controls";
import { OrderCard } from "@components/videoCall";
import { SortType } from "@usertypes/types";
import React, { useState } from "react";

const PastOrdersForm = () => {
	const [orderBy, setOrderBy] = useState<SortType>("Newest");
	return (
		<FansView>
			<FypText
				fontSize={23}
				lineHeight={31}
				fontWeight={600}
				margin={{ b: 23 }}
			>
				Past orders
			</FypText>
			<FansView margin={{ b: 28 }}>
				<FypSortButton value={orderBy} handleToggle={setOrderBy} />
			</FansView>
			<FansView>
				<OrderCard status="fulfilled" />
			</FansView>
		</FansView>
	);
};

export default PastOrdersForm;
