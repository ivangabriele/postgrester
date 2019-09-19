import Postgrest from "..";

const postgrest = new Postgrest({
  baseUri: "https://contributions-api.codedutravail.num.social.gouv.fr"
});

describe("Postgrest", () => {
  beforeEach(() => {
    (postgrest as any).reset();
  });

  test("should return the expected uri", () => {
    const uri = (postgrest as any).buildUri("/path", true);

    expect(uri).toStrictEqual("/path?select=*");
  });

  describe("#select()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest.select("aColumn").select("aResource(*)") as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=aColumn,aResource(*)");
    });
  });

  describe("#orderBy()", () => {
    test("should return the expected uri with root sorters", () => {
      const uri = (postgrest.orderBy("aColumn").orderBy("anotherColumn", true) as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=*&order=aColumn.asc,anotherColumn.desc");
    });

    test("should return the expected uri with foreign sorters", () => {
      const uri = (postgrest
        .orderBy("aResource.aColumn")
        .orderBy("aResource.anotherColumn", true) as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&aResource.order=aColumn.asc,anotherColumn.desc");
    });
  });

  describe("#page()", () => {
    test("should return the expected uri with no limit", () => {
      const uri = (postgrest.page(0) as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&limit=10&offset=0");
    });

    test("should return the expected uri with a limit", () => {
      const uri = (postgrest.page(1, 5) as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&limit=5&offset=5");
    });
  });

  describe("#is()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest.is("aColumn", true).is("anotherColumn", null) as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=*&aColumn=is.true&anotherColumn=is.null");
    });
  });

  describe("#eq()", () => {
    test("should return the expected uri with a boolean & a null values", () => {
      const uri = (postgrest.eq("aColumn", true).eq("anotherColumn", null) as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=*&aColumn=is.true&anotherColumn=is.null");
    });

    test("should return the expected uri with a number & a string values", () => {
      const uri = (postgrest.eq("aColumn", 123).eq("anotherColumn", "aValue") as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=*&aColumn=eq.123&anotherColumn=eq.aValue");
    });

    test("should return the expected uri with quotes", () => {
      const uri = (postgrest.eq("aColumn", "aValue", true) as any).buildUri("/path", true);

      expect(uri).toStrictEqual(`/path?select=*&aColumn=eq."aValue"`);
    });
  });

  describe("#in()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest
        .in("aColumn", [123, 456])
        .in("anotherColumn", ["aValue", "anotherValue"]) as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        "/path?select=*&aColumn=in.(123,456)&anotherColumn=in.(aValue,anotherValue)"
      );
    });
  });

  describe("#like()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest
        .like("aColumn", "aValue")
        .like("anotherColumn", "anotherValue") as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        `/path?select=*&aColumn=like."*aValue*"&anotherColumn=like."*anotherValue*"`
      );
    });
  });

  describe("#ilike()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest
        .ilike("aColumn", "aValue")
        .ilike("anotherColumn", "anotherValue") as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        `/path?select=*&aColumn=ilike."*aValue*"&anotherColumn=ilike."*anotherValue*"`
      );
    });
  });

  describe("#not()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest.not
        .is("column_1", false)
        .not.eq("column_2", "value_2")
        .not.in("column_3", ["value_3_1", "value_3_2"])
        .not.like("column_4", "value_4")
        .not.ilike("column_5", "value_5") as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        `/path?select=*&column_1=not.is.false&column_2=not.eq.value_2&column_3=not.in.(value_3_1,value_3_2)&column_4=not.like.\"*value_4*\"&column_5=not.ilike.\"*value_5*\"`
      );
    });
  });

  describe("#and()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest.and
        .is("column_1", false)
        .eq("column_2", "value_2")
        .in("column_3", ["value_3_1", "value_3_2"])
        .like("column_4", "value_4")
        .ilike("column_5", "value_5") as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        `/path?select=*&and=(column_1.is.false,column_2.eq.value_2,column_3.in.(value_3_1,value_3_2),column_4.like.\"*value_4*\",column_5.ilike.\"*value_5*\")`
      );
    });
  });

  describe("#or()", () => {
    test("should return the expected uri", () => {
      const uri = (postgrest.or
        .is("column_1", false)
        .eq("column_2", "value_2")
        .in("column_3", ["value_3_1", "value_3_2"])
        .like("column_4", "value_4")
        .ilike("column_5", "value_5") as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        `/path?select=*&or=(column_1.is.false,column_2.eq.value_2,column_3.in.(value_3_1,value_3_2),column_4.like.\"*value_4*\",column_5.ilike.\"*value_5*\")`
      );
    });
  });
});
