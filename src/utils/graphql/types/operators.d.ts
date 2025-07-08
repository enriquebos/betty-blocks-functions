export interface StringOperator {
  doesNotMatch?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  eq?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<InputMaybe<Scalars["String"]["input"]>[]>;
  matches?: InputMaybe<Scalars["String"]["input"]>;
  neq?: InputMaybe<Scalars["String"]["input"]>;
  nin?: InputMaybe<InputMaybe<Scalars["String"]["input"]>[]>;
  regex?: InputMaybe<Scalars["String"]["input"]>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}
