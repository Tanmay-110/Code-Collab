import { useFileSystem } from "@/context/FileContext"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import { IoClose } from "react-icons/io5"
import cn from "classnames"
import { useEffect, useRef } from "react"
import customMapping from "@/utils/customMapping"
import { useSettings } from "@/context/SettingContext"
import langMap from "lang-map"

function FileTab() {
    const {
        openFiles,
        closeFile,
        activeFile,
        updateFileContent,
        setActiveFile,
    } = useFileSystem()
    const fileTabRef = useRef<HTMLDivElement>(null)
    const { setLanguage } = useSettings()

    const changeActiveFile = (fileId: string) => {
        // If the file is already active, do nothing
        if (activeFile?.id === fileId) return

        updateFileContent(activeFile?.id || "", activeFile?.content || "")

        const file = openFiles.find((file) => file.id === fileId)
        if (file) {
            setActiveFile(file)
        }
    }

    useEffect(() => {
        const fileTabNode = fileTabRef.current
        if (!fileTabNode) return

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                fileTabNode.scrollLeft += 100
            } else {
                fileTabNode.scrollLeft -= 100
            }
        }

        fileTabNode.addEventListener("wheel", handleWheel)

        return () => {
            fileTabNode.removeEventListener("wheel", handleWheel)
        }
    }, [])

    // Update the editor language when a file is opened
    useEffect(() => {
        if (activeFile?.name === undefined) return
        // Get file extension on file open and set language when file is opened
        const extension = activeFile.name.split(".").pop()
        if (!extension) return

        // Check if custom mapping exists
        if (customMapping[extension]) {
            setLanguage(customMapping[extension])
            return
        }

        const language = langMap.languages(extension)
        setLanguage(language[0])
    }, [activeFile?.name, setLanguage])

    return (
        <div
            className="flex h-[50px] w-full select-none gap-1 overflow-x-auto bg-[#0d1117] px-2 pt-2"
            ref={fileTabRef}
        >
            {openFiles.map((file) => (
                <div
                    key={file.id}
                    className={cn(
                        "group flex w-fit cursor-pointer items-center rounded-t-md border border-b-0 px-3 py-1.5 transition-all duration-200",
                        {
                            "border-[#30363d] bg-[#161b22]": file.id === activeFile?.id,
                            "border-transparent hover:border-[#30363d] hover:bg-[#161b22]/50": file.id !== activeFile?.id,
                        }
                    )}
                    onClick={() => changeActiveFile(file.id)}
                >
                    <Icon
                        icon={getIconClassName(file.name)}
                        fontSize={18}
                        className={cn("mr-2 min-w-fit transition-colors duration-200", {
                            "text-[#58a6ff]": file.id === activeFile?.id,
                            "text-[#8b949e] group-hover:text-[#c9d1d9]": file.id !== activeFile?.id,
                        })}
                    />
                    <p
                        className={cn("flex-grow cursor-pointer overflow-hidden truncate text-sm transition-colors duration-200", {
                            "text-[#c9d1d9]": file.id === activeFile?.id,
                            "text-[#8b949e] group-hover:text-[#c9d1d9]": file.id !== activeFile?.id,
                        })}
                        title={file.name}
                    >
                        {file.name}
                    </p>
                    <IoClose
                        className={cn("ml-2 inline rounded-md p-0.5 transition-colors duration-200", {
                            "text-[#8b949e] hover:bg-[#30363d] hover:text-[#c9d1d9]": file.id === activeFile?.id,
                            "text-[#6e7681] hover:bg-[#30363d] hover:text-[#c9d1d9]": file.id !== activeFile?.id,
                        })}
                        size={18}
                        onClick={(e) => {
                            e.stopPropagation()
                            closeFile(file.id)
                        }}
                    />
                </div>
            ))}
        </div>
    )
}

export default FileTab
