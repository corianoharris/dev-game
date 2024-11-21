import { io, Socket } from 'socket.io-client'

let socket: Socket

export const initializeWebSocket = () =>
{
    if (!socket)
    {
        socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
            autoConnect: false,
            withCredentials: true,
        })

        socket.on('connect', () =>
        {
            console.log('WebSocket connected')
        })

        socket.on('disconnect', () =>
        {
            console.log('WebSocket disconnected')
        })

        socket.on('error', (error) =>
        {
            console.error('WebSocket error:', error)
        })
    }
    return socket
}

export const connectWebSocket = () =>
{
    const socket = initializeWebSocket()
    if (!socket.connected)
    {
        socket.connect()
    }
}

export const disconnectWebSocket = () =>
{
    if (socket?.connected)
    {
        socket.disconnect()
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subscribeToLeaderboard = (callback: (data: any) => void) =>
{
    socket.on('leaderboard-update', callback)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unsubscribeFromLeaderboard = (callback: (data: any) => void) =>
{
    socket.off('leaderboard-update', callback)
}