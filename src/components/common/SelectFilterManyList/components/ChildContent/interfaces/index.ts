export interface PropsChildContent {
	listDataContent: {uuid: string; name: string}[];
	selectedIdsContent: string[];
	setSelectedIdsContent: React.Dispatch<React.SetStateAction<string[]>>;
	nameContent: string;
}
