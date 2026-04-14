export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export type LoginDto = Pick<RegisterDto, "email" | "password">;