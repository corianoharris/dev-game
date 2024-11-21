'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { connectWebSocket, subscribeToLeaderboard } from '@/lib/websocket'

interface LeaderboardEntry
{
    id: string
    name: string
    points: number
    level: number
}

export default function Dashboard()
{
    const { data: session } = useSession()
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

    useEffect(() =>
    {
        connectWebSocket()
        subscribeToLeaderboard((data) =>
        {
            setLeaderboard(data)
        })
    }, [])

    const calculateLevelProgress = (points: number) =>
    {
        const pointsPerLevel = 1000
        return (points % pointsPerLevel) / pointsPerLevel * 100
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between">
                                    <span>Level {session?.user?.level}</span>
                                    <span>{session?.user?.points} points</span>
                                </div>
                                <Progress
                                    value={calculateLevelProgress(session?.user?.points || 0)}
                                    className="mt-2"
                                    aria-label="Level progress"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Recent Badges</h3>
                                {/* Badge display component */}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {leaderboard.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">{index + 1}</span>
                                        <span>{entry.name}</span>
                                    </div>
                                    <span>{entry.points} pts</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}