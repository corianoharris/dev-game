'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface Challenge {
    id: string
    title: string
    description: string
    difficulty: string
    points: number
    completionRate: number
    isCompleted: boolean
    attempts: number
}

export function ChallengesList() {
    const router = useRouter()
    const { toast } = useToast()
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)

    useEffect(() => {
        async function fetchChallenges() {
            try {
                const response = await fetch('/api/challenges')
                if (!response.ok) throw new Error('Failed to fetch challenges')
                const data = await response.json()
                setChallenges(data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load challenges",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchChallenges()
    }, [toast])

    const getDifficultyColor = (difficulty: string) =>
    {
        switch (difficulty.toLowerCase())
        {
            case 'easy':
                return 'bg-green-500'
            case 'medium':
                return 'bg-yellow-500'
            case 'hard':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    const handleStartChallenge = async (challengeId: string) =>
    {
        try
        {
            setSelectedChallenge(challengeId)
            router.push(`/challenges/${challengeId}`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error)
        {
            toast({
                title: "Error",
                description: "Failed to start challenge",
                variant: "destructive",
            })
            setSelectedChallenge(null)
        }
    }

    if (loading)
    {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">Loading challenges...</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Available Challenges</CardTitle>
                <CardDescription>Test your skills with these challenges</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {challenges.map((challenge) => (
                        <Card key={challenge.id} className="p-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{challenge.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                                            {challenge.difficulty}
                                        </Badge>
                                        {challenge.isCompleted && (
                                            <Badge variant="secondary">Completed</Badge>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {challenge.description}
                                </p>
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">
                                        Completion Rate ({challenge.completionRate.toFixed(1)}%)
                                    </div>
                                    <Progress value={challenge.completionRate} />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{challenge.points} points</Badge>
                                        {challenge.attempts > 0 && (
                                            <span className="text-sm text-muted-foreground">
                                                Attempts: {challenge.attempts}
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleStartChallenge(challenge.id)}
                                        disabled={selectedChallenge === challenge.id}
                                    >
                                        {selectedChallenge === challenge.id ? 'Starting...' :
                                            challenge.isCompleted ? 'Try Again' : 'Start Challenge'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {challenges.length === 0 && (
                        <div className="text-center text-muted-foreground p-4">
                            No challenges available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}