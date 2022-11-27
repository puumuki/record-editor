export interface PerformanceIndex {
  name: string,
  color: string
}

/**
 * Convert scores to perfomance index
 * @param score vehicle's performance index
 * @returns performance index object
 */
const scoresToPerformanceIndex = (score?:number):PerformanceIndex => {

  if( score === undefined || score === 0) {
    return { name: '', color: 'performance-index--na' };
  }

  if( score <= 500 ) {
    return { name: 'D', color: 'performance-index--d' };
  } else if( score >= 501 && score <= 600 ) {
    return { name: 'C', color: 'performance-index--c' };
  } else if( score >= 601 && score <= 700 ) {
    return { name: 'B', color: 'performance-index--b' };
  } else if( score >= 701 && score <= 800 ) {
    return { name: 'A', color: 'performance-index--a' };
  } else if( score >= 801 && score <= 900 ) {
    return { name: 'S1', color: 'performance-index--s1' };
  } else if( score >= 901 && score <= 998 ) {
    return { name: 'S2', color: 'performance-index--s2' };
  } else if( score > 998 ) {
    return { name: 'X', color: 'performance-index--x' };
  } else {
    return { name: '', color: 'performance-index--na' };
  }
}

export default scoresToPerformanceIndex;