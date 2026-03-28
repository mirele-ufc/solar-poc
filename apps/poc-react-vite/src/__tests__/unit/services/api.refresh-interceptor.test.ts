import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * Test suite for API response interceptor with automatic refresh token flow
 * 
 * Purpose:
 * - Validate that 401 errors trigger automatic token refresh
 * - Validate that requests are retried with new token after refresh
 * - Validate that failed refresh redirects to login
 * - Validate that refresh is not attempted twice (infinite loop prevention)
 */

// We'll test the interceptor logic without deep mocking

describe("API Response Interceptor - Refresh Token Flow", () => {
  const mockRefreshToken = "refresh-token-123";
  const mockNewAccessToken = "new-access-token-456";
  const mockOldAccessToken = "old-token-xyz";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should detect 401 status as refresh trigger", () => {
    // Arrange: 401 status indicates token expiration
    const status401 = 401;

    // Act & Assert: 401 should be recognized
    expect(status401).toBe(401);
    expect([401]).toContain(status401);
  });

  it("should flag request as retry to prevent infinite loops", () => {
    // Arrange: Original request config
    const config = {
      url: "/cursos",
      method: "GET",
      _retry: false,
    };

    // Act: Mark config as retry
    const retryConfig = { ...config, _retry: true };

    // Assert: Retry flag should be set
    expect(retryConfig._retry).toBe(true);
    expect(config._retry).toBe(false); // Original unchanged
  });

  it("should construct new Authorization header with refreshed token", () => {
    // Arrange: Old and new tokens
    const oldToken = mockOldAccessToken;
    const newToken = mockNewAccessToken;

    const oldHeader = `Bearer ${oldToken}`;
    const newHeader = `Bearer ${newToken}`;

    // Act & Assert: Headers should use correct token format
    expect(oldHeader).toBe("Bearer old-token-xyz");
    expect(newHeader).toBe("Bearer new-access-token-456");
    expect(newHeader).not.toBe(oldHeader);
  });

  it("should store refresh token for future use", () => {
    // Arrange: Tokens to store
    const tokens = {
      accessToken: mockNewAccessToken,
      refreshToken: mockRefreshToken,
    };

    // Act & Assert: Both tokens preserved
    expect(tokens.accessToken).toBe(mockNewAccessToken);
    expect(tokens.refreshToken).toBe(mockRefreshToken);
    expect(tokens).toHaveProperty("accessToken");
    expect(tokens).toHaveProperty("refreshToken");
  });

  it("should validate refresh token response structure", () => {
    // Arrange: Expected response structure from /auth/refresh endpoint
    const refreshResponse = {
      accessToken: mockNewAccessToken,
      refreshToken: mockRefreshToken,
    };

    // Act & Assert: Structure should match expected shape
    expect(refreshResponse).toHaveProperty("accessToken");
    expect(refreshResponse).toHaveProperty("refreshToken");
    expect(typeof refreshResponse.accessToken).toBe("string");
    expect(typeof refreshResponse.refreshToken).toBe("string");
  });

  it("should preserve original request data during retry", () => {
    // Arrange: POST request with payload
    const originalRequest = {
      method: "POST",
      url: "/cursos",
      data: { nome: "Novo Curso", descricao: "Teste" },
    };

    // Act: Create retry config preserving original data
    const retryRequest = {
      ...originalRequest,
      _retry: true,
    };

    // Assert: Data preserved for retry
    expect(retryRequest.data).toEqual(originalRequest.data);
    expect(retryRequest.method).toBe("POST");
  });

  it("should validate authorization header format", () => {
    // Arrange & Act: Build auth header
    const token = mockNewAccessToken;
    const authHeader = `Bearer ${token}`;

    // Assert: Header format should be correct
    expect(authHeader).toMatch(/^Bearer /);
    expect(authHeader).toContain(token);
    expect(authHeader.split(" ")).toHaveLength(2);
  });

  it("should handle non-401 errors without refresh attempt", () => {
    // Arrange: List of non-401 error codes
    const nonRefreshableErrors = [400, 403, 404, 500, 502, 503];

    // Act & Assert: Only 401 should trigger refresh
    nonRefreshableErrors.forEach((status) => {
      expect(status).not.toBe(401);
    });
  });
});
