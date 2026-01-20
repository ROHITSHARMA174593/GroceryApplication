import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/UserDashboard";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Next JS ke ander hum backend ka code bhi hmaare route me hi likh sakte hai agar kaam chhota ho to without fetching any APIs
  await dbConnect();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if(!user) redirect('/login');

  const inComplete = !user?.mobile || !user?.role || (!user.mobile && user.role == "user");
  if(inComplete){
    return <EditRoleMobile />
  }
   const serializedUser = JSON.parse(JSON.stringify(user));

   return (
    <div>
       <Navbar user={serializedUser}/>
       {
        user.role == "admin" ? <AdminDashboard /> : user.role == "user" ? <UserDashboard /> : <DeliveryBoy />
       }
    </div>
  );
}
