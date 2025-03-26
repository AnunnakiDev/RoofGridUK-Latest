export interface VerticalInputs {
  rafterHeights: number[];
  gutterOverhang: number;
  materialType: string;
  slateTileHeight: number;
  maxGauge: number;
  minGauge: number;
  useDryRidge: 'YES' | 'NO';
}

export interface RafterResult {
  battenGauge?: number; // Single gauge
  gauge1?: number; // Split gauges
  gauge2?: number; // Split gauges
  cutCourseGauge?: number; // Cut course
  fullCourses?: number; // Full courses
  effectiveRidgeOffset: number;
}

export interface VerticalSolution {
  type: 'full' | 'split' | 'cut';
  n_spaces: number;
  n1?: number; // Split gauges
  n2?: number; // Split gauges
  rafterResults: RafterResult[];
}

export interface VerticalResult {
  underEaveBatten: number;
  eaveBatten: number;
  firstBatten: number;
  solution: VerticalSolution;
  warning?: string;
}

export const calculateVertical = (inputs: VerticalInputs): VerticalResult => {
  const { rafterHeights, gutterOverhang, materialType, slateTileHeight, maxGauge, minGauge, useDryRidge } = inputs;

  // Step 1: Initialize
  const eaveTileLength = materialType === 'Slate' ? slateTileHeight : slateTileHeight;
  const underEaveBatten = materialType === 'Slate' ? 0 : gutterOverhang / 2;
  const eaveBatten = materialType === 'Slate' ? gutterOverhang : gutterOverhang;
  const firstBatten = materialType === 'Slate' ? eaveBatten + (eaveTileLength / 2) : eaveBatten + eaveTileLength - 50;
  const ridgeOffset = useDryRidge === 'YES' ? 25 : 55;

  // Step 2: Calculate remaining length after first batten
  const remainingLengths = rafterHeights.map(rafterHeight => rafterHeight - firstBatten - ridgeOffset);

  // Step 3: Full tiles with max gauge
  let solution: VerticalSolution | null = null;
  let warning: string | undefined;

  for (let n = 1; n <= Math.max(...remainingLengths) / minGauge; n++) {
    const gauge = remainingLengths.map(rl => rl / n);
    const rafterResults = gauge.map(g => ({
      battenGauge: g,
      effectiveRidgeOffset: ridgeOffset,
    }));
    const isWithinGauge = gauge.every(g => g >= minGauge && g <= maxGauge);
    if (isWithinGauge) {
      const isCloseToMax = rafterResults.some(r => Math.abs(r.battenGauge! - maxGauge) <= 1);
      if (!isCloseToMax) {
        solution = { type: 'cut', n_spaces: n, rafterResults };
        break;
      }
    }
  }

  // Step 4: Full tiles with max gauge and cut course
  if (!solution) {
    for (let n = 1; n <= Math.max(...remainingLengths) / minGauge; n++) {
      const fullCourses = Math.floor(remainingLengths.map(rl => rl / maxGauge).reduce((a, b) => Math.min(a, b), Infinity));
      const remainingAfterFull = remainingLengths.map(rl => rl - fullCourses * maxGauge);
      const cutCourseGauge = remainingAfterFull.map(r => r / n);
      const rafterResults = cutCourseGauge.map(cg => ({
        cutCourseGauge: cg,
        fullCourses,
        effectiveRidgeOffset: ridgeOffset,
      }));
      const isWithinGauge = cutCourseGauge.every(cg => cg >= minGauge && cg <= maxGauge);
      if (isWithinGauge) {
        const isCloseToMax = rafterResults.some(r => Math.abs(r.cutCourseGauge! - maxGauge) <= 1);
        if (!isCloseToMax) {
          solution = { type: 'full', n_spaces: n, rafterResults };
          break;
        }
      }
    }
  }

  // Step 5: Split gauges
  if (!solution) {
    for (let n = 2; n <= Math.max(...remainingLengths) / minGauge; n++) {
      for (let n1 = 1; n1 < n; n1++) {
        const n2 = n - n1;
        const gauge1 = remainingLengths.map(rl => rl / n);
        const gauge2 = remainingLengths.map(rl => (rl - n1 * gauge1[0]) / n2);
        const rafterResults = gauge1.map((g1, index) => ({
          gauge1: g1,
          gauge2: gauge2[index],
          effectiveRidgeOffset: ridgeOffset,
        }));
        const isWithinGauge = gauge1.every(g => g >= minGauge && g <= maxGauge) && gauge2.every(g => g >= minGauge && g <= maxGauge);
        if (isWithinGauge) {
          solution = { type: 'split', n_spaces: n, n1, n2, rafterResults };
          break;
        }
      }
      if (solution) break;
    }
  }

  // Step 6: Fallback to cut course if no solution found
  if (!solution) {
    const n = Math.ceil(Math.max(...remainingLengths) / maxGauge);
    const fullCourses = Math.floor(remainingLengths.map(rl => rl / maxGauge).reduce((a, b) => Math.min(a, b), Infinity));
    const remainingAfterFull = remainingLengths.map(rl => rl - fullCourses * maxGauge);
    const cutCourseGauge = remainingAfterFull.map(r => r);
    const rafterResults = cutCourseGauge.map(cg => ({
      cutCourseGauge: cg,
      fullCourses,
      effectiveRidgeOffset: ridgeOffset,
    }));
    solution = { type: 'full', n_spaces: n, rafterResults };
  }

  // Step 7: Add warning for gauge constraints
  if (!warning) {
    const hasInvalidGauge = solution.rafterResults.some(r => {
      if (solution!.type === 'full') return r.cutCourseGauge! < minGauge;
      if (solution!.type === 'split') return r.gauge1! < minGauge || r.gauge2! < minGauge;
      return r.battenGauge! < minGauge;
    });
    if (hasInvalidGauge) {
      warning = 'Batten gauge is below the minimum on one or more rafters. Consider adjusting the rafter length or tile size.';
    }
  }

  // Step 8: Verify totals
  if (!solution) {
    throw new Error('Solution was not computed; this should never happen.');
  }
  const tolerance = 3; // 2-3mm tolerance
  const totalWarnings = rafterHeights.map((rafterHeight, index) => {
    if (!solution) return null; // This line should never be reached due to the throw above
    const result = solution.rafterResults[index];
    const computedTotal = solution.type === 'full'
      ? firstBatten + result.cutCourseGauge! + result.fullCourses! * maxGauge + result.effectiveRidgeOffset
      : solution.type === 'split'
      ? firstBatten + solution.n1! * result.gauge1! + solution.n2! * result.gauge2! + result.effectiveRidgeOffset
      : firstBatten + (solution.n_spaces - 1) * result.battenGauge! + result.effectiveRidgeOffset;
    const difference = Math.abs(rafterHeight - computedTotal);
    if (difference > tolerance) {
      return `Computed total (${computedTotal}mm) for rafter ${index + 1} differs from rafter height (${rafterHeight}mm) by ${difference}mm, exceeding tolerance of ${tolerance}mm.`;
    }
    return null;
  }).filter(w => w !== null);

  if (totalWarnings.length > 0) {
    warning = warning ? `${warning} ${totalWarnings.join(' ')}` : totalWarnings.join(' ');
  }

  return {
    underEaveBatten,
    eaveBatten,
    firstBatten,
    solution,
    warning,
  };
};