import React from 'react'
import HaikuForm from '@/components/HaikuForm'

export default function page(props) {
  return (
    <div>
      <h2 className='text-center text-4xl text-gray-600 mb-5'>Edit Post</h2>
      <HaikuForm />
    </div>
  )
}
