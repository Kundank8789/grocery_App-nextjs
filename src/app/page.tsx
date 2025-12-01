import { auth } from '@/auth';
import EditRoleMobile from '@/components/EditRoleMobile';
import Nav from '@/components/Nav';
import connectdb from '@/lib/db'
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import React from 'react'

async function Home() {
  await connectdb();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect('/login');
  }
  const inComplete = !user.mobile || !user.role ;
  if (inComplete) {
    return <EditRoleMobile />
  }

  const plainUser=JSON.parse(JSON.stringify(user))
    return (
      <>
        <Nav user={plainUser}/>
      </>
    )
  }

export default Home