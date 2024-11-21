import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                points: true,
                level: true,
            },
            orderBy: {
                points: 'desc'
            },
            take: 10
        })

        const leaderboard = users.map((user, index) => ({
            ...user,
            rank: index + 1
        }))

        return NextResponse.json(leaderboard)
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard' },
            { status: 500 }
        )
    }
}

// Add logging to help debug
console.log('Leaderboard API route loaded')