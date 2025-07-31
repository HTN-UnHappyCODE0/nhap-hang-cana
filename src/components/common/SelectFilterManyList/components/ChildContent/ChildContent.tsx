import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {ArrowDown2} from 'iconsax-react';

import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {PropsChildContent} from './interfaces';
import styles from './ChildContent.module.scss';
import Button from '~/components/common/Button';

function ChildContent({listDataContent, selectedIdsContent, setSelectedIdsContent, nameContent}: PropsChildContent) {
	const [keyword, setKeyword] = useState<string>('');
	const inputSearchRef = useRef<HTMLInputElement>(null);
	const [tempSelectedIdsContent, setTempSelectedIdsContent] = useState<string[]>(selectedIdsContent);

	const filteredData = useMemo(() => {
		const searchKey = removeVietnameseTones(keyword).toLowerCase();
		return Array.isArray(listDataContent)
			? listDataContent.filter((v) => v.name && removeVietnameseTones(v.name).toLowerCase().includes(searchKey))
			: [];
	}, [keyword, listDataContent]);

	const handleConfirm = () => {
		setSelectedIdsContent(tempSelectedIdsContent);
	};

	const handleCancel = () => {
		setTempSelectedIdsContent(selectedIdsContent);
	};

	const handleSelectItem = (uuid: string) => {
		setTempSelectedIdsContent((prevIds) => (prevIds.includes(uuid) ? prevIds.filter((id) => id !== uuid) : [...prevIds, uuid]));
	};

	return (
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
				{filteredData.map((v) => (
					<div
						key={v.uuid}
						className={clsx(styles.option, {[styles.option_active]: tempSelectedIdsContent.includes(v.uuid)})}
						onClick={() => handleSelectItem(v.uuid)}
					>
						<p className={styles.textOverflow}>{v.name}</p>
						{tempSelectedIdsContent.includes(v.uuid) && <BiCheck fontSize={20} fontWeight={600} />}
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
	);
}

export default ChildContent;
