import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {ArrowDown2} from 'iconsax-react';

import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {PropsSelectFilterManyList} from './interfaces';
import styles from './SelectFilterManyList.module.scss';
import Button from '~/components/common/Button';
import OptionContent from './components/OptionContent';

function SelectFilterManyList({
	selectedIds,
	setSelectedIds,
	listData,
	name,
	isShowAll = true,
	splitCondition,
	splitGroupNames = ['Nhóm 1', 'Nhóm 2'],
	listDataContent,
	selectedIdsContent,
	setSelectedIdsContent,
	nameContent,
}: PropsSelectFilterManyList) {
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
				<OptionContent
					keyword={keyword}
					setKeyword={setKeyword}
					inputSearchRef={inputSearchRef}
					isShowAll={isShowAll}
					tempSelectedIds={tempSelectedIds}
					setTempSelectedIds={setTempSelectedIds}
					filteredData={filteredData}
					splitCondition={splitCondition}
					matchList={matchList}
					unmatchList={unmatchList}
					splitGroupNames={splitGroupNames}
					handleSelectItem={handleSelectItem}
					handleConfirm={handleConfirm}
					handleCancel={handleCancel}
					listDataContent={listDataContent}
					selectedIdsContent={selectedIdsContent}
					setSelectedIdsContent={setSelectedIdsContent}
					nameContent={nameContent}
				/>
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

export default SelectFilterManyList;
