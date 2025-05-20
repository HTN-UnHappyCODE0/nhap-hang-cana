import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {ArrowDown2} from 'iconsax-react';

import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {PropsSelectFilterManyOption} from './interfaces';
import styles from './SelectFilterManyOption.module.scss';
import Button from '~/components/common/Button';

function SelectFilterManyOption({
	selectedIds,
	setSelectedIds,
	listData,
	name,
	isShowAll = true,
	splitCondition,
	splitGroupNames = ['Nhóm 1', 'Nhóm 2'],
}: PropsSelectFilterManyOption) {
	const [keyword, setKeyword] = useState<string>('');
	const [openDropdown, setOpenDropdown] = useState<boolean>(false);
	const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);

	const inputSearchRef = useRef<HTMLInputElement>(null);

	const filteredData = useMemo(() => {
		const searchKey = removeVietnameseTones(keyword).toLowerCase();
		return Array.isArray(listData)
			? listData.filter((v) => v.name && removeVietnameseTones(v.name).toLowerCase().includes(searchKey))
			: [];
	}, [keyword, listData]);

	const handleSelectItem = (uuid: string) => {
		setTempSelectedIds((prevIds) => (prevIds.includes(uuid) ? prevIds.filter((id) => id !== uuid) : [...prevIds, uuid]));
	};

	const handleCloseDropdown = useCallback(() => {
		setOpenDropdown(false);
		setTempSelectedIds(selectedIds);
	}, []);

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

	const [matchList, unmatchList] = useMemo(() => {
		if (!splitCondition) return [filteredData, []];
		return [filteredData.filter((v) => splitCondition(v)), filteredData.filter((v) => !splitCondition(v))];
	}, [filteredData, splitCondition]);

	return (
		<TippyHeadless
			interactive
			visible={openDropdown}
			onClickOutside={handleCloseDropdown}
			placement='bottom-start'
			render={() => (
				<div className={styles.main_option}>
					<input
						placeholder='Tìm kiếm...'
						ref={inputSearchRef}
						name='Tìm kiếm...'
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
						<div className={styles.optionGroup}>
							{matchList.length > 0 && (
								<div className={styles.group}>
									<p className={styles.groupTitle}>{splitGroupNames[0]}</p>
									{matchList.map((v) => (
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
							)}

							{unmatchList.length > 0 && (
								<div className={styles.group}>
									<p className={styles.groupTitle}>{splitGroupNames[1]}</p>
									{unmatchList.map((v) => (
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
							)}
						</div>
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
				<div className={styles.value}>
					<p className={styles.name}>{name && `${name}:`}</p>
					<p className={styles.selectedText}>
						{selectedIds.length === 0
							? 'Tất cả'
							: listData
									?.filter((v) => selectedIds?.includes(v.uuid))
									?.map((v) => v.name)
									?.join(', ')}
					</p>
				</div>

				<div className={styles.arrow}>
					<ArrowDown2 size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default SelectFilterManyOption;
