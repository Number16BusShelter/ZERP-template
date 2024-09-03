/**
 * Merges two sorted arrays into a single sorted array.
 *
 * @template T - The type of elements in the arrays.
 * @param {T[]} left - The first sorted array.
 * @param {T[]} right - The second sorted array.
 * @param {(a: T, b: T) => number} compare - A compare function that returns a negative value if `a` should come before `b`, zero if they are equal, and a positive value if `a` should come after `b`.
 * @returns {T[]} A merged array sorted according to the compare function.
 */
const merge = <T>(
  left: T[],
  right: T[],
  compare: (a: T, b: T) => number,
): T[] => {
  const result: T[] = [];
  while (left.length > 0 && right.length > 0 && !!left[0] && !!right[0]) {
    if (compare(left[0], right[0]) <= 0) {
      result.push(left.shift()!);
    } else {
      result.push(right.shift()!);
    }
  }
  return result.concat(left, right);
};

/**
 * Sorts an array in a stable manner using the merge sort algorithm.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to be sorted.
 * @param {(a: T, b: T) => number} compare - A compare function that returns a negative value if `a` should come before `b`, zero if they are equal, and a positive value if `a` should come after `b`.
 * @returns {T[]} A new array sorted according to the compare function.
 */
export const stableSort = <T>(
  array: T[],
  compare: (a: T, b: T) => number,
): T[] => {
  if (array.length <= 1) {
    return array;
  }
  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);
  return merge(stableSort(left, compare), stableSort(right, compare), compare);
};
