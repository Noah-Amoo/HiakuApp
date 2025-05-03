"use client"

import { useFormState, useFormStatus } from 'react-dom'
import { register } from '@/actions/userController'

import React from 'react'

export default function RegisterForm() {
    const [formState, formAction] = useFormState(register, {})
    console.log('Form state:', formState)
    
  return (
    <form action={ formAction } className='max-w-xs mx-auto'>
        <div className="mb-3">
        <input name='username' autoComplete='off' placeholder="Username" type="text" className="input input-bordered w-full max-w-xs mb-2" />
        <input name='password' autoComplete='off' placeholder="Password" type="password" className="input input-bordered w-full max-w-xs mb-2" />
        <button className='btn btn-primary'>Create Account</button>
        </div>
      </form>
  )
}
