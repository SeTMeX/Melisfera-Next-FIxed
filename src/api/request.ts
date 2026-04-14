import { apiClient } from '@/lib/api-client';
import type { LoginDto, RegisterDto, RegisterResponse, UpdateProfileDto } from './types';

export async function Register(data: RegisterDto) {
  return apiClient.register(data);
}

export async function Login(data: LoginDto) {
  return apiClient.login(data);
}

export async function UpdateProfile(data: UpdateProfileDto) {
  return apiClient.updateProfile(data);
}

export async function DeleteAccount() {
  return apiClient.deleteAccount();
}