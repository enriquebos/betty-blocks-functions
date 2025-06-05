declare interface Sort {
  field?: string;
  order?: "ASC" | "DESC";
  relation?: Record<string, "ASC" | "DESC" | NestedSort>;
}

declare interface NestedSort {
  [key: string]: "ASC" | "DESC" | NestedSort;
}
