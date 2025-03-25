import icons from '../images/icons';
import {REGENCY_CODE, TYPE_DATE} from './enum';

export const MAXIMUM_FILE = 10; //MB

export const allowFiles = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'image/jpeg',
	'image/jpg',
	'image/png',
];

export enum PATH {
	Any = 'any',
	Login = '/auth/login',
	ForgotPassword = '/auth/forgot-password',

	Home = '/',
	Profile = '/profile',

	// Hàng hóa
	HangHoa = '/hang-hoa',
	HangHoaLoaiGo = '/hang-hoa/loai-go',
	HangHoaQuocGia = '/hang-hoa/quoc-gia',
	HangHoaQuyCach = '/hang-hoa/quy-cach',
	ThemQuyCach = '/hang-hoa/quy-cach/them-moi',

	// Giá tiền hàng
	GiaTien = '/gia-tien-hang',
	GiaTienHangHienTai = '/gia-tien-hang/gia-hang-hien-tai',
	// GiaTienHangQuaKhu = '/gia-tien-hang/gia-hang-chinh-sua',
	GiaTienHangLichSu = '/gia-tien-hang/gia-hang-lich-su',
	ThemGiaTien = '/gia-tien-hang/them-moi',
	// ThemThayDoiGiaTien = '/gia-tien-hang/them-gia-hang-chinh-sua',
	ChinhSuaGiaTien = '/gia-tien-hang/chinh-sua',

	//Giá tiền hàng tương lai
	GiaTienHangTuongLai = '/gia-tien-hang-tuong-lai',
	ThemGiaTienHangTuongLai = '/gia-tien-hang-tuong-lai/them-moi',

	// Giá tiền hàng chỉnh sửa
	GiaTienHangChinhSua = '/gia-tien-hang-chinh-sua',
	ThemThayDoiGiaTienChinhSua = '/gia-tien-hang-chinh-sua/them-gia-hang-chinh-sua',

	// Nhà cung cấp
	Xuong = '/xuong',
	ThemMoiXuong = '/xuong/them-moi',
	ChinhSuaXuong = '/xuong/chinh-sua',
	NhaCungCap = '/nha-cung-cap',
	ThemMoiNhaCungCap = '/nha-cung-cap/them-moi',
	ChinhSuaNhaCungCap = '/nha-cung-cap/chinh-sua',

	// Duyệt lại đồ khô
	DuyetLaiDoKho = '/duyet-lai-do-kho',

	// Kho hàng
	KhoHang = '/kho-hang',

	// Thống kê theo ngày
	ThongKeTheoNgay = '/thong-ke-theo-ngay',
}

export const Menu: {
	title: string;
	group: {
		path: string;
		pathActive?: string;
		title: string;
		icon: any;
		regencys: number[];
	}[];
}[] = [
	{
		title: 'overview',
		group: [
			{
				title: 'Tổng quan',
				icon: icons.tongQuan,
				path: PATH.Home,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},
		],
	},

	{
		title: 'Kho hàng',
		group: [
			{
				title: 'Kho hàng',
				icon: icons.danhsachkho,
				path: PATH.KhoHang,
				pathActive: '/kho-hang',
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},
		],
	},
	{
		title: 'Nhập hàng',
		group: [
			{
				title: 'Hàng hóa',
				icon: icons.hanghoa,
				path: PATH.HangHoaLoaiGo,
				pathActive: PATH.HangHoa,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},

			{
				title: 'Duyệt độ khô',
				icon: icons.duyetdokho,
				path: PATH.DuyetLaiDoKho,
				pathActive: PATH.DuyetLaiDoKho,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					// REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},

			{
				title: 'Giá tiền hàng',
				icon: icons.giatienhang,
				path: PATH.GiaTienHangHienTai,
				pathActive: PATH.GiaTien,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},
			{
				title: 'Giá tiền hàng chỉnh sửa',
				icon: icons.giatienhangchinhsua,
				path: PATH.GiaTienHangChinhSua,
				regencys: [REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG],
			},
			{
				title: 'Giá tiền hàng tương lai',
				icon: icons.giatienhangtuonglai,
				path: PATH.GiaTienHangTuongLai,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},
			{
				title: 'Thống kê theo ngày',
				icon: icons.thongkethoethang,
				path: PATH.ThongKeTheoNgay,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},
		],
	},
	{
		title: 'Nhà cung cấp',
		group: [
			{
				title: 'Nhà cung cấp',
				icon: icons.xuong,
				path: PATH.Xuong,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},
			{
				title: 'Công ty',
				icon: icons.congty,
				path: PATH.NhaCungCap,
				regencys: [
					REGENCY_CODE.GIAM_DOC,
					REGENCY_CODE.PHO_GIAM_DOC,
					REGENCY_CODE.QUAN_LY_NHAP_HANG,
					REGENCY_CODE.NHAN_VIEN_THI_TRUONG,
				],
			},
		],
	},
];

export const KEY_STORE = 'NHAP-HANG-TRAM-CAN';

export const ListOptionTimePicker: {
	name: string;
	value: number;
}[] = [
	{
		name: 'Hôm nay',
		value: TYPE_DATE.TODAY,
	},
	{
		name: 'Hôm qua',
		value: TYPE_DATE.YESTERDAY,
	},
	{
		name: 'Tuần này',
		value: TYPE_DATE.THIS_WEEK,
	},
	{
		name: 'Tuần trước',
		value: TYPE_DATE.LAST_WEEK,
	},
	{
		name: '7 ngày trước',
		value: TYPE_DATE.LAST_7_DAYS,
	},
	{
		name: 'Tháng này',
		value: TYPE_DATE.THIS_MONTH,
	},
	{
		name: 'Tháng trước',
		value: TYPE_DATE.LAST_MONTH,
	},
	{
		name: 'Năm này',
		value: TYPE_DATE.THIS_YEAR,
	},
	{
		name: 'Lựa chọn',
		value: TYPE_DATE.LUA_CHON,
	},
];

export const WEIGHT_WAREHOUSE = 10000; // Tấn
