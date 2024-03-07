import { USD } from "@dinero.js/currencies";
import { CDN_URL } from "@env";
import {
	Currency,
	dinero,
	hasSubUnits,
	toDecimal,
	toSnapshot,
} from "dinero.js";
import { decodeToDataURL } from "./BlurHash";

type cdnURLType = {
	(path: string): string;
	(path: string | undefined): string | undefined;
};

/**
 * Converts relative CDN URL to absolute URL if it's not already absolute
 * @param path Relative CDN URL
 */
export const cdnURL = ((path: string | undefined): string | undefined => {
	if (!path) return path;

	if (typeof path !== "string") {
		return path;
	}

	if (
		path.startsWith("blob:") ||
		path.startsWith("data:") ||
		path.startsWith("http:") ||
		path.startsWith("https:")
	)
		return path;

	if (path.startsWith("/")) path = path.substring(1);
	return CDN_URL + path;
}) as cdnURLType;

/**
 * Converts a string to base64url encoded string
 * @param data The string to encode
 * @returns The base64url encoded string
 */
export function btoaurl(data: string): string {
	if (typeof window === "undefined") {
		return Buffer.from(data).toString("base64url");
	} else {
		return window
			.btoa(data)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=/g, "");
	}
}

/**
 * Converts a base64url encoded string to a string
 * @param data The base64url encoded string
 * @returns The decoded string
 */
export function atoburl(data: string): string {
	if (typeof window === "undefined") {
		return Buffer.from(data, "base64url").toString();
	} else {
		return window.atob(data.replace(/-/g, "+").replace(/_/g, "/"));
	}
}

export function hasFlags(field: number, flags: number): boolean {
	return (field & flags) === flags;
}

export function formatPrice(price: number): string {
	const dineroObject = dinero({ amount: price, currency: USD });

	function transformer({
		value,
		currency,
	}: {
		value: string;
		currency: Currency<number>;
	}) {
		const { scale } = toSnapshot(dineroObject);
		const minimumFractionDigits = hasSubUnits(dineroObject) ? scale : 0;

		return Number(value).toLocaleString("en-US", {
			style: "currency",
			currency: currency.code,
			maximumFractionDigits: scale,
			minimumFractionDigits,
		});
	}

	return toDecimal(dineroObject, transformer);
}

export function urlOrBlurHash(
	url: string | undefined,
	blurHash: string | undefined,
): string | undefined {
	if (url) return url;
	if (blurHash) return decodeToDataURL(blurHash);
	return undefined;
}

export function generateObjectId(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		);
		counter += 1;
	}
	return result;
}
