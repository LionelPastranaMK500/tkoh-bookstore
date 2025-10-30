// src/features/auth/interface/LoginResponse.ts
export interface LoginResponse {
  token: string;
  tokenType?: string; // Como en TokenResponse.java
}
