import { useEffect } from "react";

function CanvasPage() {
    useEffect(() => {

    }, [])

    return(
        <div>
           CanvasPage
           <canvas id="djCanvas" width={20} height={20}></canvas>
        </div>
    )
}

export default CanvasPage;