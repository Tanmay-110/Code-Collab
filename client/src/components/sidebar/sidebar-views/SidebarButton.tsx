import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS, ViewType } from "./index"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { tooltipStyles } from "../tooltipStyles"
import cn from "classnames"

interface ViewButtonProps {
    viewName: ViewType
    icon: JSX.Element
}

const ViewButton = ({ viewName, icon }: ViewButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } =
        useViews()
    const { isNewMessage } = useChatRoom()
    const [showTooltip, setShowTooltip] = useState(true)

    const handleViewClick = (viewName: ViewType) => {
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    const isActive = activeView === viewName

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={() => handleViewClick(viewName)}
                onMouseEnter={() => setShowTooltip(true)}
                className={cn(
                    "flex items-center justify-center rounded-lg p-2.5 transition-all duration-200 ease-in-out",
                    {
                        "bg-white/10 text-primary shadow-lg": isActive,
                        "text-text-secondary hover:bg-white/5 hover:text-text": !isActive,
                    }
                )}
                {...(showTooltip && {
                    "data-tooltip-id": `tooltip-${String(viewName)}`,
                    "data-tooltip-content": String(viewName),
                })}
            >
                <div className="flex items-center justify-center">{icon}</div>
                {/* Show dot for new message in chat View Button */}
                {viewName === "CHATS" && isNewMessage && (
                    <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"></div>
                )}
            </button>
            {/* render the tooltip */}
            {showTooltip && (
                <Tooltip
                    id={`tooltip-${String(viewName)}`}
                    place="right"
                    offset={15}
                    className="!z-50"
                    style={tooltipStyles}
                    noArrow={false}
                    positionStrategy="fixed"
                    float={true}
                />
            )}
        </div>
    )
}

export default ViewButton
