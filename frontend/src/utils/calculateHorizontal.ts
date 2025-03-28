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
  totalSets?: number;
  adjustedMarks?: number;
  actualSpacing?: number;
  adjustedMarks1?: number;
  adjustedMarks2?: number;
  spacing1?: number;
  spacing2?: number;
  sets1?: number;
  sets2?: number;
  cutTileWidth?: number;
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
  let { widths, tileCoverWidth, minSpacing, maxSpacing, useDryVerge, abutmentSide, useLHTile, lhTileWidth, crossBonded } = inputs;

  // Step 1: Initialize
  let overhangLeft = useDryVerge === 'YES' ? 40 : 50;
  let overhangRight = useDryVerge === 'YES' ? 40 : 50;
  let widthReduction = 0;

  if (abutmentSide === 'LEFT') {
    overhangLeft = 0;
    widthReduction = 5;
  } else if (abutmentSide === 'RIGHT') {
    overhangRight = 0;
    widthReduction = 5;
  } else if (abutmentSide === 'BOTH') {
    overhangLeft = 0;
    overhangRight = 0;
    widthReduction = 10;
  }

  if (abutmentSide !== 'NONE') {
    inputs = { ...inputs, useDryVerge: 'NO' as 'YES' | 'NO', useLHTile: 'NO' as 'YES' | 'NO' };
    useDryVerge = 'NO';
    useLHTile = 'NO';
  }

  const minOverhang = useDryVerge === 'YES' ? 25 : 40;
  const maxOverhang = useDryVerge === 'YES' ? 55 : 60;

  // Step 2: Calculate effective width
  const totalWidths = widths.map(width => width + overhangLeft + overhangRight - widthReduction);
  const maxWidth = Math.max(...totalWidths);

  // Step 3: Determine common tile count
  let tilesWide = Math.floor((maxWidth - (useLHTile === 'YES' ? lhTileWidth : 0)) / tileCoverWidth) + (useLHTile === 'YES' ? 1 : 0);

  // Safeguard: Ensure tilesWide is reasonable
  const maxPossibleTiles = Math.floor(maxWidth / (tileCoverWidth + minSpacing)) + (useLHTile === 'YES' ? 1 : 0);
  if (tilesWide > maxPossibleTiles) {
    tilesWide = maxPossibleTiles;
  }

  // Step 4: Tile placement and adjustments
  let solution: HorizontalSolution | null = null;
  let warning: string | undefined;

  // Full tiles with spacing and overhang adjustments
  const widthResults = totalWidths.map((totalWidth, index) => {
    let actualSpacing = maxSpacing;
    let newOverhangLeft = overhangLeft;
    let newOverhangRight = overhangRight;
    let tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + (tilesWide > 1 ? (tilesWide - 1) * actualSpacing : 0);

    if (tiledWidth > totalWidth) {
      const excessWidth = tiledWidth - totalWidth;
      const spacingReduction = excessWidth / (tilesWide > 1 ? tilesWide - 1 : 1);
      actualSpacing = maxSpacing - spacingReduction;
      actualSpacing = Math.round(Math.max(actualSpacing, minSpacing));
      tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + (tilesWide > 1 ? (tilesWide - 1) * actualSpacing : 0);
    } else if (tiledWidth < totalWidth) {
      const remainingWidth = totalWidth - tiledWidth;
      if (remainingWidth < tileCoverWidth) {
        if (useDryVerge === 'YES') {
          const reductionPerSide = Math.min(remainingWidth / 2, 15);
          newOverhangLeft -= reductionPerSide;
          newOverhangRight -= reductionPerSide;
          newOverhangLeft = Math.round(Math.min(Math.max(newOverhangLeft, minOverhang), maxOverhang));
          newOverhangRight = Math.round(Math.min(Math.max(newOverhangRight, minOverhang), maxOverhang));
          totalWidth -= 2 * reductionPerSide;
        } else {
          const overhangAdjustment = remainingWidth / 2;
          newOverhangLeft += overhangAdjustment;
          newOverhangRight += overhangAdjustment;
          newOverhangLeft = Math.round(Math.min(Math.max(newOverhangLeft, minOverhang), maxOverhang));
          newOverhangRight = Math.round(Math.min(Math.max(newOverhangRight, minOverhang), maxOverhang));
          totalWidth = tiledWidth;
        }
      }
    }

    const firstMark = useLHTile === 'YES'
      ? lhTileWidth + tileCoverWidth + actualSpacing
      : crossBonded === 'YES'
      ? (tileCoverWidth / 2) + actualSpacing
      : tileCoverWidth + actualSpacing;

    return {
      totalWidth,
      overhangLeft: newOverhangLeft,
      overhangRight: newOverhangRight,
      firstMark: Math.round(firstMark),
      actualSpacing,
    };
  });

  const isWithinTolerance = widthResults.every((r, i) => {
    const tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + (tilesWide > 1 ? (tilesWide - 1) * r.actualSpacing! : 0);
    return Math.abs(tiledWidth - r.totalWidth) <= 3; // Allow 3mm tolerance
  });

  if (isWithinTolerance) {
    solution = { type: 'full', widthResults };
  }

  // Step 5: Split sets
  if (!solution) {
    for (let n1 = 1; n1 <= tilesWide - 2; n1++) {
      const n2 = (tilesWide - 1) - n1;
      if (n2 <= 0) continue;
      const widthResultsSplit = totalWidths.map((totalWidth, index) => {
        let spacing1 = maxSpacing;
        let spacing2 = (totalWidth - ((tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + n1 * spacing1)) / n2;
        spacing2 = Math.round(Math.min(Math.max(spacing2, minSpacing), maxSpacing));
        // Balance spacings to be more practical
        if (spacing2 < (minSpacing + maxSpacing) / 2) {
          const totalSpacing = (totalWidth - ((tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0))) / (tilesWide - 1);
          spacing1 = Math.round(Math.min(Math.max(totalSpacing, minSpacing), maxSpacing));
          spacing2 = spacing1;
        }
        const tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + n1 * spacing1 + n2 * spacing2;

        let newOverhangLeft = overhangLeft;
        let newOverhangRight = overhangRight;
        if (Math.abs(tiledWidth - totalWidth) > 3) {
          const remainingWidth = totalWidth - tiledWidth;
          if (useDryVerge === 'YES') {
            const reductionPerSide = Math.min(remainingWidth / 2, 15);
            newOverhangLeft -= reductionPerSide;
            newOverhangRight -= reductionPerSide;
            newOverhangLeft = Math.round(Math.min(Math.max(newOverhangLeft, minOverhang), maxOverhang));
            newOverhangRight = Math.round(Math.min(Math.max(newOverhangRight, minOverhang), maxOverhang));
            totalWidth -= 2 * reductionPerSide;
          } else {
            const overhangAdjustment = remainingWidth / 2;
            newOverhangLeft += overhangAdjustment;
            newOverhangRight += overhangAdjustment;
            newOverhangLeft = Math.round(Math.min(Math.max(newOverhangLeft, minOverhang), maxOverhang));
            newOverhangRight = Math.round(Math.min(Math.max(newOverhangRight, minOverhang), maxOverhang));
            totalWidth = tiledWidth;
          }
        }

        const firstMark = useLHTile === 'YES'
          ? lhTileWidth + tileCoverWidth + spacing1
          : crossBonded === 'YES'
          ? (tileCoverWidth / 2) + spacing1
          : tileCoverWidth + spacing1;

        return {
          totalWidth,
          overhangLeft: newOverhangLeft,
          overhangRight: newOverhangRight,
          firstMark: Math.round(firstMark),
          spacing1,
          spacing2,
          sets1: n1,
          sets2: n2,
        };
      });

      const isWithinToleranceSplit = widthResultsSplit.every((r, i) => {
        const tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + r.sets1! * r.spacing1! + r.sets2! * r.spacing2!;
        return Math.abs(tiledWidth - r.totalWidth) <= 3;
      });

      if (isWithinToleranceSplit) {
        solution = { type: 'split', widthResults: widthResultsSplit };
        break;
      }
    }
  }

  // Step 6: Cut tile
  if (!solution) {
    const maxTotalWidth = Math.max(...totalWidths);
    let actualSpacing = maxSpacing;
    let tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + (tilesWide > 1 ? (tilesWide - 1) * actualSpacing : 0);

    if (tiledWidth > maxTotalWidth) {
      const excessWidth = tiledWidth - maxTotalWidth;
      const spacingReduction = excessWidth / (tilesWide > 1 ? tilesWide - 1 : 1);
      actualSpacing = maxSpacing - spacingReduction;
      actualSpacing = Math.round(Math.max(actualSpacing, minSpacing));
      tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + (tilesWide > 1 ? (tilesWide - 1) * actualSpacing : 0);
    }

    let cutTileWidth = maxTotalWidth - (tilesWide > 1 ? (tilesWide - 1) * (tileCoverWidth + actualSpacing) : 0) - (useLHTile === 'YES' ? lhTileWidth : tileCoverWidth);
    if (cutTileWidth < tileCoverWidth / 2 && cutTileWidth < 100) {
      const targetCutWidth = Math.max(tileCoverWidth / 2, 100);
      const targetTiledWidth = maxTotalWidth - targetCutWidth;
      const totalSpacing = (targetTiledWidth - ((tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0))) / (tilesWide > 1 ? tilesWide - 1 : 1);
      actualSpacing = Math.round(Math.min(Math.max(totalSpacing, minSpacing), maxSpacing));
      tiledWidth = (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + (tilesWide > 1 ? (tilesWide - 1) * actualSpacing : 0);
      cutTileWidth = maxTotalWidth - tiledWidth;
    }
    cutTileWidth = Math.round(cutTileWidth);

    const widthResultsCut = totalWidths.map((totalWidth, index) => {
      const tiledWidth = (tilesWide > 1 ? (tilesWide - 1) * (tileCoverWidth + actualSpacing) : 0) + (useLHTile === 'YES' ? lhTileWidth : tileCoverWidth) + cutTileWidth;
      const remainingWidth = totalWidth - tiledWidth;
      let newOverhangLeft = overhangLeft;
      let newOverhangRight = overhangRight;

      if (useDryVerge === 'YES') {
        const reductionPerSide = Math.min(remainingWidth / 2, 15);
        newOverhangLeft -= reductionPerSide;
        newOverhangRight -= reductionPerSide;
        newOverhangLeft = Math.round(Math.min(Math.max(newOverhangLeft, minOverhang), maxOverhang));
        newOverhangRight = Math.round(Math.min(Math.max(newOverhangRight, minOverhang), maxOverhang));
        totalWidth -= 2 * reductionPerSide;
      } else {
        const overhangAdjustment = remainingWidth / 2;
        newOverhangLeft += overhangAdjustment;
        newOverhangRight += overhangAdjustment;
        newOverhangLeft = Math.round(Math.min(Math.max(newOverhangLeft, minOverhang), maxOverhang));
        newOverhangRight = Math.round(Math.min(Math.max(newOverhangRight, minOverhang), maxOverhang));
        totalWidth = tiledWidth;
      }

      const firstMark = useLHTile === 'YES'
        ? lhTileWidth + tileCoverWidth + actualSpacing
        : crossBonded === 'YES'
        ? (tileCoverWidth / 2) + actualSpacing
        : tileCoverWidth + actualSpacing;

      return {
        totalWidth,
        overhangLeft: newOverhangLeft,
        overhangRight: newOverhangRight,
        firstMark: Math.round(firstMark),
        actualSpacing,
        cutTileWidth,
      };
    });

    solution = { type: 'cut', widthResults: widthResultsCut };
  }

  // Step 7: Marks and sets
  const widthResultsWithMarks = solution!.widthResults.map((result) => {
    const setSize = tileCoverWidth > 300 ? 2 : 3;
    if (solution!.type === 'split') {
      const sets1 = Math.floor(result.sets1! / setSize);
      const sets2 = Math.floor(result.sets2! / setSize);
      const baseIncrementMarks1 = setSize * (tileCoverWidth + result.spacing1!);
      const baseIncrementMarks2 = setSize * (tileCoverWidth + result.spacing2!);
      const minMarks = setSize * (tileCoverWidth + minSpacing);
      const maxMarks = setSize * (tileCoverWidth + maxSpacing);
      const adjustedMarks1 = Math.round(Math.min(Math.max(baseIncrementMarks1, minMarks), maxMarks));
      const adjustedMarks2 = Math.round(Math.min(Math.max(baseIncrementMarks2, minMarks), maxMarks));
      return {
        ...result,
        sets1,
        sets2,
        adjustedMarks1,
        adjustedMarks2,
      };
    } else {
      const totalSets = tilesWide > 1 ? Math.floor((tilesWide - 1) / setSize) : 0;
      const baseIncrementMarks = setSize * (tileCoverWidth + result.actualSpacing!);
      const minMarks = setSize * (tileCoverWidth + minSpacing);
      const maxMarks = setSize * (tileCoverWidth + maxSpacing);
      const adjustedMarks = Math.round(Math.min(Math.max(baseIncrementMarks, minMarks), maxMarks));
      return {
        ...result,
        totalSets,
        adjustedMarks,
      };
    }
  });

  solution = { ...solution!, widthResults: widthResultsWithMarks };

  // Step 8: Add warning for spacing constraints
  if (!warning) {
    const hasInvalidSpacing = solution!.widthResults.some(r => {
      if (solution!.type === 'split') return (r.spacing1! < minSpacing || r.spacing1! > maxSpacing) || (r.spacing2! < minSpacing || r.spacing2! > maxSpacing);
      return r.actualSpacing! > 0 && (r.actualSpacing! < minSpacing || r.actualSpacing! > maxSpacing);
    });
    if (hasInvalidSpacing) {
      warning = 'Tile spacing is at the minimum or maximum on one or more widths. Consider adjusting the width or tile size.';
    }
  }

  // Step 9: Verify totals
  if (!solution) {
    throw new Error('Solution was not computed; this should never happen.');
  }

  const tolerance = 3;
  const totalWarnings = widths.map((width, index) => {
    const result = solution!.widthResults[index];
    const computedTotal = solution!.type === 'split'
      ? result.overhangLeft + (result.sets1! * (tileCoverWidth + result.spacing1!) + result.sets2! * (tileCoverWidth + result.spacing2!)) + result.overhangRight
      : result.overhangLeft + (result.cutTileWidth ? result.cutTileWidth + (tilesWide > 1 ? (tilesWide - 1) * (tileCoverWidth + result.actualSpacing!) : 0) : (tilesWide - (useLHTile === 'YES' ? 1 : 0)) * tileCoverWidth + (useLHTile === 'YES' ? lhTileWidth : 0) + (tilesWide > 1 ? (tilesWide - 1) * result.actualSpacing! : 0)) + result.overhangRight;
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
    solution: solution!,
    warning,
  };
};