export interface Option {
	uuid: string;
	name: string;
}

export interface PropsOptionContent {
	keyword: string;
	setKeyword: (val: string) => void;
	inputSearchRef: React.RefObject<HTMLInputElement | null>;
	isShowAll: boolean;
	tempSelectedIds: string[];
	setTempSelectedIds: (val: string[]) => void;
	filteredData: Option[];
	splitCondition?: (item: Option) => boolean;
	matchList: Option[];
	unmatchList: Option[];
	splitGroupNames: [string, string];
	handleSelectItem: (uuid: string) => void;
	handleConfirm: () => void;
	handleCancel: () => void;
	listDataContent?: Option[];
	selectedIdsContent?: string[];
	setSelectedIdsContent?: React.Dispatch<React.SetStateAction<string[]>>;
	nameContent?: string;
}
