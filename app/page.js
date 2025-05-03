import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div>
      <p className='text-center text-2xl text-gray-600 mb-5'>Don&rsquo;t have an account? <strong>Create One</strong></p>
      <form action="" className='max-w-xs mx-auto'>
        <div className="mb-3">
        <input name='username' autoComplete='off' placeholder="Username" type="text" className="input input-bordered w-full max-w-xs mb-2" />
        <input name='password' autoComplete='off' placeholder="Password" type="password" className="input input-bordered w-full max-w-xs mb-2" />
        <button className='btn btn-primary'>Create Account</button>
        </div>
      </form>
    </div>
  )
}
