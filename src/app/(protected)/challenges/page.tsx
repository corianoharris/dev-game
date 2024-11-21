'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Editor } from '@/components/Editor'
import { toast } from '@/hooks/use-toast'

interface Challenge
{
    id: string
    title: string
    description: string
    difficulty: string
    points: number
}

export default function ChallengesPage()
{
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
    const [code, setCode] = useState('')

    useEffect(() =>
    {
        fetchChallenges()
    }, [])

    async function fetchChallenges()
    {
        try
        {
            const response = await fetch('/api/challenges')
            const data = await response.json()
            setChallenges(data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error)
        {
            toast({
                title: 'Error',
                description: 'Failed to fetch challenges',
                variant: 'destructive',
            })
        }
    }

    async function submitSolution()
    {
        if (!selectedChallenge) return

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
                toast({
                    title: 'Success!',
                    description: 'Solution submitted successfully',
                })
            } else
            {
                throw new Error(data.message)
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error)
        {
            toast({
                title: 'Error',
                description: 'Failed to submit solution',
                variant: 'destructive',
            })
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Available Challenges</h2>
                    <div className="space-y-4">
                        {challenges.map((challenge) => (
                            <Card
                                key={challenge.id}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setSelectedChallenge(challenge)}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{challenge.title}</CardTitle>
                                        <Badge>{challenge.difficulty}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>{challenge.description}</p>
                                    <div className="mt-2">
                                        <span className="text-sm text-muted-foreground">
                                            {challenge.points} points
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {selectedChallenge && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Code Editor</h2>
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
                                    >
                                        Submit Solution
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