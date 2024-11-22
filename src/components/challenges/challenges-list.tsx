'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Editor } from '@/components/Editor'
import { toast } from 'react-toastify'

interface Challenge
{
    id: string
    title: string
    description: string
    difficulty: string
    points: number
    completionRate: number
    isCompleted: boolean
    attempts: number
}

export function ChallengesList()
{
    // const { toast } = useToast()
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
    const [code, setCode] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false) // New loading state

    useEffect(() =>
    {
        async function fetchChallenges()
        {
            try
            {
                const response = await fetch('/api/challenges')
                if (!response.ok) throw new Error('Failed to fetch challenges')
                const data = await response.json()
                setChallenges(data)
            } catch (error)
            {
                console.error('Failed to fetch challenges:', error)
                toast.error('Failed to load challenges!', {
                    position: 'bottom-left',  // Pass position as a string
                  })

            } finally
            {
                setLoading(false)
            }
        }

        fetchChallenges()
    }, [])

  
    const getDifficultyColor = (difficulty: string) =>
    {
        switch (difficulty.toLowerCase())
        {
            case 'easy': return 'bg-green-500'
            case 'medium': return 'bg-yellow-500'
            case 'hard': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const handleStartChallenge = (challenge: Challenge) =>
    {
        setSelectedChallenge(challenge)
    }

    const submitSolution = async () =>
    {
        if (!selectedChallenge) return

        setIsSubmitting(true) // Start loading state
        try
        {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challengeId: selectedChallenge.id,
                    code,
                }),
            })
            const data = await response.json()

            if (response.ok)
            {
                toast.success('Solution submitted successfully! We will evaluate it soon', {
                    position: 'bottom-left',  // Pass position as a string
                  })


                setSelectedChallenge(null)
                setCode('')
            } else
            {
                throw new Error(data.message)
            }
    
        } catch (error)
        {
            console.error('Failed to submit solution:', error)
            toast.error('Failed to load challenges!', {
                position: 'bottom-left',  // Pass position as a string
              })

        } finally
        {
            setIsSubmitting(false) // End loading state
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
        <div className="container mx-auto py-8">
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Available Challenges</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Test your skills with these challenges</CardTitle>
                            <CardDescription>Click on a challenge to view details and submit a solution</CardDescription>
                            <CardDescription>Editor will be on the right side when you click on a challenge</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {challenges.map((challenge) => (
                                    <Card
                                        key={challenge.id}
                                        className="cursor-pointer hover:shadow-lg transition-shadow p-4"
                                        onClick={() => handleStartChallenge(challenge)}
                                    >
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
                                                <Badge variant="secondary">{challenge.points} points</Badge>
                                                {challenge.attempts > 0 && (
                                                    <span className="text-sm text-muted-foreground">
                                                        Attempts: {challenge.attempts}
                                                    </span>
                                                )}
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
                </div>

                {selectedChallenge && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{selectedChallenge.title}</h2>
                        <Card>
                            <CardContent className="p-0">
                                <Editor
                                    value={code}
                                    onChange={(value) => setCode(value)}
                                    language="javascript"
                                    height="400px"
                                />
                                <div className="p-4">
                                    <Button
                                        onClick={submitSolution}
                                        className="w-full"
                                        disabled={isSubmitting} // Disable button during loading
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
