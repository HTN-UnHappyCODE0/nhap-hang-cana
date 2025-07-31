import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND} from '~/constants/config/enum';
import axiosClient from '.';

const warehouseServices = {
	listWarehouse: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			customerUuid: string;
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Warehouse/get-list-warehouse`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusWarehouse: (
		data: {
			uuid: string;
			status: CONFIG_STATUS;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Warehouse/change-status-warehouse`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertWarehouse: (
		data: {
			uuid: string;
			name: string;
			address: string;
			scaleStationUuid: string | null;
			provinceId: string;
			townId: string;
			description: string;
			companyUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Warehouse/upsert-warehouse`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailWarehouse: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Warehouse/detail-warehouse`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashbroadWarehouse: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Warehouse/dashbroad-warehouse`, data, {
			cancelToken: tokenAxios,
		});
	},
	historyWarehouseInOut: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			isDescending: CONFIG_DESCENDING;
			typeFind: CONFIG_TYPE_FIND;
			isPaging: CONFIG_PAGING;
			warehouseUuid: string;
			timeStart: string | null;
			timeEnd: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Warehouse/get-history-inout-warehouse`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default warehouseServices;
