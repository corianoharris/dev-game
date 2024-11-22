'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'

export default function LoginPage()
{
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try
        {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/dashboard'
            })

            if (result?.error)
            {

                toast.error('Invalid email or password. Please try again!', {
                    position: 'top-left',  // Pass position as a string
                })

                return
            }

            if (result?.ok)
            {
                toast.success('Logged in successfully!', {
                    position: 'top-left',  // Pass position as a string
                })
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error)
        {
            console.error('Login error:', error)
            toast.error('Failed to log in. Please try again!', {
                position: 'top-left',  // Pass position as a string
            })
        } finally
        {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Login</h1>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue="test@test.com"
                                autoComplete="email"
                                required
                                aria-label="Email address"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                defaultValue="password123"
                                autoComplete="current-password"
                                required
                                aria-label="Password"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                            aria-label="Sign in"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}