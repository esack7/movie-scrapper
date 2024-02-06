import { parseCookieString } from "../src/utils";

describe("Utils", () => {
  describe("parseCookieString", () => {
    describe("should parse a cookie string into a CookieInterface object", () => {
      const cookies = [
        "refresh-token=39ur9j2dj92dj3; Expires=Wed, 21 Feb 2024 03:39:19 GMT; Domain=test.com; Path=/; Secure; HttpOnly; SameSite=Lax",
        "access-token=7hd8ahw8dh8gd.g28qg82gf; Expires=Mon, 22 Jan 2024 03:42:19 GMT; Domain=test.com; Path=/; Secure; HttpOnly; SameSite=Lax",
        "csrf-token=r37h8dhefg/78asydfs/1234; Domain=test.com; Path=/; Secure; SameSite=Lax",
        "SampleCDN-Key-Pair-Id=APKAJ27JL4J435IAPVQQ; Expires=Mon, 22 Jan 2024 03:59:19 GMT; Domain=test.com; Path=/; Secure; HttpOnly; SameSite=Lax",
        "SampleCDN-Policy=dGVzdDEyMzQ_; Expires=Mon, 22 Jan 2024 03:59:19 GMT; Domain=test.com; Path=/; Secure; HttpOnly; SameSite=Lax",
        "SampleCDN-Signature=f87ahs8fdhdafa8sh_; Expires=Mon, 22 Jan 2024 03:59:19 GMT; Domain=test.com; Path=/; Secure; HttpOnly; SameSite=Lax",
        "cdn-exp=1705895959501; Expires=Mon, 22 Jan 2024 03:59:19 GMT; Domain=test.com; Path=/; Secure; SameSite=Lax",
      ];
      it("refresh-token", () => {
        //Arrange
        const cookieString = cookies[0];

        const result = {
          name: "refresh-token",
          value: "39ur9j2dj92dj3",
          expires: Date.parse("Wed, 21 Feb 2024 03:39:19 GMT"),
          domain: "test.com",
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
        };
        //Act
        const cookie = parseCookieString(cookieString);

        //Assert
        expect(cookie).toEqual(result);
      });

      it("access-token", () => {
        //Arrange
        const cookieString = cookies[1];

        const result = {
          name: "access-token",
          value: "7hd8ahw8dh8gd.g28qg82gf",
          expires: Date.parse("Mon, 22 Jan 2024 03:42:19 GMT"),
          domain: "test.com",
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
        };
        //Act
        const cookie = parseCookieString(cookieString);

        //Assert
        expect(cookie).toEqual(result);
      });

      it("csrf-token", () => {
        //Arrange
        const cookieString = cookies[2];

        const result = {
          name: "csrf-token",
          value: "r37h8dhefg/78asydfs/1234",
          domain: "test.com",
          path: "/",
          secure: true,
          sameSite: "Lax",
        };
        //Act
        const cookie = parseCookieString(cookieString);

        //Assert
        expect(cookie).toEqual(result);
      });

      it("SampleCDN-Key-Pair-Id", () => {
        //Arrange
        const cookieString = cookies[3];

        const result = {
          name: "SampleCDN-Key-Pair-Id",
          value: "APKAJ27JL4J435IAPVQQ",
          expires: Date.parse("Mon, 22 Jan 2024 03:59:19 GMT"),
          domain: "test.com",
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
        };
        //Act
        const cookie = parseCookieString(cookieString);

        //Assert
        expect(cookie).toEqual(result);
      });

      it("SampleCDN-Policy", () => {
        //Arrange
        const cookieString = cookies[4];

        const result = {
          name: "SampleCDN-Policy",
          value: "dGVzdDEyMzQ_",
          expires: Date.parse("Mon, 22 Jan 2024 03:59:19 GMT"),
          domain: "test.com",
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
        };
        //Act
        const cookie = parseCookieString(cookieString);

        //Assert
        expect(cookie).toEqual(result);
      });

      it("SampleCDN-Signature", () => {
        //Arrange
        const cookieString = cookies[5];

        const result = {
          name: "SampleCDN-Signature",
          value: "f87ahs8fdhdafa8sh_",
          expires: Date.parse("Mon, 22 Jan 2024 03:59:19 GMT"),
          domain: "test.com",
          path: "/",
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
        };
        //Act
        const cookie = parseCookieString(cookieString);

        //Assert
        expect(cookie).toEqual(result);
      });

      it("cdn-exp", () => {
        //Arrange
        const cookieString = cookies[6];

        const result = {
          name: "cdn-exp",
          value: "1705895959501",
          expires: Date.parse("Mon, 22 Jan 2024 03:59:19 GMT"),
          domain: "test.com",
          path: "/",
          secure: true,
          sameSite: "Lax",
        };
        //Act
        const cookie = parseCookieString(cookieString);

        //Assert
        expect(cookie).toEqual(result);
      });
    });
  });

  // TODO: Add more tests for other functions in utils.ts
});
