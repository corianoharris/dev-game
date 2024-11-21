'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface BadgeType
{
    id: string
    name: string
    description: string
    level: number
}

export function BadgesList()
{
    const [badges, setBadges] = useState<BadgeType[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() =>
    {
        async function fetchBadges()
        {
            try
            {
                const response = await fetch('/api/badges')
                if (!response.ok) throw new Error('Failed to fetch badges')
                const data = await response.json()
                setBadges(data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error)
            {
                toast({
                    title: "Error",
                    description: "Failed to load badges",
                    variant: "destructive",
                })
            } finally
            {
                setLoading(false)
            }
        }

        fetchBadges()
    }, [toast])

    if (loading)
    {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">Loading badges...</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Badges Earned</CardTitle>
                <CardDescription>Your achievements and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {badges.map((badge) => (
                        <Card key={badge.id} className="p-4">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                        {badge.level}
                                    </div>
                                </div>
                                <h3 className="font-semibold">{badge.name}</h3>
                                <Badge variant="secondary">{badge.description}</Badge>
                            </div>
                        </Card>
                    ))}
                    {badges.length === 0 && (
                        <div className="text-center text-muted-foreground col-span-full p-4">
                            Complete challenges to earn badges!
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}