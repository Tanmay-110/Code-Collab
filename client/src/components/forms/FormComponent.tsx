import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, FormEvent, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { FiRefreshCw } from "react-icons/fi"

const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        setCurrentUser({ ...currentUser, roomId: uuidv4() })
        toast.success("Created a new Room ID")
        usernameRef.current?.focus()
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
    }

    const validateForm = () => {
        if (currentUser.username.trim().length === 0) {
            toast.error("Enter your username")
            return false
        } else if (currentUser.roomId.trim().length === 0) {
            toast.error("Enter a room ID")
            return false
        } else if (currentUser.roomId.trim().length < 5) {
            toast.error("Room ID must be at least 5 characters long")
            return false
        } else if (currentUser.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters long")
            return false
        }
        return true
    }

    const joinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN) return
        if (!validateForm()) return
        toast.loading("Joining room...")
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }

    useEffect(() => {
        if (currentUser.roomId.length > 0) return
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("Enter your username")
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
            socket.connect()
            return
        }

        const isRedirect = sessionStorage.getItem("redirect") || false

        if (status === USER_STATUS.JOINED && !isRedirect) {
            const username = currentUser.username
            sessionStorage.setItem("redirect", "true")
            navigate(`/editor/${currentUser.roomId}`, {
                state: {
                    username,
                },
            })
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect")
            setStatus(USER_STATUS.DISCONNECTED)
            socket.disconnect()
            socket.connect()
        }
    }, [currentUser, location.state?.redirect, navigate, setStatus, socket, status])

    return (
        <div className="w-full">
            <form onSubmit={joinRoom} className="flex w-full flex-col gap-4">
                <div className="group relative">
                    <label htmlFor="roomId" className="mb-1.5 block text-sm font-medium text-[#8b949e]">
                        Room ID
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            placeholder="Enter room ID"
                            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-[#c9d1d9] transition-colors placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:outline-none"
                            onChange={handleInputChanges}
                            value={currentUser.roomId}
                        />
                        <button
                            type="button"
                            onClick={createNewRoomId}
                            className="ml-2 flex items-center justify-center rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#c9d1d9]"
                            title="Generate new room ID"
                        >
                            <FiRefreshCw />
                        </button>
                    </div>
                </div>
                
                <div className="group relative">
                    <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-[#8b949e]">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-[#c9d1d9] transition-colors placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:outline-none"
                        onChange={handleInputChanges}
                        value={currentUser.username}
                        ref={usernameRef}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-[#238636] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2ea043] focus:outline-none focus:ring-2 focus:ring-[#238636] focus:ring-offset-2 focus:ring-offset-[#0d1117]"
                >
                    Join Session
                </button>
            </form>
        </div>
    )
}

export default FormComponent
