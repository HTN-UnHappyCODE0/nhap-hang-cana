export interface PropsSelectFilterState {
	isShowAll?: boolean;
	placeholder: string;
	uuid: string;
	setUuid: (string: string) => void;
	setName?: (string: string) => void;
	listData: {uuid: string; name: string}[];
}
