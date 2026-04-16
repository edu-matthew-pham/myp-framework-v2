/**
 * Calculate grid offsets for nodes within a phase.
 * Horizontal phases (top/bottom, index 0/2) use column-major layout.
 * Vertical phases (left/right, index 1/3) use row-major layout.
 */
export function phaseOffsets(
  count: number,
  phaseIdx: number
): { col: number; row: number; totalCols: number; totalRows: number }[] {
  const isHoriz = phaseIdx === 0 || phaseIdx === 2;
  const offsets: { col: number; row: number; totalCols: number; totalRows: number }[] = [];

  if (isHoriz) {
    const cols = Math.ceil(count / 2);
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const rowCount =
        row === Math.floor((count - 1) / cols) && count % cols !== 0 ? count % cols : cols;
      const colOffset = rowCount < cols ? col + (cols - rowCount) / 2 : col;
      offsets.push({ col: colOffset, row, totalCols: cols, totalRows: Math.ceil(count / cols) });
    }
  } else {
    const rows = Math.ceil(count / 2);
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const rowSize = row === rows - 1 && count % 2 !== 0 ? 1 : 2;
      const colOffset = rowSize === 1 ? 0.5 : col;
      offsets.push({ col: colOffset, row, totalCols: 2, totalRows: rows });
    }
  }
  return offsets;
}

/**
 * Wrap text into lines that don't exceed maxCh characters.
 */
export function wrapText(text: string, maxCh: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  words.forEach((w) => {
    const t = cur ? cur + ' ' + w : w;
    if (t.length > maxCh && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = t;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}
