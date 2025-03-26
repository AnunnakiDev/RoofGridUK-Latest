export interface HorizontalInputs {
  widths: number[];
  tileCoverWidth: number;
  minSpacing: number;
  maxSpacing: number;
  useDryVerge: 'YES' | 'NO';
  abutmentSide: 'NONE' | 'LEFT' | 'RIGHT' | 'BOTH';
  useLHTile: 'YES' | 'NO';
  lhTileWidth: number;
  crossBonded: 'YES' | 'NO';
}

export interface WidthResult {
  totalWidth: number;
  overhangLeft: number;
  overhangRight: number;
  firstMark: number;
  totalSets?: number; // Made optional since it's not always used
  adjustedMarks?: number; // Full or cut
  actualSpacing?: number; // Full or cut
  remainingTiles?: number; // Full or cut
  adjustedMarks1?: number; // Split
  adjustedMarks2?: number; // Split
  spacing1?: number; // Split
  spacing2?: number; // Split
  sets1?: number; // Split
  sets2?: number; // Split
  remainingTiles1?: number; // Split
  remainingTiles2?: number; // Split
  cutTileWidth?: number; // Cut
}

export interface HorizontalSolution {
  type: 'full' | 'split' | 'cut';
  widthResults: WidthResult[];
}

export interface HorizontalResult {
  tilesWide: number;
  solution: HorizontalSolution;
  warning?: string;
}

