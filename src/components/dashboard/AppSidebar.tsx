import {
    LayoutDashboard,
    Users,
    DollarSign,
    FileText,
    Settings,
    Menu,
    ChevronRight,
    LogOut,
    Package,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "@/hooks/auth";

const navigationItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Accounts",
        url: "/accounts",
        icon: Users,
    },
    {
        title: "Revenue",
        url: "/revenue",
        icon: DollarSign,
    },
    {
        title: "Decks",
        url: "/decks",
        icon: FileText,
    },
    {
        title: "Packages",
        url: "/packages",
        icon: Package,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    const navigate = useNavigate();

    const [user, setUser] = useState<{
        username: string;
        email: string;
    } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Sidebar className="bg-sidebar-background border-r border-sidebar-border">
            <SidebarHeader className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-dashboard-purple p-1">
                        <FileText size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold">DeckFlow</h1>
                </div>
                <SidebarTrigger>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu size={20} />
                    </Button>
                </SidebarTrigger>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                    >
                                        <Link
                                            to={item.url}
                                            className="flex items-center w-full px-3 py-2 rounded-md hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))] transition-colors"
                                        >
                                            <item.icon className="mr-2 h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="flex items-center">
                    <Avatar className="h-9 w-9 bg-dashboard-light-blue">
                        <AvatarImage src="/avatar.png" alt="User avatar" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                        <p className="text-sm font-medium">{user?.username}</p>
                        <p className="text-xs text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-sidebar-border mt-2 ml-3 rounded-full bg-dashboard-light-blue transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 text-muted-foreground hover:text-red-500 transition" />
                    </Button>
                </div>
            </SidebarFooter>

            {/* Add expand button that shows when sidebar is collapsed */}
            {isCollapsed && (
                <div className="fixed left-0 top-1/2 -translate-y-1/2 z-20">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full rounded-l-none shadow-md"
                        onClick={toggleSidebar}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </Sidebar>
    );
}
