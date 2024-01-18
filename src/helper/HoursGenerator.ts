export function generateTimeFrames(intervalMinutes: number): string[] {
	const timeFrames: string[] = [];
	const totalMinutesInDay = 24 * 60; // Total minutes in a day (24 hours)

	for (
		let minutes = 0;
		minutes < totalMinutesInDay;
		minutes += intervalMinutes
	) {
		const hour = Math.floor(minutes / 60);
		const minute = minutes % 60;

		const formattedHour = hour.toString().padStart(2, "0");
		const formattedMinute = minute.toString().padStart(2, "0");

		timeFrames.push(`${formattedHour}:${formattedMinute}`);
	}

	return timeFrames;
}

export function getIntervalEndTime(startTime: string, length: number) {
	if (startTime === "") {
		return "";
	}
	const startHours = startTime.split(":")[0];
	const startMinutes = startTime.split(":")[1];
	const endMinutes = (parseInt(startMinutes) + length) % 60;
	const endHours =
		parseInt(startHours) +
		Math.floor((parseInt(startMinutes) + length) / 60);
	return `${endHours.toString().padStart(2, "0")}:${endMinutes
		.toString()
		.padStart(2, "0")}`;
}

export const getIntervalLength = (startTime: string, endTime: string) => {
	const startHours = parseInt(startTime.split(":")[0]);
	const startMinutes = parseInt(startTime.split(":")[1]);
	const endHours = parseInt(endTime.split(":")[0]);
	const endMinutes = parseInt(endTime.split(":")[1]);
	return (endHours - startHours) * 60 + (endMinutes - startMinutes);
};
