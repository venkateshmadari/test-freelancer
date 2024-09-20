import { Separator } from '@/components/ui/separator'
import React from 'react'
import ImageForm from './components/ImageForm/page'
import EmailForm from './components/EmailForm/page'
import PasswordForm from './components/PasswordForm/page'
import IntegratedForm from './components/IntegratedForm/page'

const Profile = () => {
  return (
    <div>
      <div>
        <h3 className="text-2xl font-semibold">Profile</h3>
        <p className="text-md text-muted-foreground mt-3">
          Real-time information and activites of your property
        </p>
      </div>
      <div className='mt-5'>
        <Separator />
      </div>

      <div className='mt-5'>
           <ImageForm />
      </div>


      <div className='mt-5'>
          <EmailForm />
      </div>

      <div className='mt-5'>
          <PasswordForm />
      </div>

      <div className='mt-5'>
          <IntegratedForm />
      </div>
       
    </div>
  )
}

export default Profile
