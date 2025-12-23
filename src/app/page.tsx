import { auth } from '@/auth';
import AdminDashboard from '@/components/AdminDashboard';
import DeleveryBoy from '@/components/DeleveryBoy';
import EditRoleMobile from '@/components/EditRoleMobile';
import GeoUpdater from '@/components/GeoUpdater';
import Nav from '@/components/Nav';
import UserDashboard from '@/components/UserDashboard';
import connectdb from '@/lib/db'
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import React, { user } from 'react'

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
        <GeoUpdater userId={plainUser._id}/>
        {user.role=="user"?(
          <UserDashboard/>
        ):user.role=="admin"?(
           <AdminDashboard/>
        ):<DeleveryBoy/>}
      </>
    )
  }

export default Home