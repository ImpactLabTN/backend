"use client";

import { useFormState } from "react-dom";
import { register } from "@/lib/actions/auth-actions";

const initialState = { error: null };

export default function RegisterPage() {
  const [state, formAction] = useFormState(register, initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted, FormData:", new FormData(event.currentTarget));
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
        <h1 className='mb-6 text-2xl font-bold text-gray-800'>Register</h1>
        <form
          action={formAction}
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
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
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
          {state?.error && (
            <p className='text-sm text-red-500'>{state.error}</p>
          )}
          {state?.error === null && (
            <p className='text-sm text-green-500'>
              Redirecting to your dashboard...
            </p>
          )}
          <button
            type='submit'
            className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400'
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}