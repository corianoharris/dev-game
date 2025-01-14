'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from 'react-toastify'
import { Skeleton } from "@/components/ui/skeleton"

interface LeaderboardEntry
{
    id: string
    name: string | null
    points: number
    level: number
    rank: number
}

export function Leaderboard()
{
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>
    {
        async function fetchLeaderboard()
        {
            try {
                console.log('Fetching leaderboard...') // Debug log
                const response = await fetch('/api/leaderboard', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                console.log('Leaderboard data:', data) // Debug log
                setLeaderboard(data)
            } catch (error)
            {
                console.error('Failed to fetch leaderboard:', error)
                toast.error('Failed to load leaderboard. Please try again later.', {                                      
                    position: 'bottom-left',  // Pass position as a string
                })    
            } finally
            {
                setLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>Top performing developers</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4 h-64 overflow-y-scroll">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 h-64 overflow-y-scroll">
                        {leaderboard.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg first:bg-indigo-200 first:text-indigo-900 font-bold"
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl font-bold text-muted-foreground w-8">
                                        #{entry.rank}
                                    </span>
                                    <Avatar>
                                        <AvatarFallback>
                                            {entry.name?.substring(0, 2).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{entry.name || 'Anonymous'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Level {entry.level}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="ml-auto first:text-indigo-500 font-bold">
                                    {entry.points.toLocaleString()} points
                                </Badge>
                            </div>
                        ))}
                        {leaderboard.length === 0 && (
                            <div className="text-center text-muted-foreground p-4">
                                No entries yet
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}