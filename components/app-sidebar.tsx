import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Search, Settings, User, Target, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation";
 
export function AppSidebar() {

  const {logout} = useAuth();
  const router = useRouter();
  const handleLogout = (e: any) => {
    e.preventDefault
    logout();
    router.replace("/login");
    
  }

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Wisata",
      url: "/wisata",
      icon: Target,
    },
    {
      title: "Pengguna",
      url: "/users",
      icon: User,
    },
  
  ]

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <div>
          <a href="/" className="flex items-start space-x-2 p-2 flex-col justify-center">
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <span className="text-3xl font-bold">Si Desa</span>
          </a>
        </div>
        <SidebarGroup />
        <SidebarGroupLabel>Layanan</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <a href={item.url} >
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <SidebarGroup />

        <div onClick={(e)=>handleLogout(e)} className="bg-red-500 cursor-pointer py-2 px-3 text-white font-semibold rounded-md hover:bg-red-600 transition mx-5 flex items-center space-x-2">
            <LogOut />
            <span>Logout</span>
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}