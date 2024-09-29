export type * from './types.d.ts';

export type * from './types.d.ts';

import type {
  Primitive as Primitive_,
  Falsy as Falsy_,
  Nullish as Nullish_,
  Nullable as Nullable_,
  Maybe as Maybe_,
  MaybePromise as MaybePromise_,
  SingleOrArray as SingleOrArray_,
  NonUndefined as NonUndefined_,
  RequiredKeys as RequiredKeys_,
  OptionalKeys as OptionalKeys_,
  Mutable as Mutable_,
  Immutable as Immutable_,
  DeepReadonly as DeepReadonly_,
  DeepRequired as DeepRequired_,
  DeepPartial as DeepPartial_,
  Class as Class_,
  OmitFirstParam as OmitFirstParam_,
  Prop as Prop_,
  Values as Values_,
  ArrayItems as ArrayItems_,
  Merge as Merge_,
  StrictlyRequired as StrictlyRequired_,
  HasAddEventListener as HasAddEventListener_,
  DictionaryOpt as DictionaryOpt_,
  DictionaryReq as DictionaryReq_,
  JsonPrimitive as JsonPrimitive_,
  JsonValue as JsonValue_,
  JsonArray as JsonArray_,
  JsonObject as JsonObject_,
  JsonifiableObject as JsonifiableObject_,
  Json as Json_,
  NotJsonifiable as NotJsonifiable_,
  FilterJsonifiableKeys as FilterJsonifiableKeys_,
  JsonifyObject as JsonifyObject_,
  Simplify as Simplify_
} from './types';

/**
 * Declare global types for convenient access throughout the project
 */
