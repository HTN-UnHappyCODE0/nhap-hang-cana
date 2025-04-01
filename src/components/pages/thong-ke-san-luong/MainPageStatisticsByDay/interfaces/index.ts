export interface PropsMainPageStatisticsByDay {}

export interface IMainPageStatisticsByDay {
	customerUu: {
		code: string;
		name: string;
		status: number;
		typeCus: number;
		companyUu: any;
		uuid: string;
	};
	timeList: {timeScale: string; weightMT: number; weightBDMT: number; drynessAvg: number}[];
	avgWeightBDMT: number;
	weightMT: number;
	weightBDMT: number;
	drynessAvg: number;
}
