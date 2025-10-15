import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./jwt";
import { randomUUID } from "crypto";
import { UserNotAuthenticatedErr } from "../api/errors";

describe("Jwt", () => {
  const userID = randomUUID();
  const userID2 = randomUUID();
  let token: string;
  let token2: string;
  let secret = "soSecret";
  let wrongSecret = "wrongSecret";

  beforeAll(() => {
    token = makeJWT(userID, 5000, secret);
    token2 = makeJWT(userID2, 5000, secret);
  });

  it("should validate a valid token", () => {
    const result = validateJWT(token, secret);
    const result2 = validateJWT(token2, secret);
    expect(result).toBe(userID);
    expect(result2).toBe(userID2);
  });

  it("should throw an error for an invalid token", () => {
    expect(() => validateJWT("not_a_valid_token", secret)).toThrow(
      UserNotAuthenticatedErr
    );
  });
  it("should throw an error when the token is signed with a wrong secret", () => {
    expect(() => validateJWT(token2, wrongSecret)).toThrow(
      UserNotAuthenticatedErr
    );
  });
});
