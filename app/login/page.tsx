'use client';

import { useFormState } from 'react-dom';
import { login } from '@/lib/actions/auth-actions';

const initialState = { error: null };

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(
      'Login form submitted, FormData:',
      new FormData(event.currentTarget)
    );
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
        <h1 className='mb-6 text-2xl font-bold text-gray-800'>Login</h1>
        <form
          action={formAction}
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          {state?.error && (
            <p className='text-sm text-red-500'>{state.error}</p>
          )}
          <button
            type='submit'
            className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
