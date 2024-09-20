"use client";

import Link from "next/link";
import { RefAttributes, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Package2, Bell, LayoutDashboard, Menu, Search, CircleUser,
    ChevronDown, ChevronUp, Coins, NotepadText, LucideProps,
    Images, GalleryHorizontalEnd, Film, MessageSquareCode,
    Settings,
    UserRoundPen
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type LinkItem = {
    title: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    variant: string;
    href: string;
    heading?: string;
    hasDropdown?: boolean;
    id?: string;
    dropdownLinks?: Array<{ title: string; href: string }>;
};

const links: LinkItem[] = [
    { title: "Dashboard", icon: LayoutDashboard, variant: "ghost", href: '/' },
    { title: "Pricing", icon: Coins, variant: "ghost", href: '/pricing', heading: 'Price' },
    { title: "Request Forms", icon: NotepadText, variant: "ghost", href: '/leads/requestforms', heading: 'Leads' },
    { title: "Contact Forms", icon: NotepadText, variant: "ghost", href: '/leads/contactforms' },
    { title: "Gallery", icon: Images, variant: "ghost", href: '/gallery', heading: 'Works' },
    { title: "Albums", icon: GalleryHorizontalEnd, variant: "ghost", href: '/albums' },
    { title: "Videos", icon: Film, variant: "ghost", href: '/videos' },
    { title: "Reviews", icon: MessageSquareCode, variant: "ghost", href: '/reviews', heading: 'Reviews' },
];

const settingsLinks: LinkItem[] = [
    { title: "Profile", icon: UserRoundPen, variant: "ghost", href: '/settings/profile' },
];

export default function SideBar({ children }: { children: React.ReactNode }) {
    const { setTheme } = useTheme();
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const pathName = usePathname();

    const toggleDropdown = (id: string) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const displayedLinks = pathName.includes('/settings') ? settingsLinks : links;

    const displayTitles = pathName.includes('/settings') ? "Settings" : 'Clickershive';

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-[240px] bg-muted/40 border-r">
                <div className="flex items-center h-14 border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        {pathName.includes('/settings') ? (
                            <Settings className="h-6 w-6" />
                        ) : (
                            <Package2 className="h-6 w-6" />
                        )}
                        <span>{displayTitles}</span>
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="px-2 text-sm font-medium lg:px-4 mt-5">
                        {displayedLinks.map((item, index) => {
                            const isActive = item.href === pathName;
                            return (
                                <div key={index} className="relative mt-3">
                                    {item.heading && (
                                        <div className="mt-5 mb-3">
                                            <span className="text-xs font-semibold text-black dark:text-gray-400 uppercase">{item.heading}</span>
                                        </div>
                                    )}
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            buttonVariants({ variant: isActive ? 'default' : 'ghost', size: "sm" }),
                                            "flex items-center justify-start gap-3 w-full"
                                        )}
                                        onClick={() => {
                                            if (item.hasDropdown) {
                                                toggleDropdown(item.id!);
                                            }
                                        }}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                        {item.hasDropdown && (
                                            openDropdowns[item.id!] ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />
                                        )}
                                    </Link>
                                    {item.hasDropdown && openDropdowns[item.id!] && item.dropdownLinks && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="pl-4 mt-2 space-y-2"
                                        >
                                            {item.dropdownLinks.map((dropdownItem, dropdownIndex) => (
                                                <Link
                                                    key={dropdownIndex}
                                                    href={dropdownItem.href}
                                                    className={cn(
                                                        buttonVariants({ variant: isActive ? 'default' : 'ghost', size: "sm" }),
                                                        "flex items-center justify-start gap-3 w-full"
                                                    )}
                                                >
                                                    {dropdownItem.title}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center h-14 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                                    <Package2 className="h-6 w-6" />
                                    <span className="sr-only">ClickerShive</span>
                                </Link>
                                {displayedLinks.map((item, index) => {
                                    const isActive = item.href === pathName;
                                    return (
                                        <div key={index} className="relative">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    buttonVariants({ variant: isActive ? 'default' : 'ghost', size: "sm" }),
                                                    "flex items-center justify-start gap-3 w-full mb-5"
                                                )}
                                                onClick={() => {
                                                    if (item.hasDropdown) {
                                                        toggleDropdown(item.id!);
                                                    }
                                                }}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.title}
                                                {item.hasDropdown && (
                                                    openDropdowns[item.id!] ? <ChevronUp className="ml-auto h-5 w-5" /> : <ChevronDown className="ml-auto h-5 w-5" />
                                                )}
                                            </Link>
                                            {item.hasDropdown && openDropdowns[item.id!] && item.dropdownLinks && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="pl-6 mt-2 space-y-1"
                                                >
                                                    {item.dropdownLinks.map((dropdownItem, dropdownIndex) => (
                                                        <Link
                                                            key={dropdownIndex}
                                                            href={dropdownItem.href}
                                                            className="block text-sm text-muted-foreground hover:text-foreground mt-3"
                                                        >
                                                            {dropdownItem.title}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/4"
                                />
                            </div>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="me-3">
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={`/settings/profile`}>
                                <DropdownMenuItem>
                                    Settings
                                </DropdownMenuItem>
                            </Link>

                            <Link href={'/support'}>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                            </Link>


                            <DropdownMenuSeparator />
                            <Link href={`/auth/SignIn`}>
                                <DropdownMenuItem>
                                    Logout
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
