import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

import Postgrester from "../Postgrester";
import T from "../texts";

const postgresterClient = new Postgrester({
  axiosConfig: {
    baseURL: "https://api.example.com"
  }
});

describe("Postgrester", () => {
  beforeEach(() => {
    (postgresterClient as any).reset();
  });

  test("should return the expected warning when using `baseUri` option", () => {
    new Postgrester({
      baseUri: "https://api.example.com"
    });

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(T.POSTGRESTER_DEPRECATION_BASE_URI);
  });

  test("should return the expected uri", () => {
    const uri = (postgresterClient as any).buildUri("/path", true);

    expect(uri).toStrictEqual("/path?select=*");
  });

  describe("#select()", () => {
    test("should return the expected uri", () => {
      const uri = (postgresterClient.select("aColumn").select("aResource(*)") as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=aColumn,aResource(*)");
    });
  });

  describe("#orderBy()", () => {
    test("should return the expected uri with root sorters", () => {
      const uri = (postgresterClient
        .orderBy("aColumn")
        .orderBy("anotherColumn", true) as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&order=aColumn.asc,anotherColumn.desc");
    });

    test("should return the expected uri with foreign sorters", () => {
      const uri = (postgresterClient
        .orderBy("aResource.aColumn")
        .orderBy("aResource.anotherColumn", true) as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&aResource.order=aColumn.asc,anotherColumn.desc");
    });
  });

  describe("#page()", () => {
    test("should return the expected uri with no limit", () => {
      const uri = (postgresterClient.page(0) as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&limit=10&offset=0");
    });

    test("should return the expected uri with a limit", () => {
      const uri = (postgresterClient.page(1, 5) as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&limit=5&offset=5");
    });
  });

  describe("#is()", () => {
    test("should return the expected uri", () => {
      const uri = (postgresterClient.is("aColumn", true).is("anotherColumn", null) as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=*&aColumn=is.true&anotherColumn=is.null");
    });
  });

  describe("#eq()", () => {
    test("should return the expected uri with a boolean & a null values", () => {
      const uri = (postgresterClient.eq("aColumn", true).eq("anotherColumn", null) as any).buildUri(
        "/path",
        true
      );

      expect(uri).toStrictEqual("/path?select=*&aColumn=is.true&anotherColumn=is.null");
    });

    test("should return the expected uri with a number & a string values", () => {
      const uri = (postgresterClient
        .eq("aColumn", 123)
        .eq("anotherColumn", "aValue") as any).buildUri("/path", true);

      expect(uri).toStrictEqual("/path?select=*&aColumn=eq.123&anotherColumn=eq.aValue");
    });

    test("should return the expected uri with quotes", () => {
      const uri = (postgresterClient.eq("aColumn", "aValue", true) as any).buildUri("/path", true);

      expect(uri).toStrictEqual(`/path?select=*&aColumn=eq."aValue"`);
    });
  });

  describe("#in()", () => {
    test("should return the expected uri", () => {
      const uri = (postgresterClient
        .in("aColumn", [123, 456])
        .in("anotherColumn", ["aValue", "anotherValue"]) as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        "/path?select=*&aColumn=in.(123,456)&anotherColumn=in.(aValue,anotherValue)"
      );
    });
  });

  describe("#like()", () => {
    test("should return the expected uri", () => {
      const uri = (postgresterClient
        .like("aColumn", "aValue")
        .like("anotherColumn", "anotherValue") as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        `/path?select=*&aColumn=like."*aValue*"&anotherColumn=like."*anotherValue*"`
      );
    });
  });

  describe("#ilike()", () => {
    test("should return the expected uri", () => {
      const uri = (postgresterClient
        .ilike("aColumn", "aValue")
        .ilike("anotherColumn", "anotherValue") as any).buildUri("/path", true);

      expect(uri).toStrictEqual(
        `/path?select=*&aColumn=ilike."*aValue*"&anotherColumn=ilike."*anotherValue*"`
      );
    });
  });

  describe("#not()", () => {
    test("should return the expected uri", () => {
      const uri = (postgresterClient.not
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
      const uri = (postgresterClient.and
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
      const uri = (postgresterClient.or
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

  describe("#get()", () => {
    test("should return the expected response", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        headers: {}
      });

      const { data, pagesLength } = await postgresterClient.page(0, 10).get("/path");

      expect(mockedAxios.get).toHaveBeenCalledWith("/path?select=*&limit=10&offset=0", {});

      expect(data).toEqual([]);
      expect(pagesLength).toEqual(-1);
    });

    test("should return the expected response when requiring pages length", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        headers: {
          "content-range": "0-9/1103"
        }
      });

      const { data, pagesLength } = await postgresterClient.page(0, 10).get("/path", true);

      expect(mockedAxios.get).toHaveBeenCalledWith("/path?select=*&limit=10&offset=0", {
        headers: {
          Prefer: "count=exact"
        }
      });

      expect(data).toEqual([]);
      expect(pagesLength).toEqual(111);
    });
  });

  describe("#post()", () => {
    test("should call axios.post() with the expected params", async () => {
      await postgresterClient.post("/path", {});

      expect(mockedAxios.post).toHaveBeenCalledWith("/path", {});
    });
  });

  describe("#patch()", () => {
    test("should call axios.patch() with the expected params", async () => {
      await postgresterClient.patch("/path", {});

      expect(mockedAxios.post).toHaveBeenCalledWith("/path", {});
    });
  });

  describe("#delete()", () => {
    test("should call axios.delete() with the expected params", async () => {
      await postgresterClient.delete("/path");

      expect(mockedAxios.delete).toHaveBeenCalledWith("/path");
    });
  });
});
