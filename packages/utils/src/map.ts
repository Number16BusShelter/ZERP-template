/**
 * Maps over a Map synchronously, applying a mapping function to each entry.
 *
 * @template K - The type of the keys in the map.
 * @template V - The type of the values in the map.
 * @template R - The type of the results produced by the mapping function.
 * @param {Map<K, V>} map - The map to iterate over.
 * @param {(key: K, value: V) => R} mappingFn - The function to apply to each entry. Receives the key and value of each entry.
 * @returns {R[]} An array of the results produced by the mapping function.
 */
export function mapOverSync<K, V, R>(map: Map<K, V>, mappingFn: (key: K, value: V) => R): R[] {
    return Array.from(map.entries()).map(([key, value]) => mappingFn(key, value));
}

/**
 * Maps over a Map asynchronously, applying a mapping function to each entry.
 *
 * @template K - The type of the keys in the map.
 * @template V - The type of the values in the map.
 * @template R - The type of the results produced by the mapping function.
 * @param {Map<K, V>} map - The map to iterate over.
 * @param {(key: K, value: V) => R} mappingFn - The function to apply to each entry. Receives the key and value of each entry.
 * @returns {Promise<R[]>} A promise that resolves to an array of the results produced by the mapping function.
 */
export async function mapOver<K, V, R>(map: Map<K, V>, mappingFn: (key: K, value: V) => R): Promise<R[]> {
    return Promise.all(Array.from(map.entries()).map(async ([key, value]) => mappingFn(key, value)));
}

/**
 * Retrieves the value associated with the specified key from the given map or object.
 * Throws an error if the key is not present.
 *
 * @template K - The type of keys in the map or object.
 * @template V - The type of values in the map or object.
 * @param {Map<K, V> | Record<K, V>} data - The map or object from which to retrieve the value.
 * @param {K} key - The key whose associated value is to be retrieved.
 * @returns {V} - The value associated with the specified key.
 * @throws {TypeError} - If the first argument is not a Map or an object.
 * @throws {Error} - If the key is not present.
 */
export function unwrapMapOrObjectValue<K extends string | number, V>(
  data: Map<K, V> | Record<K, V>,
  key: K,
): V {
  if (data instanceof Map) {
    if (!data.has(key)) {
      throw new Error(`Key '${key}' is not present in the given map`);
    }
    const value = data.get(key);
    if (value === undefined) {
      throw new Error(`Value associated with key '${key}' is undefined`);
    }
    return value;
  } else if (typeof data === 'object' && data !== null) {
    if (!(key in data)) {
      throw new Error(`Key '${key}' is not present in the given object`);
    }
    const value = data[key];
    if (value === undefined) {
      throw new Error(`Value associated with key '${key}' is undefined`);
    }
    return value;
  } else {
    throw new TypeError('The first argument must be a Map or an object');
  }
}


/**
 * Retrieves the element at the specified index from the given array.
 * Throws an error if the index is out of range or if the array is not valid.
 *
 * @template T - The type of elements in the array.
 * @param {readonly T[] | T[]} arr - The array from which to retrieve the element.
 * @param {number} index - The index of the element to retrieve.
 * @returns {T} - The element at the specified index.
 * @throws {TypeError} - If the first argument is not an array.
 * @throws {RangeError} - If the index is out of range for the given array.
 */
export function unwrapArrayMember<T>(
  arr: readonly T[] | T[],
  index: number,
): T {
  if (!Array.isArray(arr)) {
    throw new TypeError('The first argument must be an array');
  }

  if (index < 0 || index >= arr.length) {
    throw new RangeError(
      `Index '${index}' is out of range for the given array`,
    );
  }

  const element = arr[index];
  if (element === undefined) {
    throw new RangeError(`Element at index '${index}' is undefined`);
  }

  return element;
}

/**
 * Retrieves the value associated with the specified key from the given map or object using unwrapMapOrObjectValue.
 *
 * @template T - The type of the map or object.
 * @param {any} map - The map or object from which to retrieve the value.
 * @param {string | number} id - The key whose associated value is to be retrieved.
 * @returns {any} - The value associated with the specified key.
 */

export function unwrapMapMember<T extends Record<string | number, any>>(
  map: any,
  id: string | number,
): any {
  return unwrapMapOrObjectValue(map as unknown as T, id);
}


/**
 * Updates the value in a Map based on a condition function for the key.
 *
 * @template K - The type of the keys in the map.
 * @template V - The type of the values in the map.
 * @param {Map<K, V>} map - The map to update.
 * @param {(key: K) => boolean} keyCondition - A function to determine if the key should be updated.
 * @param {Partial<V>} newValue - The new value to merge with the existing value.
 */
export function updateMapValue<K, V>(
  map: Map<K, V>,
  keyCondition: (key: K) => boolean,
  newValue: Partial<V>
): void {
  for (let [key, value] of map.entries()) {
    if (keyCondition(key)) {
      // Merge existing value with new value
      map.set(key, newValue as V);
      break; // Exit loop after updating
    }
  }
}