declare global {
  /**
   * Represents a primitive type in TypeScript.
   * @typedef {string | number | bigint | boolean | symbol | null | undefined} Primitive
   */
  type Primitive = Primitive_;

  /**
   * Represents a type that includes all falsy values: false, '', 0, null, and undefined.
   */
  type Falsy = Falsy_;

  /**
   * Represents a type that can be null or undefined.
   */
  type Nullish = Nullish_;

  /**
   * Represents a type that can be either a value of type T or null.
   * @template T - The type of the value.
   */
  type Nullable<T> = Nullable_<T>;

  /**
   * Represents a type that can either be of type T or undefined.
   * @template T - The type parameter.
   */
  type Maybe<T> = Maybe_<T>;

  /**
   * Represents a type that can either be a value of type T or a promise that resolves to a value of type T.
   * @template T - The type of the value or the resolved value.
   */
  type MaybePromise<T> = MaybePromise_<T>;

  /**
   * Represents a type that can be either a single value or an array of values.
   * @template T - The type of the value(s).
   */
  type SingleOrArray<T> = SingleOrArray_<T>;

  /**
   * Type helper that removes the undefined type from a given type.
   * @template T The type to remove undefined from.
   * @returns The type without undefined.
   */
  type NonUndefined<T> = NonUndefined_<T>;

  /**
   * Returns the keys of an object type `T` that are required (not optional).
   *
   * @template T - The object type.
   * @returns The keys of `T` that are required.
   */
  type RequiredKeys<T> = RequiredKeys_<T>;

  /**
   * Returns the keys of an object type `T` that are optional.
   *
   * @template T - The object type.
   * @returns The keys of `T` that are optional.
   */
  type OptionalKeys<T> = OptionalKeys_<T>;

  /**
   * Represents a type that makes all properties of an object mutable (remove readonly).
   */
  type Mutable<T> = Mutable_<T>;

  /**
   * Represents a type that makes all properties of an object immutable (readonly).
   */
  type Immutable<T> = Immutable_<T>;

  /**
   * Represents a type that makes all properties of an object and its nested objects readonly.
   * @template T - The type to make readonly.
   * @returns The readonly version of the input type.
   */
  type DeepReadonly<T> = DeepReadonly_<T>;

  /**
   * Recursively makes all properties of an object and its nested objects/array required.
   *
   * @template T - The type to make deep required.
   * @param {T} value - The value to make deep required.
   * @returns {DeepRequired<T>} - The deep required type.
   */
  type DeepRequired<T> = DeepRequired_<T>;

  /**
   * Represents a type that makes all properties of the given type optional recursively.
   * @template T - The type to make partial.
   */
  type DeepPartial<T> = DeepPartial_<T>;

  /**
   * Represents a class constructor.
   * @template T - The type of the class.
   */
  type Class<T> = Class_<T>;

  /**
   * Removes the first parameter from a function type.
   * @template F The function type.
   * @returns A new function type without the first parameter.
   */
  type OmitFirstParam<F> = OmitFirstParam_<F>;

  /**
   * Retrieves the type of a property from an object type.
   *
   * @template T - The object type.
   * @template K - The property key.
   * @returns {Prop<T, K>} - The type of the property.
   */
  type Prop<T, K> = Prop_<T, K>;

  /**
   * Retrieves the union of all values in the given object type.
   * @typeparam T - The object type.
   * @returns The union of all values in the object type.
   */
  type Values<T> = Values_<T>;

  /**
   * Extracts the type of individual items in an array.
   * If the input type is an array, it returns the type of the array items.
   * If the input type is not an array, it returns the input type itself.
   *
   * @typeParam T - The input type.
   * @returns The type of individual items in the array, or the input type itself.
   */
  type ArrayItems<T> = ArrayItems_<T>;

  /**
   * Merges two types together by omitting keys from the first type that exist in the second type,
   * and then combining the remaining keys with the keys from the second type.
   * @template M - The first type to merge.
   * @template N - The second type to merge.
   * @returns A new type that is the result of merging the two input types.
   */
  type Merge<M, N> = Merge_<M, N>;

  /**
   * Make all properties in T required and exclude undefined and null from the property type.
   */
  type StrictlyRequired<T> = StrictlyRequired_<T>;

  /**
   * Represents an object that has the ability to add event listeners.
   */
  interface HasAddEventListener extends HasAddEventListener_ {}

  /**
   * Represents a dictionary where values can be optional (undefined).
   *
   * @template T The type of values stored in the dictionary. Defaults to `any`.
   */
  type DictionaryOpt<T = any> = DictionaryOpt_<T>;

  /**
   * Represents a dictionary where all values are required (non-optional).
   *
   * @template T The type of values stored in the dictionary. Defaults to `any`.
   */
  type DictionaryReq<T = any> = DictionaryReq_<T>;

  /**
   * Matches any valid JSON primitive value.
   */
  type JsonPrimitive = JsonPrimitive_;

  /**
   * Strigifyable JSON value that can be of type `string`, `number`, `boolean`, `null`, `undefined`,
   * `JSONArray`, or `JSONObject`.
   */
  type JsonValue = JsonValue_;

  /**
   * Represents `Array<JSONValues>`.
   */
  type JsonArray = JsonArray_;

  /**
   * Represents an `Dictionary` of `JSONValue` (Record<string, JSONValues>)
   */
  type JsonObject = JsonObject_;

  /**
   * Represents an object that can be converted to JSON value (JsonObject or an object with toJSON method).
   */
  type JsonifiableObject = JsonifiableObject_;

  /**
   * Represents a Json response content that can be of type `JSONArray` or `JSONObject`.
   */
  type Json = Json_;

  /**
   * Represents a type that cannot be converted to JSON.
   * This includes functions, undefined, and symbols.
   */
  type NotJsonifiable = NotJsonifiable_;

  /**
   * Filters out the keys from an object type that have values that are not JSONifiable.
   * @template T - The object type to filter.
   * @returns The keys from the object type that have values that are JSONifiable.
   */
  type FilterJsonifiableKeys<T extends object> = FilterJsonifiableKeys_<T>;

  /**
   * Converts an object type to a JSONifiable object type.
   * @template T - The object type to be converted.
   * @returns The JSONifiable object.
   */
  type JsonifyObject<T extends object> = JsonifyObject_<T>;

  /**
   * Convert simple type (بکش از ما بیرون).
   * Useful to flatten the type output to improve type hints shown in editors.
   * And also to transform an interface into a type to aide with assignability.
   *
   * @template T - The type to be simplified.
   * @returns The simplified type.
   */
  type Simplify<T> = Simplify_<T>;
}
