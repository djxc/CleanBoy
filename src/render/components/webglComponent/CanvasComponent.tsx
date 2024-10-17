import { useEffect } from "react"

function CanvasComponent() {

    const CELL_SIZE = 4;   // 抽象坐标单位对于画布坐标大小
    const center_offset = 100;
    const canvas_size = 400;

    useEffect(() => {
        drawClock();
    }, [])

    /**
     * 旋转变换
     */
    function rotateTransform(positions:number[][], center:number[], angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        if (Array.isArray(positions)) {
            positions.forEach(vertex => {
                
                const x = vertex[0] - center[0];
                const y = vertex[1] - center[1];
                
                vertex[0] = center[0] + (x * cos - y * sin);
                vertex[1] = center[1] + (x * sin + y * cos);
            });
        }
        return positions;
    }

    /**
     * 缩放变换
     * 1、将抽象坐标大小转换为画布大小
     */
    function scaleTransform(scalar: number[]|number|number[][]) {
        if (Array.isArray(scalar)) {
            let new_position = []
            for (let p of scalar) {
                if (Array.isArray(p)) {
                    let new_sub_position = []
                    for (let _ of p) {
                        new_sub_position.push(_ * CELL_SIZE)
                    }
                    new_position.push(new_sub_position);
                } else {
                    new_position.push(p * CELL_SIZE);
                }
            }
            return new_position;
        } else {
            return scalar * CELL_SIZE;
        }
    }

    /**
     * 平移变换
     * 1、坐标的平移
     */
    function translateTransform(position: number[]|number|number[][], offset: number) {
        if (Array.isArray(position)) {
            let new_position = []
            for (let p of position) {
                if (Array.isArray(p)) {
                    let new_sub_position = []
                    for (let _ of p) {
                        new_sub_position.push(_ + offset)
                    }
                    new_position.push(new_sub_position);
                } else {
                    new_position.push(p + offset);
                }
            }
            return new_position;
        } else {
            return position + offset;
        }
    }

    /**
     * 绘制钟表
     * 1、表盘
     * 2、时针、分针以及秒针
     */
    function drawClock() {
        const clock_size = 20;  // 钟表大小，抽象坐标
        const clock_position = [0, 0];    // 钟表位置
        
        let hour_hand_path = [
            [-0.3, -1],
            [-0.2, 8],
            [0, 9],
            [0.2, 8],
            [0.3, -1],
            [-0.3, -1],
        ]

        let second_hand_path = [
            [-0.3, -1],
            [-0.2, 12],
            [0, 13],
            [0.2, 12],
            [0.3, -1],
            [-0.3, -1],
        ]


        let clock_size_transformed = scaleTransform(clock_size);
        let clock_position_translated = translateTransform(clock_position, center_offset) as number[];

        let hour_hand_path_scaled = scaleTransform(hour_hand_path) as number[][];
        let hour_hand_path_translated = translateTransform(hour_hand_path_scaled, center_offset) as number[][];

        let rotate_second_hand_path = rotateTransform(second_hand_path, [0, 0], 45) as number[][];
        let second_hand_path_scaled = scaleTransform(rotate_second_hand_path) as number[][];
        let second_hand_path_translated = translateTransform(second_hand_path_scaled, center_offset) as number[][];

        let c: any = document.getElementById("djxcCanvas");

        if (c) {
            var ctx = c.getContext("2d");
            // 绘制表盘
            ctx.beginPath();
            ctx.arc(clock_position_translated[0], clock_position_translated[1], clock_size_transformed, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(200, 200, 100, 0.5)";
            ctx.fill();

            // 绘制时针
            ctx.beginPath();
            let i = 0;
            for (let point of hour_hand_path_translated) {
                if (i == 0) {
                    ctx.moveTo(point[0], point[1]);
                } else {
                    ctx.lineTo(point[0], point[1]);
                }
                i = i + 1;
            }
            ctx.stroke();

            // 绘制分针
            ctx.beginPath();
            i = 0;
            for (let point of second_hand_path_translated) {
                if (i == 0) {
                    ctx.moveTo(point[0], point[1]);
                } else {
                    ctx.lineTo(point[0], point[1]);
                }
                i = i + 1;
            }
            ctx.stroke();
        } 
    }

    return(
        <div className="canvas-component-container">
           <div>
                canvas page
           </div>
           <canvas id="djxcCanvas" width={canvas_size} height={canvas_size}></canvas>
        </div>
    )
}

export default CanvasComponent