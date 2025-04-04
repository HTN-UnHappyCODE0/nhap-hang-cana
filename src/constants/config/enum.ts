export enum QUERY_KEY {
	dropdown_bai,
	dropdown_khach_hang_nhap,
	dropdown_quoc_gia,
	dropdown_loai_go,
	dropdown_tieu_chi_quy_cach,
	dropdown_khach_hang,
	dropdown_quy_cach,
	dropdown_gia_tien_hang,
	dropdown_xuong,
	dropdown_nha_cung_cap,
	dropdown_chuc_vu,
	dropdown_nhan_vien_thi_truong,
	dropdown_tinh_thanh_pho,
	dropdown_quan_huyen,
	dropdown_xa_phuong,
	dropdown_kho_hang_chinh,
	dropdown_nguoi_quan_ly,
	dropdown_cong_ty,
	dropdown_nguoi_quan_ly_nhap_hang,
	dropdown_quan_ly_nhap_hang,
	dropdown_gia_tien_hang_tuong_lai,
	dropdown_nguoi_quan_ly_nhan_vien,
	dropdown_loai_hang,
	dropdown_chat_luong,
	dropdown_tram_can,
	dropdown_xe_hang,
	dropdown_ma_tau,

	table_loai_go,
	table_quoc_gia,
	table_quy_cach,
	table_phieu_can,
	table_gia_tien_hang,
	table_lich_su_gia_tien_hang,
	table_khach_hang_doi_tac,
	table_hang_hoa_cua_khach_hang,
	table_cong_ty,
	table_gia_tien_hang_tuong_lai,
	table_gia_tien_lich_su,
	table_do_kho_doi_duyet,
	danh_sach_tieu_chi_quy_cach,
	table_kho_hang,
	thong_ke_kho_hang,
	table_kiem_ke_bai,
	table_khach_hang_bai,
	table_lich_su_bai,
	table_bai,
	table_thong_ke_theo_ngay,
	table_tram_can,
	table_phieu_can_tat_ca,

	chi_tiet_quy_cach,
	chi_tiet_gia_tien_chinh_sua,
	chi_tiet_nha_cung_cap,
	chi_tiet_khach_hang,
	chi_tiet_gia_tien_hang,
	chi_tiet_doi_tac,
	chi_tiet_nhan_vien,
	chi_tiet_kho_hang,
	chi_tiet_bai,
	chi_tiet_lich_su_kiem_ke,

	thong_ke_tong_hang_nhap,
	thong_ke_bieu_do_duong_loai_hang,
	thong_ke_bieu_do_gia_tien_theo_ngay,
	thong_ke_bieu_do_chat_luong,
}

export enum TYPE_DATE {
	ALL = -1,
	TODAY = 1,
	YESTERDAY = 2,
	THIS_WEEK = 3,
	LAST_WEEK = 4,
	THIS_MONTH = 5,
	LAST_MONTH = 6,
	THIS_YEAR = 7,
	LAST_7_DAYS = 8,
	LUA_CHON = 9,
}

export enum GENDER {
	NAM,
	NU,
	KHAC,
}

export enum CONDITION {
	BIG,
	SMALL,
}

// ENUM API CONFIG
export enum CONFIG_STATUS {
	DA_XOA = -1,
	BI_KHOA = 0,
	HOAT_DONG = 1,
}

export enum CONFIG_PAGING {
	NO_PAGING,
	IS_PAGING,
}

export enum CONFIG_DESCENDING {
	NO_DESCENDING,
	IS_DESCENDING,
}

export enum CONFIG_TYPE_FIND {
	DROPDOWN,
	FILTER,
	TABLE,
}

export enum CONFIG_PRINT {
	NOT_PRINT,
	IS_PRINT,
}

export enum CONFIG_STATE_SPEC_CUSTOMER {
	CHUA_CUNG_CAP,
	DANG_CUNG_CAP,
}

export enum TYPE_TRANSPORT {
	DUONG_BO,
	DUONG_THUY,
}

// PAGE CUSTOMER
export enum STATUS_CUSTOMER {
	DA_XOA = -1,
	DUNG_HOP_TAC = 0,
	HOP_TAC = 1,
}

