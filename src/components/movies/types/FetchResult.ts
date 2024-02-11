export type FetchResult<T> =
  | { kind: "Ok"; data: T }
  | { kind: "Error"; error: string };

export const Ok = function <T>(data: T): FetchResult<T> {
  return {
    kind: "Ok",
    data,
  };
};

export const Err = function <T>(error: string): FetchResult<T> {
  return {
    kind: "Error",
    error,
  };
};
