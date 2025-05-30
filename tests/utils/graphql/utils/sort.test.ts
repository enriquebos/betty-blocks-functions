import { sortToString, sortToObject, validateSortObject } from "../../../../src/utils/graphql/utils";

describe("Graphql sort", () => {
  const simpleSortObject = {
    field: "firstName",
    order: "ASC",
  };
  const simpleSortString = "field: firstName, order: ASC";

  const nestedSortObject = {
    relation: {
      webuser: "ASC",
    },
  };
  const nestedSortString = "relation: { webuser: ASC }";

  const deeplyNestedSortObject = {
    relation: {
      webuser: {
        profile: {
          createdAt: "DESC",
        },
      },
    },
  };
  const deeplyNestedSortString = "relation: { webuser: { profile: { createdAt: DESC } } }";

  it("should convert a simple sort object to a string", () => {
    expect(sortToString(simpleSortObject)).toEqual(simpleSortString);
  });

  it("should convert a nested sort object to a string", () => {
    expect(sortToString(nestedSortObject)).toEqual(nestedSortString);
  });

  it("should convert a deeply nested sort object to a string", () => {
    expect(sortToString(deeplyNestedSortObject)).toEqual(deeplyNestedSortString);
  });

  it("should convert a simple sort string back to an object", () => {
    expect(sortToObject(simpleSortString)).toEqual(simpleSortObject);
  });

  it("should convert a nested sort string back to an object", () => {
    expect(sortToObject(nestedSortString)).toEqual(nestedSortObject);
  });

  it("should convert a deeply nested sort string back to an object", () => {
    expect(sortToObject(deeplyNestedSortString)).toEqual(deeplyNestedSortObject);
  });

  it("should preserve symmetry between sortToString and sortToObject", () => {
    const string = sortToString(deeplyNestedSortObject);
    const convertedBack = sortToObject(string);
    expect(convertedBack).toEqual(deeplyNestedSortObject);
  });
  it("should pass validation for a simple valid sort object", () => {
    const validSort = {
      field: "firstName",
      order: "ASC",
    };
    expect(() => validateSortObject(validSort)).not.toThrow();
  });

  it("should pass validation for a valid nested relation sort object", () => {
    const validNestedSort = {
      relation: {
        webuser: "DESC",
      },
    };
    expect(() => validateSortObject(validNestedSort)).not.toThrow();
  });

  it("should throw for invalid keys", () => {
    const invalidKeys = {
      field: "firstName",
      order: "ASC",
      testKey: "oops",
    };
    expect(() => validateSortObject(invalidKeys)).toThrow(/Invalid key\(s\) passed in sort object: testKey/);
  });

  it("should throw if 'field' and 'relation' keys are both present", () => {
    const invalidSort = {
      field: "name",
      order: "ASC",
      relation: {
        webuser: "DESC",
      },
    };
    expect(() => validateSortObject(invalidSort)).toThrow(
      /'order' or 'field' cannot be defined when 'relation' key is defined/,
    );
  });

  it("should throw if relation has more than one sort order", () => {
    const invalidRelation = {
      relation: {
        createdAt: "DESC",
        webuser: "ASC",
      },
    };
    expect(() => validateSortObject(invalidRelation)).toThrow(
      /A sort object relation cannot have more than one sort order defined/,
    );
  });

  it("should throw if order is invalid", () => {
    const invalidOrder = {
      field: "firstName",
      order: "INVALID",
    };
    expect(() => validateSortObject(invalidOrder)).toThrow(
      /Sort object order has to be either ASC or DESC not 'INVALID'/,
    );
  });

  it("should throw if only 'field' or only 'order' is provided", () => {
    const onlyField = {
      field: "firstName",
    };
    const onlyOrder = {
      order: "ASC",
    };
    expect(() => validateSortObject(onlyField)).toThrow(/Both field and order have to be defined in a sort object/);
    expect(() => validateSortObject(onlyOrder)).toThrow(/Both field and order have to be defined in a sort object/);
  });
});