export const calculateHorizontal = (inputs: HorizontalInputs): HorizontalResult => {
  const { widths, tileCoverWidth, minSpacing, maxSpacing, useDryVerge, abutmentSide, useLHTile, lhTileWidth, crossBonded } = inputs;

  // Step 1: Initialize
  const vergeOverhang = useDryVerge === 'YES' ? 60 : 30;
  const abutmentOverhang = 30;
  const totalOverhangLeft = abutmentSide === 'LEFT' || abutmentSide === 'BOTH' ? abutmentOverhang : vergeOverhang;
  const totalOverhangRight = abutmentSide === 'RIGHT' || abutmentSide === 'BOTH' ? abutmentOverhang : vergeOverhang;
  const effectiveTileWidth = useLHTile === 'YES' ? lhTileWidth : tileCoverWidth;

  // Step 2: Calculate remaining width after overhangs
  const remainingWidths = widths.map(width => width - totalOverhangLeft - totalOverhangRight);

  // Step 3: Full tiles with spacing between minSpacing and maxSpacing
  let solution: HorizontalSolution | null = null;
  let tilesWide = 0;
  let warning: string | undefined;

  // Try full tiles first (preferred case)
  for (let n = 1; n <= Math.max(...remainingWidths) / (effectiveTileWidth + minSpacing); n++) {
    const spacing = remainingWidths.map(rw => (rw - n * effectiveTileWidth) / (n > 1 ? n - 1 : 1)); // Avoid division by zero
    const widthResults = spacing.map((s, index) => ({
      totalWidth: remainingWidths[index] + totalOverhangLeft + totalOverhangRight,
      overhangLeft: totalOverhangLeft,
      overhangRight: totalOverhangRight,
      firstMark: totalOverhangLeft + effectiveTileWidth + (n > 1 ? s : 0), // First mark is just the tile width if n=1
      totalSets: n > 1 ? n - 1 : 0, // Number of sets (same as remainingTiles)
      adjustedMarks: n > 1 ? s : undefined, // Only set adjustedMarks if n > 1
      actualSpacing: n > 1 ? s : 0, // Spacing is 0 if n=1
      remainingTiles: n > 1 ? n - 1 : 0, // No remaining tiles if n=1
    }));
    const isWithinSpacing = spacing.every(s => s >= minSpacing && s <= maxSpacing) || n === 1; // Allow n=1 case
    if (isWithinSpacing) {
      tilesWide = n;
      const isCloseToMax = widthResults.some(r => r.adjustedMarks ? Math.abs(r.adjustedMarks - maxSpacing) <= 1 : false);
      if (!isCloseToMax || n === 1) {
        solution = { type: 'full', widthResults };
        break;
      }
    }
  }

  // Step 4: Split marks (if full tiles don't work)
  if (!solution) {
    for (let n = 2; n <= Math.max(...remainingWidths) / (effectiveTileWidth + minSpacing); n++) {
      for (let n1 = 1; n1 < n; n1++) {
        const n2 = n - n1;
        const spacing1 = remainingWidths.map(rw => (rw - n * effectiveTileWidth) / (n - 1));
        const spacing2 = remainingWidths.map(rw => (rw - n1 * (effectiveTileWidth + spacing1[0])) / n2);
        const widthResults = spacing1.map((s1, index) => ({
          totalWidth: remainingWidths[index] + totalOverhangLeft + totalOverhangRight,
          overhangLeft: totalOverhangLeft,
          overhangRight: totalOverhangRight,
          firstMark: totalOverhangLeft + effectiveTileWidth + s1,
          totalSets: n - 1, // Total sets for split case
          adjustedMarks1: s1,
          adjustedMarks2: spacing2[index],
          spacing1: s1,
          spacing2: spacing2[index],
          sets1: n1,
          sets2: n2,
        }));
        const isWithinSpacing = spacing1.every(s => s >= minSpacing && s <= maxSpacing) && spacing2.every(s => s >= minSpacing && s <= maxSpacing);
        if (isWithinSpacing) {
          tilesWide = n;
          solution = { type: 'split', widthResults };
          break;
        }
      }
      if (solution) break;
    }
  }

  // Step 5: Cut tiles (last resort)
  if (!solution) {
    const n = Math.ceil(Math.max(...remainingWidths) / (effectiveTileWidth + maxSpacing));
    const spacing = remainingWidths.map(rw => (rw - n * effectiveTileWidth) / (n > 1 ? n - 1 : 1)); // Avoid division by zero
    const cutTileWidth = remainingWidths.map(rw => rw - (n > 1 ? (n - 1) * (effectiveTileWidth + spacing[0]) : effectiveTileWidth));
    const widthResults = spacing.map((s, index) => ({
      totalWidth: remainingWidths[index] + totalOverhangLeft + totalOverhangRight,
      overhangLeft: totalOverhangLeft,
      overhangRight: totalOverhangRight,
      firstMark: totalOverhangLeft + (cutTileWidth[index] || effectiveTileWidth) + (n > 1 ? s : 0),
      totalSets: n > 1 ? n - 1 : 0, // Number of sets (same as remainingTiles)
      adjustedMarks: n > 1 ? s : undefined,
      actualSpacing: n > 1 ? s : 0,
      remainingTiles: n > 1 ? n - 1 : 0,
      cutTileWidth: cutTileWidth[index],
    }));
    tilesWide = n;
    solution = { type: 'cut', widthResults };
  }

  // Step 6: Add warning for spacing constraints
  if (!warning) {
    const hasInvalidSpacing = solution!.widthResults.some(r => {
      if (solution!.type === 'split') return (r.spacing1! < minSpacing || r.spacing1! > maxSpacing) || (r.spacing2! < minSpacing || r.spacing2! > maxSpacing);
      return r.actualSpacing! > 0 && (r.actualSpacing! < minSpacing || r.actualSpacing! > maxSpacing);
    });
    if (hasInvalidSpacing) {
      warning = 'Tile spacing is at the minimum or maximum on one or more widths. Consider adjusting the width or tile size.';
    }
  }

  // Step 7: Verify totals
  if (!solution) {
    throw new Error('Solution was not computed; this should never happen.');
  }
  const tolerance = 3; // 2-3mm tolerance
  const totalWarnings = widths.map((width, index) => {
    const result = solution!.widthResults[index];
    const computedTotal = solution!.type === 'split'
      ? result.overhangLeft + (result.sets1! * (effectiveTileWidth + result.spacing1!) + result.sets2! * (effectiveTileWidth + result.spacing2!)) + result.overhangRight
      : result.overhangLeft + (result.cutTileWidth ? result.cutTileWidth + (tilesWide > 1 ? (tilesWide - 1) * (effectiveTileWidth + result.actualSpacing!) : 0) : tilesWide * effectiveTileWidth + (tilesWide > 1 ? (tilesWide - 1) * result.actualSpacing! : 0)) + result.overhangRight;
    const difference = Math.abs(width - computedTotal);
    if (difference > tolerance) {
      return `Computed total (${computedTotal}mm) for width ${index + 1} differs from width (${width}mm) by ${difference}mm, exceeding tolerance of ${tolerance}mm.`;
    }
    return null;
  }).filter(w => w !== null);

  if (totalWarnings.length > 0) {
    warning = warning ? `${warning} ${totalWarnings.join(' ')}` : totalWarnings.join(' ');
  }

  return {
    tilesWide,
    solution,
    warning,
  };
};