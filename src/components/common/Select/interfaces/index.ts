export interface PropsSelector {
	children: React.ReactNode;
	onChange?: (any: any) => void;
	name?: string;
	value?: any;
	placeholder?: string;
	readOnly?: boolean;
	textname?: string;
	valuename?: string;
	label?: string | React.ReactNode;
	isSearch?: boolean;
	onClean?: () => void;
}

export interface PropsOption {
	children?: React.ReactNode;
	title: string;
	value: any;
	onClick?: () => void;
}
