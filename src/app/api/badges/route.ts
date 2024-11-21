import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            include: {
                badges: true
            }
        })

        return NextResponse.json(user?.badges || [])
    } catch (error) {
        console.error('Failed to fetch badges:', error)
        return NextResponse.json(
            { error: 'Failed to fetch badges' },
            { status: 500 }
        )
    }
}