export enum TYPE_CUSTOMER {
	NHA_CUNG_CAP = 1,
	KH_XUAT,
	DICH_VU,
}

export enum TYPE_PARTNER {
	NCC = 1,
	KH_XUAT,
	KH_DICH_VU,
}

export enum TYPE_PRODUCT {
	CONG_TY = 1,
	DICH_VU,
	DUNG_CHUNG,
}

export enum TYPE_SIFT {
	KHONG_CAN_SANG,
	CAN_SANG,
}

export enum TYPE_BATCH {
	CAN_LE,
	CAN_LO,
	KHONG_CAN,
}

export enum TYPE_SCALES {
	CAN_NHAP = 1,
	CAN_XUAT,
	CAN_DICH_VU,
	CAN_CHUYEN_KHO,
	CAN_TRUC_TIEP,
}

export enum STATUS_BILL {
	DA_HUY,
	CHUA_CAN,
	DANG_CAN,
	TAM_DUNG,
	DA_CAN_CHUA_KCS,
	DA_KCS,
	CHOT_KE_TOAN,
}

export enum STATE_BILL {
	NOT_CHECK = 0,
	QLK_REJECTED,
	QLK_CHECKED,
	KTK_REJECTED,
	KTK_CHECKED,
	END,
}

export enum STATUS_WEIGHT_SESSION {
	DA_HUY,
	CAN_LAN_1,
	CAN_LAN_2,
	UPDATE_SPEC_DONE,
	UPDATE_DRY_DONE,
	KCS_XONG,
	CHOT_KE_TOAN,
}

// PAGE DEBT
export enum STATUS_DEBT {
	THANH_TOAN,
	TAM_UNG,
}

// PAGE PRICE
export enum STATUS_STANDARD {
	DANG_AP_DUNG,
	NGUNG_AP_DUNG,
}

// PAGE TRUCK
export enum OWNEW_TYPE_TRUCK {
	XE_KHACH_HANG,
	XE_CONG_TY,
}

export enum TYPE_TRANSACTION {
	THANH_TOAN = 1,
	THU_HOI,
	THUE,
}

export enum STATUS_TRANSACTION {
	DA_XOA,
	BINH_THUONG,
}

export enum TYPE_DATE_SHOW {
	HOUR,
	DAY,
	MONTH,
	YEAR,
}

export enum TYPE_SHOW_BDMT {
	MT,
	BDMT,
}

// COMON REGENCY
export enum REGENCY_NAME {
	'Nhân viên tài chính - kế toán' = '9',
	'Nhân viên KCS' = '8',
	'Nhân viên thị trường' = '7',
	'Nhân viên cân' = '6',
	'Quản lý xe' = '5',
	'Quản lý nhập hàng' = '4',
	'Quản lý kho KCS' = '3',
	'Phó Giám Đốc' = '2',
	'Giám Đốc' = '1',
}

// Permisstion regency
export enum REGENCY_CODE {
	GIAM_DOC = 1,
	PHO_GIAM_DOC,
	QUAN_LY_KHO_KCS,
	QUAN_LY_NHAP_HANG,
	QUAN_LY_XE,
	NHAN_VIEN_CAN,
	NHAN_VIEN_THI_TRUONG,
	NHAN_VIEN_KCS,
	NHAN_VIEN_KE_TOAN,
}

// PAGE QUY CÁCH
export enum TYPE_RULER {
	NHO_HON,
	LON_HON,
}

// PAGE THỐNG KÊ LOG - TÌNH HUỐNG BẤT THƯỜNG
export enum STATUS_SITUATIONS {
	CHUA_KIEM_DUYET,
	DA_DUYET,
	XU_LY_SAI,
}

export enum TYPE_LOGIN {
	ADMIN = 1,
	KHO,
	KE_TOAN,
	NHAP_HANG,
}

export enum TYPE_PRICE_FUTURE {
	DA_HUY,
	CHUA_AP_DUNG,
	DANG_AP_DUNG,
	DA_KET_THUC,
}

export enum STATUS_CONFIRM {
	DA_HUY,
	DANG_DOI,
	DA_CHOT,
}

export enum TYPE_STORE {
	ADMIN_KHO,
	NHAP_HANG,
}
