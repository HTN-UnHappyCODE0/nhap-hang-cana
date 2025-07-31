export interface PropsSelectFilterManyOption {
	isShowAll?: boolean;
	name: string;
	selectedIds: string[];
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
	listData: {uuid: string; name: string}[];
	splitCondition?: (item: {uuid: string; name: string; [key: string]: any}) => boolean;
	splitGroupNames?: [string, string];
}
