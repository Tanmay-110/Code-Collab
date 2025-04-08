import FormComponent from "@/components/forms/FormComponent"

function HomePage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0d1117]">
            {/* Logo in top left */}
            <div className="absolute left-6 top-6">
                <h1 className="text-3xl font-bold text-white">
                    <span className="text-[#58a6ff]">Code</span>Collab
                </h1>
            </div>
            
            {/* Main content */}
            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <div className="w-full max-w-md rounded-lg border border-[#30363d] bg-[#161b22] p-8 shadow-xl">
                    <h2 className="mb-6 text-center text-2xl font-bold text-[#c9d1d9]">
                        Join Collaboration Session
                    </h2>
                    <p className="mb-8 text-center text-[#8b949e]">
                        Enter a room ID and your username to start coding together in real-time
                    </p>
                    <FormComponent />
                </div>
            </div>
        </div>
    )
}

export default HomePage
