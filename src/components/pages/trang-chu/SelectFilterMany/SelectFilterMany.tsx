import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {ArrowDown2} from 'iconsax-react';

import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {PropsSelectFilterMany} from './interfaces';
import styles from './SelectFilterMany.module.scss';
import Button from '~/components/common/Button';

function SelectFilterMany({selectedIds, setSelectedIds, listData, placeholder, isShowAll = true}: PropsSelectFilterMany) {
	const [keyword, setKeyword] = useState<string>('');
	const [openDropdown, setOpenDropdown] = useState<boolean>(false);
	const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);

	const inputSearchRef = useRef<HTMLInputElement>(null);

	const filteredData = useMemo(() => {
		const searchKey = removeVietnameseTones(keyword).toLowerCase();
		return Array.isArray(listData) ? listData.filter((v) => removeVietnameseTones(v.name).toLowerCase().includes(searchKey)) : [];
	}, [keyword, listData]);

	const handleSelectItem = (uuid: string) => {
		setTempSelectedIds((prevIds) => (prevIds.includes(uuid) ? prevIds.filter((id) => id !== uuid) : [...prevIds, uuid]));
	};

	const handleCloseDropdown = useCallback(() => {
		setOpenDropdown(false);
		setTempSelectedIds(selectedIds);
	}, [selectedIds]);

	const handleConfirm = () => {
		setSelectedIds(tempSelectedIds);
		setOpenDropdown(false);
	};

	const handleCancel = () => {
		setTempSelectedIds(selectedIds);
		setOpenDropdown(false);
	};

	useEffect(() => {
		if (openDropdown) {
			setTempSelectedIds(selectedIds);
		}
	}, [openDropdown]);

	return (
		<TippyHeadless
			interactive
			visible={openDropdown}
			onClickOutside={handleCloseDropdown}
			placement='bottom-start'
			render={() => (
				<div className={styles.main_option}>
					<input
						ref={inputSearchRef}
						placeholder='Tìm kiếm...'
						className={styles.inputSearch}
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					/>
					<div className={styles.overflow}>
						{isShowAll && (
							<div
								className={clsx(styles.option, {[styles.option_active]: tempSelectedIds.length === 0})}
								onClick={() => setTempSelectedIds([])}
							>
								<p>Tất cả</p>
								{tempSelectedIds.length === 0 && <BiCheck fontSize={18} color='#5755FF' fontWeight={600} />}
							</div>
						)}
						{filteredData.map((v) => (
							<div
								key={v.uuid}
								className={clsx(styles.option, {[styles.option_active]: tempSelectedIds.includes(v.uuid)})}
								onClick={() => handleSelectItem(v.uuid)}
							>
								<p className={styles.textOverflow}>{v.name}</p>
								{tempSelectedIds.includes(v.uuid) && <BiCheck fontSize={20} fontWeight={600} />}
							</div>
						))}
					</div>
					{/* Nút Lưu & Hủy */}
					<div className={styles.accessBtn}>
						<Button className={styles.buttonHalf} p_8_16 rounded_2 grey_outline onClick={handleCancel}>
							Hủy
						</Button>
						<Button className={styles.buttonHalf} p_8_16 rounded_2 primary onClick={handleConfirm}>
							Xác nhận
						</Button>
					</div>
				</div>
			)}
		>
			<div className={clsx(styles.btn_filter, {[styles.active]: openDropdown})} onClick={() => setOpenDropdown(!openDropdown)}>
				<p className={styles.selectedText}>
					{selectedIds.length === 0
						? placeholder
						: listData
								?.filter((v) => selectedIds?.includes(v.uuid))
								?.map((v) => v.name)
								?.join(', ')}
				</p>
				<div className={styles.arrow}>
					<ArrowDown2 size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default SelectFilterMany;
