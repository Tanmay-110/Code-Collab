import SplitterComponent from "@/components/SplitterComponent"
import ConnectionStatusPage from "@/components/connection/ConnectionStatusPage"
import Sidebar from "@/components/sidebar/Sidebar"
import WorkSpace from "@/components/workspace"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useFullScreen from "@/hooks/useFullScreen"
import useUserActivity from "@/hooks/useUserActivity"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS, User } from "@/types/user"
import { useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { LuCode2 } from "react-icons/lu"

function EditorPage() {
    // Listen user online/offline status
    useUserActivity()
    // Enable fullscreen mode
    useFullScreen()
    const navigate = useNavigate()
    const { roomId } = useParams()
    const { status, setCurrentUser, currentUser } = useAppContext()
    const { socket } = useSocket()
    const location = useLocation()

    useEffect(() => {
        if (currentUser.username.length > 0) return
        const username = location.state?.username
        if (username === undefined) {
            navigate("/", {
                state: { roomId },
            })
        } else if (roomId) {
            const user: User = { username, roomId }
            setCurrentUser(user)
            socket.emit(SocketEvent.JOIN_REQUEST, user)
        }
    }, [
        currentUser.username,
        location.state?.username,
        navigate,
        roomId,
        setCurrentUser,
        socket,
    ])

    if (status === USER_STATUS.CONNECTION_FAILED) {
        return <ConnectionStatusPage />
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-black">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-4 top-0 h-[40rem] w-[40rem] animate-pulse-slow rounded-full bg-purple-500/10 blur-3xl opacity-30" />
                <div className="absolute -right-4 bottom-0 h-[40rem] w-[40rem] animate-pulse-slow rounded-full bg-blue-500/10 blur-3xl opacity-30" />
                <div className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-indigo-500/10 blur-3xl opacity-20" />
            </div>
            
            {/* Header */}
            <header className="relative z-10 border-b border-white/10 bg-black/50 px-4 py-2 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/5 p-2">
                            <LuCode2 className="h-6 w-6 text-purple-400" />
                        </div>
                        <h1 className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
                            Code Collab
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-1.5">
                            <span className="text-sm text-gray-400">
                                Room: <span className="font-medium text-purple-400">{roomId}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="relative flex flex-1 overflow-hidden">
                <SplitterComponent>
                    <Sidebar />
                    <WorkSpace/>
                </SplitterComponent>
            </div>
        </div>
    )
}

export default EditorPage
