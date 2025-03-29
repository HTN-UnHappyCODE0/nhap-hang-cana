import {useEffect, useMemo, useRef, useState} from 'react';

import {PropsTable} from './interfaces';
import clsx from 'clsx';
import styles from './Table.module.scss';

function Table({data, column, onSetData, fixedHeader = false, isDisableCheckBox}: PropsTable) {
	const tableContainerRef = useRef<any>(null);
	const [isShowScroll, setIsShowScroll] = useState<boolean>(false);
	const thRefs = useRef<(HTMLTableHeaderCellElement | null)[]>([]);
	const [columnWidths, setColumnWidths] = useState<number[]>([]);

	const checkForHorizontalScroll = () => {
		const element = tableContainerRef.current;
		if (element.scrollWidth > element.clientWidth) {
			setIsShowScroll(true);
		} else {
			setIsShowScroll(false);
		}
	};

	useEffect(() => {
		checkForHorizontalScroll();

		window.addEventListener('resize', checkForHorizontalScroll);

		return () => {
			window.removeEventListener('resize', checkForHorizontalScroll);
		};
	}, []);

	useEffect(() => {
		onSetData &&
			onSetData((prev: any[]) =>
				prev.map((item: any, index: number) => ({
					...item,
					isChecked: false,
					index: index,
				}))
			);
	}, []);

	const handleCheckAll = (e: any) => {
		const {checked} = e.target;
		onSetData &&
			onSetData((prev: any[]) =>
				prev?.map((item: any) => (isDisableCheckBox && isDisableCheckBox(item) ? item : {...item, isChecked: checked}))
			);
	};

	const handleCheckRow = (e: any, i: any) => {
		const {checked} = e.target;
		onSetData &&
			onSetData((prev: any[]) =>
				prev.map((item: any, index: number) => {
					if (index === i) {
						return {...item, isChecked: checked};
					}
					return item;
				})
			);
	};

	const isCheckedAll = useMemo(() => {
		return data.length > 0
			? data.some((item: any) =>
					isDisableCheckBox ? !isDisableCheckBox(item) && item?.isChecked === false : item?.isChecked === false
			  )
			: false;
	}, [data, isDisableCheckBox]);

	const [selectedRow, setSelectedRow] = useState<number | null>(null);

	const handleRowClick = (index: number) => {
		setSelectedRow(index);
	};

	//fixed
	useEffect(() => {
		const updateColumnWidths = () => {
			if (thRefs.current.length > 0) {
				const widths = thRefs.current.map((th) => th?.offsetWidth || 0);
				setColumnWidths(widths);
			}
		};

		updateColumnWidths();
		window.addEventListener('resize', updateColumnWidths);
		return () => {
			window.removeEventListener('resize', updateColumnWidths);
		};
	}, []);

	const fixedLeftPositions = useMemo(() => {
		let left = 0;
		return column.map((col, index) => {
			if (col.fixedLeft) {
				const position = left;
				left += columnWidths[index] || 0;
				return position;
			}
			return null;
		});
	}, [column, columnWidths]);

	const fixedRightPositions = useMemo(() => {
		let right = 0;
		return column.map((col, index) => {
			if (col.fixedRight) {
				const position = right;
				right += columnWidths[index] || 0;
				return position;
			}
			return null;
		});
	}, [column, columnWidths]);

	return (
		<div ref={tableContainerRef} className={clsx(styles.container, {[styles.fixedHeader]: fixedHeader})}>
			<table>
				<thead>
					<tr>
						{column.map((col: any, i: number) => {
							const isTitle = typeof col.isTitle === 'function' ? col.isTitle(null, i) : col.isTitle;

							return (
								<th
									className={clsx(
										{
											[styles.checkBox]: col.checkBox,
											[styles.textEnd]: col.textAlign == 'end',
											[styles.textStart]: col.textAlign == 'start',
											[styles.textCenter]: col.textAlign == 'center',
										},
										col.fixedLeft && styles.fixedLeft,
										col.fixedRight && styles.fixedRight
									)}
									key={i}
									ref={(el) => {
										thRefs.current[i] = el;
									}}
									style={{
										...(col.fixedLeft ? {left: fixedLeftPositions[i] || 0} : {}),
										...(col.fixedRight ? {right: fixedRightPositions[i] || 0} : {}),
									}}
								>
									<div className={styles.title_check_box}>
										{col.checkBox && !isTitle ? (
											<input
												className={clsx(styles.checkbox, styles.checkbox_head)}
												onChange={handleCheckAll}
												checked={!isCheckedAll || false}
												type='checkbox'
											/>
										) : null}
										{col.title}
									</div>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{data.map((row: any, rowIndex: number) => (
						<tr key={rowIndex} className={styles.tr_data}>
							{column.map((col: any, colIndex: number) => {
								const isTitle = typeof col.isTitle === 'function' ? col.isTitle(row, rowIndex) : col.isTitle;

								return (
									<td
										key={colIndex}
										onClick={!col.selectRow ? () => handleRowClick(rowIndex) : (e) => e.stopPropagation()}
										className={clsx(
											{
												[styles.selectedRow]: selectedRow === rowIndex,
												[styles.isTitleRow]: isTitle,
												[styles.fixedLeft]: col.fixedLeft && isShowScroll,
												[styles.fixedRight]: col.fixedRight && isShowScroll,
												[styles.stickyHeader]: col.fixedLeft && isTitle,
												[styles.stickyHeader1]: col.fixedRight && isTitle,
											},
											col.fixedLeft && styles.fixedLeft,
											col.fixedRight && styles.fixedRight
										)}
										style={{
											...(col.fixedLeft ? {left: fixedLeftPositions[colIndex] || 0} : {}),
											...(col.fixedRight ? {right: fixedRightPositions[colIndex] || 0} : {}),
										}}
									>
										<div
											className={clsx(col.className, {
												[styles.checkBox]: col.checkBox,
											})}
										>
											{col.checkBox && !isTitle ? (
												<input
													className={styles.checkbox}
													onClick={(e) => e.stopPropagation()}
													onChange={(e) => handleCheckRow(e, rowIndex)}
													checked={row?.isChecked || false}
													type='checkbox'
													disabled={isDisableCheckBox ? isDisableCheckBox(row) : false}
												/>
											) : null}
											{col.render(row, rowIndex)}
										</div>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
