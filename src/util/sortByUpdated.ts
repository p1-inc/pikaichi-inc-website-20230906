//

type ExType = {
	updatedAt: string;
};
export const sortByUpdated = <T extends ExType>(_item: T[]): T[] => {
	const item = [..._item];
	const result = item.sort((a, b) => {
		const a2 = a?.updatedAt?.replace(/\-/g, "");
		const b2 = b?.updatedAt?.replace(/\-/g, "");

		return Number(b2) - Number(a2);
	});

	return result;
};
