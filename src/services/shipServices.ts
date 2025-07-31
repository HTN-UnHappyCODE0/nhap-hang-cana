import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const shipServices = {
	listShip: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: CONFIG_STATUS | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ship/get-list-ship`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertShip: (
		data: {
			uuid: string;
			code: string;
			licensePalate: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ship/upsert-ship`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatus: (
		data: {
			uuid: string;
			status: CONFIG_STATUS;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ship/change-status-ship`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetail: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Ship/detail-ship`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default shipServices;
