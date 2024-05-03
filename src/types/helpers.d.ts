type NumberPropertyKeys<T> = keyof {
  [K in keyof T as T[K] extends number ? K : never]: K;
};

type StringPropertyKeys<T> = keyof {
  [K in keyof T as T[K] extends string ? K : never]: K;
};
