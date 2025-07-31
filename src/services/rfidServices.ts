import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const rfidServices = {
	listRFID: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Rfid/get-list-rfid`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusRFID: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Rfid/change-status-rfid`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertRFID: (
		data: {
			uuid: string;
			code: string;
			truckPlate: string;
			description: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Rfid/upsert-rfid`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default rfidServices;
