"use client"

import { register } from '@/actions/userController'

import React from 'react'

export default function RegisterForm() {
  return (
    <form action={ register } className='max-w-xs mx-auto'>
        <div className="mb-3">
        <input name='username' autoComplete='off' placeholder="Username" type="text" className="input input-bordered w-full max-w-xs mb-2" />
        <input name='password' autoComplete='off' placeholder="Password" type="password" className="input input-bordered w-full max-w-xs mb-2" />
        <button className='btn btn-primary'>Create Account</button>
        </div>
      </form>
  )
}
