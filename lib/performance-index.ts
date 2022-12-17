/**
 * Performance index is Forza Horizon 5 way to classify the cars to performance categories.
 * Classes are something like D is for very slow car, A is kinda nice car, S is a performance car and S2 is a supercarish class..
 * and X is over the top.
 */
export interface PerformanceIndex {
  /**
   * Performance index letter
   */
  name: 'D' | 'C' | 'B' | 'A' | 'S1' | 'S2' | 'X' | ''

  /**
   * Color CSS-class name
   */
  color: string
}

/**
 * This function convert performance scores to predefined performance index.
 *
 * @param score vehicle's performance index
 * @returns performance index object
 */
const scoresToPerformanceIndex = (score?: number): PerformanceIndex => {
  if (score === undefined || score === 0) {
    return { name: '', color: 'performance-index--na' }
  }

  if (score <= 500) {
    return { name: 'D', color: 'performance-index--d' }
  } else if (score >= 501 && score <= 600) {
    return { name: 'C', color: 'performance-index--c' }
  } else if (score >= 601 && score <= 700) {
    return { name: 'B', color: 'performance-index--b' }
  } else if (score >= 701 && score <= 800) {
    return { name: 'A', color: 'performance-index--a' }
  } else if (score >= 801 && score <= 900) {
    return { name: 'S1', color: 'performance-index--s1' }
  } else if (score >= 901 && score <= 998) {
    return { name: 'S2', color: 'performance-index--s2' }
  } else if (score > 998) {
    return { name: 'X', color: 'performance-index--x' }
  } else {
    return { name: '', color: 'performance-index--na' }
  }
}

export default scoresToPerformanceIndex
