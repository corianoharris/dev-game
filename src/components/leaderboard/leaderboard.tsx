'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LeaderboardEntry
{
    id: string
    name: string
    points: number
    level: number
    rank?: number
}

export function Leaderboard()
{
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>
    {
        async function fetchLeaderboard()
        {
            try
            {
                const response = await fetch('/api/leaderboard')
                const data = await response.json()

                // Add rank to each entry
                const rankedData = data.map((entry: LeaderboardEntry, index: number) => ({
                    ...entry,
                    rank: index + 1
                }))

                setLeaderboard(rankedData)
            } catch (error)
            {
                console.error('Failed to fetch leaderboard:', error)
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
                    <div className="text-center p-4">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {leaderboard.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl font-bold text-muted-foreground w-8">
                                        #{entry.rank}
                                    </span>
                                    <Avatar>
                                        <AvatarFallback>
                                            {entry.name?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{entry.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Level {entry.level}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="ml-auto">
                                    {entry.points} points
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