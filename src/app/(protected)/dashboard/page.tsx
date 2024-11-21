'use client'

import { useSession } from 'next-auth/react'
import { Leaderboard } from '@/components/leaderboard/leaderboard'
import { BadgesList } from '@/components/badges/badges-list'
import { ChallengesList } from '@/components/challenges/challenges-list'

export default function DashboardPage()
{
    const { data: session } = useSession()

    return (
        <>
            <main className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Welcome back, {session?.user?.name}!
                </h1>

                <div className="grid gap-8 md:grid-cols-2">
                    <Leaderboard />
                    <BadgesList />
                </div>

                <div className="mt-8">
                    <ChallengesList />
                </div>
            </main>
        </>
    )
}