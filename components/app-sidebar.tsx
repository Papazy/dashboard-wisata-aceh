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
import { Calendar, Home, Inbox, Search, Settings, User, Target } from "lucide-react"
 
export function AppSidebar() {

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
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}