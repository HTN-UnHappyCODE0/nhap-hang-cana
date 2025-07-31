import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import {BiCheck} from 'react-icons/bi';
import {ArrowDown2} from 'iconsax-react';

import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import {PropsOptionContent} from './interfaces';
import styles from './OptionContent.module.scss';
import Button from '~/components/common/Button';
import ChildContent from '../ChildContent';

function OptionContent({
	keyword,
	setKeyword,
	inputSearchRef,
	isShowAll,
	tempSelectedIds,
	setTempSelectedIds,
	filteredData,
	splitCondition,
	matchList,
	unmatchList,
	splitGroupNames,
	handleSelectItem,
	handleConfirm,
	handleCancel,
	listDataContent,
	selectedIdsContent,
	setSelectedIdsContent,
	nameContent,
}: PropsOptionContent) {
	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={true}
			placement='right-start'
			render={(attrs) => (
				<div className={styles.child_option}>
					<ChildContent
						listDataContent={listDataContent ?? []}
						selectedIdsContent={selectedIdsContent ?? []}
						setSelectedIdsContent={setSelectedIdsContent ?? (() => {})}
						nameContent={nameContent ?? ''}
					/>
				</div>
			)}
		>
			<div className={styles.main_option}>
				<input
					placeholder='Tìm kiếm...'
					ref={inputSearchRef}
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
					<div>
						{!splitCondition ? (
							filteredData.map((v) => (
								<div
									key={v.uuid}
									className={clsx(styles.option, {[styles.option_active]: tempSelectedIds.includes(v.uuid)})}
									onClick={() => handleSelectItem(v.uuid)}
								>
									<p className={styles.textOverflow}>{v.name}</p>
									{tempSelectedIds.includes(v.uuid) && <BiCheck fontSize={20} fontWeight={600} />}
								</div>
							))
						) : (
							<div className={styles.optionGroup}>
								{matchList.length > 0 && (
									<div className={styles.group}>
										<p className={styles.groupTitle}>{splitGroupNames[0]}</p>
										{matchList.map((v) => (
											<div
												key={v.uuid}
												className={clsx(styles.option, {
													[styles.option_active]: tempSelectedIds.includes(v.uuid),
												})}
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
												className={clsx(styles.option, {
													[styles.option_active]: tempSelectedIds.includes(v.uuid),
												})}
												onClick={() => handleSelectItem(v.uuid)}
											>
												<p className={styles.textOverflow}>{v.name}</p>
												{tempSelectedIds.includes(v.uuid) && <BiCheck fontSize={20} fontWeight={600} />}
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div className={styles.accessBtn}>
					<Button className={styles.buttonHalf} p_8_16 grey_outline onClick={handleCancel}>
						Hủy
					</Button>
					<Button className={styles.buttonHalf} p_8_16 primary onClick={handleConfirm}>
						Xác nhận
					</Button>
				</div>
			</div>
		</TippyHeadless>
	);
}

export default OptionContent;
