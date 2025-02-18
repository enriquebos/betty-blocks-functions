declare type Sort = {
  field?: string;
  order?: "ASC" | "DESC";
  relation?: Record<string, "ASC" | "DESC" | NestedSort>;
};

declare type NestedSort = {
  [key: string]: "ASC" | "DESC" | NestedSort;
};
