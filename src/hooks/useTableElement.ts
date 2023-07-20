import { useState, useEffect } from "react";
import { keys } from "@mantine/utils";

export const useTableElement = <T>(defaultSortBy: keyof T) => {
	//
	const [tableData, setTableData] = useState<(T & { id?: string })[]>([]);

	const [search, setSearch] = useState<string>("");
	const [sortBy, setSortBy] = useState<keyof T>(defaultSortBy);
	const [reverseSortDirection, setReverseSortDirection] = useState<boolean>(false);

	const [page, setPage] = useState(1);

	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [checked, setChecked] = useState<string[]>([]);

	const filterData = (data: T[], search: string) => {
		const query = search.toLowerCase().trim();
		const fData = data.filter((item) =>
			keys(data[0]).some((key) => {
				if (typeof item === "string") {
					return item[key].toString().toLowerCase().includes(query);
				} else {
					return true;
				}
			}),
		);
		return fData;
	};

	const sortData = (data: T[], payload: { sortBy: keyof T | null; reversed: boolean; search: string }) => {
		const { sortBy } = payload;

		if (!sortBy) {
			return filterData(data, payload.search);
		}

		return filterData(
			[...data].sort((a, b) => {
				if (payload.reversed) {
					return b[sortBy].toString().localeCompare(a[sortBy].toString());
				}

				return a[sortBy].toString().localeCompare(b[sortBy].toString());
			}),
			payload.search,
		);
	};

	const setSorting = (field: keyof T) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setTableData(sortData(tableData, { sortBy: field, reversed, search }));
	};

	const handleSelectAllClick = (event: any) => {
		if (event.target.checked) {
			const nCheckedArr = tableData.map((n) => n.id);
			setChecked(nCheckedArr);
			return;
		}
		setChecked([]);
	};

	const sortDataFunc = (data: T[], payload: { sortBy: keyof T | null; reversed: boolean; search: string }) => {
		const { sortBy } = payload;

		if (!sortBy) {
			return filterData(data, payload.search);
		}

		return filterData(
			[...data].sort((a, b) => {
				if (payload.reversed) {
					return b[sortBy].toString().localeCompare(a[sortBy].toString());
				}

				return a[sortBy].toString().localeCompare(b[sortBy].toString());
			}),
			payload.search,
		);
	};

	const handleCheck = (id: string) => {
		const nSet = new Set(checked);

		const isExist = nSet.has(id);
		if (isExist) {
			nSet.delete(id);
		} else {
			nSet.add(id);
		}

		const nArr = Array.from(nSet);

		setChecked(nArr);
	};

	return {
		tableData,
		setTableData,
		search,
		setSearch,
		sortBy,
		setSortBy,
		reverseSortDirection,
		setReverseSortDirection,
		page,
		setPage,
		rowsPerPage,
		setRowsPerPage,
		checked,
		setChecked,

		filterData,
		sortData,
		setSorting,
		handleSelectAllClick,
		sortDataFunc,
		handleCheck,
	};
};
