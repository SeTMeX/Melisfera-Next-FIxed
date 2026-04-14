import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt?: string;
}

interface UserStoreI {
  user: UserDto | null;
  setUser: (user: UserDto) => void;
  reset: () => void;
}

const useUserStore = create<UserStoreI>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      reset: () => {
        localStorage.removeItem("accessToken");
        set({ user: null });
      },
    }),
    { name: "user-store" }
  )
);

export type { UserDto };
export default useUserStore;