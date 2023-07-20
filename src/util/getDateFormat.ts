export const getDateFormat = (date: string) => {
	if (!date) {
		return;
	}
	let result: string;
	const arr = date.split("-");
	if (arr.length === 3) {
		result = `${arr[0]}年${arr[1]}月${arr[2]}日`;
	} else if (arr.length === 6) {
		result = `${arr[0]}年${arr[1]}月${arr[2]}日 - ${arr[3]}:${arr[4]}:${arr[5]}`;
	}

	return result;
};
