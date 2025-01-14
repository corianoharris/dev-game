'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import
{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'react-toastify'



export function Navbar()
{
    const [isPointsAdded, setIsPointsAdded] = useState(false)
    const [isNewLevel, setIsNewLevel] = useState(false)
    const { data: session } = useSession()
   


    const handleSignOut = async () =>
    {
        await signOut({
            callbackUrl: '/login',
            redirect: true,
        }).then(() =>
        {
            toast.success('Logged out successfully. Hope you come back soon!', {
                position: 'top-left',  // Pass position as a string
              })
        })
    }

    useEffect(() =>
    {
        if (isPointsAdded)
        {
          
            toast.success('Points added successfully. Congratulations!', {
                position: 'top-left',  // Pass position as a string
              })

            setIsPointsAdded(false)
        }

        if (isNewLevel)
        {
            toast.success('New level unlocked. Congratulations!', {
                position: 'top-left',  // Pass position as a string
              })
            setIsNewLevel(false)
        }
    }, [isPointsAdded, isNewLevel])

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center px-4 justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="font-bold text-xl">
                        DevGame
                    </Link>
                </div>

                {session?.user && (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                Points: {
                                    session.user.points || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Level: {session.user.level || 1}
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {session.user.name?.substring(0, 2).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 cursor-pointer"
                                    onClick={handleSignOut}
                                >
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </nav>
    )
}