export interface PropsTable {
	data: any;
	column: {
		totalMoney?: number;
		title: string | React.ReactNode;
		render: any;
		className?: string;
		checkBox?: boolean;
		textAlign?: string;
		fixedLeft?: boolean;
		fixedRight?: boolean;
		selectRow?: boolean;
		isTitle?: any;
	}[];
	onSetData?: (any: any) => void;
	isChild?: boolean;
	fixedHeader?: boolean;
	isDisableCheckBox?: (data: any) => boolean;
}
