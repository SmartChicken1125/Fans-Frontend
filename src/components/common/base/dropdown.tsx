import { ChevronDown5Svg } from "@assets/svgs/common";
import { FansSvg, FansText, FansView } from "@components/controls";
import countries from "@helper/geo/country.json";
import tw from "@lib/tailwind";
import { IFypDropdown } from "@usertypes/components";
import React, { useMemo } from "react";
import { Platform } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { FypNullableView } from "./nullableView";
import { FypText } from "./text";

export const FypDropdown: IFypDropdown = (props) => {
	const {
		data,
		value,
		onSelect,
		search = false,
		placeholder = "Select item",
		searchPlaceholder = "Search...",
		valueField = "data",
		hasError,
		validateString,
		renderLeftIcon,
		style,
	} = props;

	return (
		<FansView>
			<Dropdown
				style={[
					tw.style(
						"h-[42px] rounded-[42px] border px-5",
						"border-fans-grey-70 dark:border-fans-grey-b1",
						hasError ? "border-fans-red" : "",
					),
					style,
				]}
				placeholderStyle={tw.style(
					"text-[18px] leading-6 text-fans-black dark:text-fans-white",
				)}
				selectedTextStyle={[
					tw.style(
						"text-fans-black dark:text-fans-white text-[18px] leading-6",
					),
				]}
				inputSearchStyle={[
					tw.style(
						"text-fans-black dark:text-fans-white h-10",
						Platform.OS === "web" && {
							outlineWidth: 0,
						},
					),
				]}
				itemTextStyle={tw.style("text-[18px] leading-6")}
				data={data}
				search={search}
				maxHeight={300}
				labelField="label"
				valueField={valueField}
				placeholder={placeholder}
				searchPlaceholder={searchPlaceholder}
				value={value}
				onChange={(item) => {
					onSelect(
						valueField === "id" ? item.id ?? item.data : item.data,
					);
				}}
				renderRightIcon={() => (
					<FansSvg
						width={13}
						height={13}
						svg={ChevronDown5Svg}
						color1="grey-70"
					/>
				)}
				renderLeftIcon={renderLeftIcon}
			/>
			<FypNullableView visible={!!hasError && !!validateString}>
				<FypText
					fontSize={16}
					lineHeight={20}
					color="red"
					margin={{ t: 4 }}
				>
					{validateString}
				</FypText>
			</FypNullableView>
		</FansView>
	);
};

export const FypCountryDropdown: IFypDropdown = (props) => {
	const { value, onSelect } = props;

	const countryOptions = useMemo(
		() =>
			countries
				.map((el) => ({
					data: el.isoCode,
					label: el.name,
					flag: el.flag,
				}))
				.sort((a, b) => a.label.localeCompare(b.label)),
		[],
	);

	return (
		<FansView>
			<FypDropdown
				data={countryOptions}
				value={value}
				onSelect={onSelect}
				placeholder="Select Country"
				renderLeftIcon={
					value
						? () => (
								<FypText margin={{ r: 5 }}>
									{
										countryOptions.find(
											(el) => el.data === value,
										)?.flag
									}
								</FypText>
						  )
						: undefined
				}
				search
			/>
			<FansView
				width={22}
				height={22}
				flexDirection="row"
				justifyContent="center"
				alignItems="center"
				position="absolute"
				style={tw.style("left-4 top-[10px]")}
			>
				<FansText>
					{countryOptions.find((el) => el.data === value)?.flag}
				</FansText>
			</FansView>
		</FansView>
	);
};

export default FypDropdown;
