import { useFileSystem } from "@/context/FileContext"
import useResponsive from "@/hooks/useResponsive"
import cn from "classnames"
import Editor from "./Editor"
import FileTab from "./FileTab"

function EditorComponent() {
    const { openFiles } = useFileSystem()
    const { minHeightReached } = useResponsive()

    if (openFiles.length <= 0) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-800 p-8">
                <div className="mb-4 text-gray-400">
                    <svg
                        className="h-16 w-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-300">
                    No file is currently open
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                    Open a file to start editing
                </p>
            </div>
        )
    }

    return (
        <main
            className={cn(
                "flex w-full flex-col overflow-x-auto bg-gray-800 md:h-screen",
                {
                    "h-[calc(100vh-50px)]": !minHeightReached,
                    "h-full": minHeightReached,
                }
            )}
        >
            <div className="border-b border-gray-700 bg-gray-800">
                <FileTab />
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor />
            </div>
        </main>
    )
}

export default EditorComponent
