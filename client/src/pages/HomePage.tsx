import FormComponent from "@/components/forms/FormComponent"
import { LuCode2, LuUsers, LuMessageSquare, LuPencil } from "react-icons/lu"

function HomePage() {
    return (
        <div className="h-screen w-full overflow-hidden bg-black">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-4 top-0 h-[40rem] w-[40rem] animate-pulse-slow rounded-full bg-purple-500/10 blur-3xl opacity-30" />
                <div className="absolute -right-4 bottom-0 h-[40rem] w-[40rem] animate-pulse-slow rounded-full bg-blue-500/10 blur-3xl opacity-30" />
                <div className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-indigo-500/10 blur-3xl opacity-20" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <div className="mb-6 flex items-center justify-center gap-4">
                            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
                                <LuCode2 className="h-12 w-12 text-purple-400" />
                            </div>
                            <h1 className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-5xl font-bold text-transparent">
                                Code Collab
                            </h1>
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-gray-400">
                            A real-time collaborative coding environment where teams can code, chat, and create together seamlessly.
                        </p>
                    </div>

                    {/* Main Form */}
                    <div className="mb-12">
                        <div className="mx-auto max-w-md glass-panel animate-slide-up rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                            <FormComponent />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="glass-panel group rounded-2xl border border-white/10 bg-black/50 p-6 transition-all duration-300 hover:bg-white/5 hover:shadow-lg backdrop-blur-xl">
                            <div className="mb-4 inline-block rounded-xl bg-purple-500/10 p-3 text-purple-400 group-hover:bg-purple-500/20">
                                <LuUsers className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">Real-time Collaboration</h3>
                            <p className="text-gray-400">Code together with your team in real-time with seamless synchronization.</p>
                        </div>
                        <div className="glass-panel group rounded-2xl border border-white/10 bg-black/50 p-6 transition-all duration-300 hover:bg-white/5 hover:shadow-lg backdrop-blur-xl">
                            <div className="mb-4 inline-block rounded-xl bg-indigo-500/10 p-3 text-indigo-400 group-hover:bg-indigo-500/20">
                                <LuMessageSquare className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">Live Chat</h3>
                            <p className="text-gray-400">Communicate with your team instantly while coding using the built-in chat.</p>
                        </div>
                        <div className="glass-panel group rounded-2xl border border-white/10 bg-black/50 p-6 transition-all duration-300 hover:bg-white/5 hover:shadow-lg backdrop-blur-xl">
                            <div className="mb-4 inline-block rounded-xl bg-blue-500/10 p-3 text-blue-400 group-hover:bg-blue-500/20">
                                <LuPencil className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">Drawing Board</h3>
                            <p className="text-gray-400">Visualize ideas and explain concepts using the collaborative drawing tool.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
