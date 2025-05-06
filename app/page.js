import React from 'react'
import RegisterForm from '@/components/RegisterForm'
import getUserFromCookie from '@/lib/getUser'

export default async function page() {
  const user = await getUserFromCookie()
  return (
    <div>
      {user && (
        <p>Welcome, you are logged in</p>
      )}
      {!user && (
      <div>
        <p className='text-center text-2xl text-gray-600 mb-5'>Don&rsquo;t have an account? <strong>Create One</strong></p>
        <RegisterForm />
      </div>
      )}
    </div>
  )
}
