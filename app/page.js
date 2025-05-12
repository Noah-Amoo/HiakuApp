import React from 'react'
import RegisterForm from '@/components/RegisterForm'
import getUserFromCookie from '@/lib/getUser'
import Dashboard from '@/components/Dashboard'

export default async function page() {
  const user = await getUserFromCookie();
  console.log("User from cookie:", user)

  return (
    <div>
      {user && <Dashboard user={user} />}
      {!user && (
        <div>
          <p className="text-center text-2xl text-gray-600 mb-5">
            Don&rsquo;t have an account? <strong>Create One</strong>
          </p>
          <RegisterForm />
        </div>
      )}
    </div>
  );
}
