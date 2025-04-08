import useResponsive from "@/hooks/useResponsive"
import EditorComponent from "../editor/EditorComponent"

function WorkSpace() {
    const { viewHeight } = useResponsive()

    return (
        <div
            className="absolute left-0 top-0 w-full max-w-full flex-grow overflow-x-hidden bg-[#0d1117] md:static"
            style={{ height: viewHeight }}
        >
            <div className="h-full w-full rounded-lg border border-[#30363d] bg-[#0d1117] shadow-lg">
                <EditorComponent />
            </div>
        </div>
    )
}

export default WorkSpace
