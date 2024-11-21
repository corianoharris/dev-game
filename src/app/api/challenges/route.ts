import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET()
{
    try
    {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id)
        {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get challenges with submission counts and user's submissions
        const challenges = await prisma.challenge.findMany({
            include: {
                _count: {
                    select: {
                        submissions: true
                    }
                },
                submissions: {
                    where: {
                        userId: session.user.id
                    },
                    select: {
                        status: true
                    }
                }
            }
        })

        // Calculate completion rates and user progress
        const challengesWithStats = challenges.map(challenge =>
        {
            const totalSubmissions = challenge._count.submissions
            const userSubmissions = challenge.submissions
            const completionRate = totalSubmissions > 0
                ? (challenge.submissions.filter(s => s.status === 'COMPLETED').length / totalSubmissions) * 100
                : 0

            return {
                id: challenge.id,
                title: challenge.title,
                description: challenge.description,
                difficulty: challenge.difficulty,
                points: challenge.points,
                completionRate,
                isCompleted: userSubmissions.some(s => s.status === 'COMPLETED'),
                attempts: userSubmissions.length
            }
        })

        return NextResponse.json(challengesWithStats)
    } catch (error)
    {
        console.error('Failed to fetch challenges:', error)
        return NextResponse.json(
            { error: 'Failed to fetch challenges' },
            { status: 500 }
        )
    }
}