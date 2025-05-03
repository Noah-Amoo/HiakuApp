import React from 'react'
import RegisterForm from '@/components/RegisterForm'

export default function page() {
  return (
    <div>
      <p className='text-center text-2xl text-gray-600 mb-5'>Don&rsquo;t have an account? <strong>Create One</strong></p>
      <RegisterForm />
    </div>
  )
}
