import { DateTime } from "luxon";

export function formatRelativeDateTime(dateTimeISO: string) {
	const inputDateTime = DateTime.fromISO(dateTimeISO);
	const currentTime = DateTime.now();

	const differenceInDays = currentTime.diff(inputDateTime, "days").days;

	if (differenceInDays < 1) {
		// If the date-time is within the last 24 hours, return the time
		return inputDateTime.toFormat("h:mm a");
	} else if (differenceInDays < 2) {
		// If the date-time is between 24 and 48 hours ago, return "Yesterday"
		return "Yesterday";
	} else {
		// For date-times more than 48 hours ago, return the full date
		return inputDateTime.toFormat("MMM dd, yyyy");
	}
}
