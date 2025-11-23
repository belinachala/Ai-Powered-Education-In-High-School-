// src/api.ts
export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    user_type: string;
  };
  message?: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const res = await fetch('http://127.0.0.1:8001/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message || 'Login failed' };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: 'Network error. Please check your backend.' };
  }
};
