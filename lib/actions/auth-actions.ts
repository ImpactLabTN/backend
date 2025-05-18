'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createUser, findUserByEmail, verifyPassword } from '@/lib/models/user';

export async function login(state: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    console.error('Invalid formData in login:', formData);
    return { error: 'Invalid form data' };
  }

  console.log('Login FormData entries:', Object.fromEntries(formData));

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const isPasswordValid = await verifyPassword(user, password);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password' };
  }

  const { password: _, ...userWithoutPassword } = user;

  cookies().set(
    'user',
    JSON.stringify({
      ...userWithoutPassword,
      id: user._id!.toString(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
    }
  );

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/rooms');
  }
}

export async function register(state: any, formData: FormData) {
  if (!(formData instanceof FormData)) {
    console.error('Invalid formData in register:', formData);
    return { error: 'Invalid form data' };
  }

  console.log('Register FormData entries:', Object.fromEntries(formData));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!name || !email || !password || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Invalid email format' };
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return { error: 'Email already in use' };
  }

  let user;
  try {
    user = await createUser({
      name,
      email,
      password,
      role: 'client',
      status: 'active',
    });
    console.log('User created successfully:', { name, email });
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to create user. Please try again.' };
  }

  const { password: _, ...userWithoutPassword } = user;

  cookies().set(
    'user',
    JSON.stringify({
      ...userWithoutPassword,
      id: user._id!.toString(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
    }
  );

  console.log('User signed in, initiating redirect based on role:', user.role);
  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/rooms');
  }
}

export async function logout() {
  cookies().delete('user');
  redirect('/');
}

export async function getCurrentUser() {
  const userCookie = cookies().get('user');
  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}
