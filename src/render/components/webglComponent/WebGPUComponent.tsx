import { useEffect } from "react"
// import "@webgpu/types"
import FragmentShaderCode from "./wgsl/fragmentModule.wgsl?raw"
import VertexShaderCode from "./wgsl/vertexModule.wgsl?raw"

import TriangleVertexShaderCode from "./wgsl/triangleVertex.wgsl?raw"
import TriangleFramentShaderCode from "./wgsl/triangleFrament.wgsl?raw"
import Renderer from './demoWebGPU';
import DWebGPU from "./DWebGPU"
import { PerspectiveCamera, Matrix4, Vector3 } from "three"

import "./webgc.css"

function WebGPUComponent() {
    useEffect(() => {
        // renderTrangle()
        // demogpu()
        // renderGPU()
        testGPU()
    }, [])
    return (
        <div className="webgpu-body">
            <canvas id="webGPUCanvas" width="512" height="300">
                Oops ... your browser doesn't support the HTML5 canvas element
            </canvas>
        </div>
    )

    async function testGPU() {

        const triangleVertex = new Float32Array([
            0.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ]);

        // 🎨 Color Vertex Buffer Data
        const colors = new Float32Array([
            1.0,
            0.0,
            0.0, // 🔴
            0.0,
            1.0,
            0.0, // 🟢
            0.0,
            0.0,
            1.0 // 🔵
        ]);
        const triangleMVMatrix = new Matrix4().makeTranslation(-1.5, 0.0, -7.0);
        const triangleIndex = new Uint32Array([0, 1, 2]);
        let camera = new PerspectiveCamera(45, document.body.clientWidth / document.body.clientHeight, 0.1, 100);
        let pMatrix = camera.projectionMatrix;
        let mxArray = new Float32Array(pMatrix.toArray().concat(triangleMVMatrix.toArray()));
        let dWebGPU = new DWebGPU()
        const backgroundColor = [0, 0, 0.5, 1];     // 背景颜色
        await dWebGPU.config("webGPUCanvas")
        dWebGPU.initRenderPass(backgroundColor);
        dWebGPU.initPipeline(); 
        dWebGPU.initGPUBuffer(triangleVertex, triangleIndex, mxArray);
        dWebGPU.draw(triangleIndex.length)
        dWebGPU.present()
    }

    /**
     * 初始化GPU对象
     * 1、首先在浏览器对象中获取navigator，其中包含浏览器的基本信息
     * 2、在navigator对象中获取gpu，如果当前浏览器不支持，则获取为空
     * 3、异步获取gpu适配器，adapter描述了显卡的基本信息
     * 4、异步获取设备，即为显卡的引用。用来操纵显卡，还可以创建数据结构
     * 5、queue是用来向GPU发送异步任务的，queue对象需要在device中获取
     * @returns 
     */
    async function initialGPU(): Promise<[GPUAdapter, GPUDevice, GPUQueue]> {
        const navigator: any = window.navigator;
        const gpu: GPU = navigator.gpu;
        if (!gpu) {
            alert('你的浏览器不支持 WebGPU 或未开启 WebGPU 支持')
            throw new Error( 'Your browser seems not support WebGPU!' );
        }
        const adapter = await gpu.requestAdapter()
        if (adapter) {
            const device = await adapter.requestDevice()
            const queue = device.queue;
            return [adapter, device, queue]
        } else {
            throw new Error( 'Your browser seems not support WebGPU!' );
        }
    }

    /**
     * 配置上下文
     * @param canvas 
     * @param context 
     * @param device 
     * @param presentationFormat 
     */
    function configContext(canvas: HTMLElement, context: any, device: any, presentationFormat: any) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const presentationSize = [
            canvas.clientWidth * devicePixelRatio,
            canvas.clientHeight * devicePixelRatio,
        ]

        context.configure({
            device,
            format: presentationFormat,
            size: presentationSize,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            alphaMode: 'opaque'
        })
    }

    /**
     * webGPU渲染三角形
     * 1、初始化webGPU获取设备、适配器以及queue
     * 2、配置上下文，canvas
     * 3、从WGSL创建着色器
     * 4、创建piple
     * 5、创建命令缓冲
     * 6、通过queue执行命令
     * @returns 
     */
    async function renderGPU() {
        const canvas: any = document.getElementById('webGPUCanvas')
        const [adapter, device, queue] = await initialGPU()       

        // 为了显示渲染的内容，需要有一个载体显示，webGPU采用canvas，wgpu可以用winit窗口。
        const context = canvas.getContext('webgpu') as GPUCanvasContext
        if (context) {
            console.info( `Congratulations! You've got a WebGPU context!` );
        } else {
            throw new Error( 'Your browser seems not support WebGPU!' );
        }
        const presentationFormat = context.getPreferredFormat(adapter)
        configContext(canvas, context, device, presentationFormat);

        let vertModule: GPUShaderModule = device.createShaderModule({
            code: VertexShaderCode
        });

        let fragModule: GPUShaderModule = device.createShaderModule({
            code: FragmentShaderCode
        });

        const depthTextureDesc: GPUTextureDescriptor = {
            size: [canvas.width, canvas.height, 1],
            dimension: '2d',
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };
        const pipelineLayout: GPUAutoLayoutMode = "auto"
        const pipelineDesc: GPURenderPipelineDescriptor = {
            vertex: {
                module: vertModule,
                entryPoint: 'main',
            },
    
            fragment: {
                module: fragModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: presentationFormat
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list',
            },
            layout: pipelineLayout
        }
        const pipeline = device.createRenderPipeline(pipelineDesc)

        // 使用device创建指令编码器
        const commandEncoder = device.createCommandEncoder()
        const textureView = context.getCurrentTexture().createView()
        const renderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    loadValue: {
                        r: 0.0,
                        g: 250.0,
                        b: 0.0,
                        a: 1.0
                    },
                    storeOp: 'store',
                    loadOp: 'load',
                }
            ]
        }

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        passEncoder.setPipeline(pipeline)
        passEncoder.draw(3, 1, 0, 0)
        passEncoder.endPass()

        queue.submit([commandEncoder.finish()])
    }

    async function demogpu() {
        const canvas = document.getElementById('webGPUCanvas') as HTMLCanvasElement;
        canvas.width = canvas.height = 640;
        const renderer = new Renderer(canvas);
        renderer.start();
    }


    async function renderTrangle() {
        const canvas: any = document.getElementById('webGPUCanvas')
        const [adapter, device, queue] = await initialGPU()
        if (!adapter || !device || !queue) {
            return
        }

        const context = canvas.getContext('webgpu')
        const presentationFormat = context.getPreferredFormat(adapter)
        configContext(canvas, context, device, presentationFormat);
        // 🤔 Create Depth Backing
        const depthTextureDesc: GPUTextureDescriptor = {
            size: [canvas.width, canvas.height, 1],
            dimension: '2d',
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };

        let depthTexture = device.createTexture(depthTextureDesc);
        let depthTextureView = depthTexture.createView();

        // 📈 Position Vertex Buffer Data
        const positions = new Float32Array([
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0,
            0.0, 1.0, 0.0
        ]);

        // 🎨 Color Vertex Buffer Data
        const colors = new Float32Array([
            1.0, 0.0, 0.0, // 🔴
            0.0, 1.0, 0.0, // 🟢
            0.0, 0.0, 1.0  // 🔵
        ]);

        // 📇 Index Buffer Data
        const indices = new Uint16Array([0, 1, 2]);
        // ✋ Declare buffer handles
        let positionBuffer = createBuffer(positions, GPUBufferUsage.VERTEX, device);
        let colorBuffer = createBuffer(colors, GPUBufferUsage.VERTEX, device);
        let indexBuffer = createBuffer(indices, GPUBufferUsage.INDEX, device);

        // ✋ Declare shader module handles        
        let vertModule = device.createShaderModule({ code: TriangleVertexShaderCode });
        let fragModule = device.createShaderModule({ code: TriangleFramentShaderCode });

        // 👔 Uniform Data
        const uniformData = new Float32Array([

            // ♟️ ModelViewProjection Matrix (Identity)
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,

            // 🔴 Primary Color
            0.9, 0.1, 0.3, 1.0,

            // 🟣 Accent Color
            0.8, 0.2, 0.8, 1.0,
        ]);

        // ✋ Declare buffer handles
        let uniformBuffer = createBuffer(uniformData, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, device);

        // 🔣 Input Assembly
        const positionAttribDesc: GPUVertexAttribute = {
            shaderLocation: 0, // @location(0)
            offset: 0,
            format: 'float32x3'
        };
        const colorAttribDesc: GPUVertexAttribute = {
            shaderLocation: 1, // @location(1)
            offset: 0,
            format: 'float32x3'
        };
        const positionBufferDesc: GPUVertexBufferLayout = {
            attributes: [positionAttribDesc],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        };
        const colorBufferDesc: GPUVertexBufferLayout = {
            attributes: [colorAttribDesc],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        };     

        // 🌑 Depth
        const depthStencil: GPUDepthStencilState = {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus-stencil8'
        };      

        // 🎭 Shader Stages
        const vertex: GPUVertexState = {
            module: vertModule,
            entryPoint: 'main',
            buffers: [positionBufferDesc, colorBufferDesc]
        };

        // 🌀 Color/Blend State
        const colorState: GPUColorTargetState = {
            format: 'bgra8unorm'
        };

        const fragment: GPUFragmentState = {
            module: fragModule,
            entryPoint: 'main',
            targets: [colorState]
        };

        // 🟨 Rasterization
        const primitive: GPUPrimitiveState = {
            frontFace: 'cw',
            cullMode: 'none',
            topology: 'triangle-list'
        };
         // 📁 Bind Group Layout
         let uniformBindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {}
                }
            ]
        });
        // 🗂️ Pipeline Layout
        // 👩‍🔧 This would be used as a member of a GPUPipelineDescriptor when *creating a pipeline*
        const pipelineLayoutDesc = { bindGroupLayouts: [uniformBindGroupLayout] };
        let layout = device.createPipelineLayout(pipelineLayoutDesc);


        // 👨‍🔧 Create your graphics pipeline...
        const pipelineDesc: GPURenderPipelineDescriptor = {
            layout,
            vertex,
            fragment,
            primitive,
            depthStencil
        };

        const pipeline = device.createRenderPipeline(pipelineDesc);
        // 🧙‍♂️ Then get your implicit pipeline layout:
        let bindGroupLayout = pipeline.getBindGroupLayout(0);

        // 🗄️ Bind Group
        // ✍ This would be used when *encoding commands*
        let bindGroup = device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: uniformBuffer
                    }
                }
            ]
        });
       

        // 🗄️ Bind Group
        // ✍ This would be used when *encoding commands*
        let uniformBindGroup = device.createBindGroup({
            layout: uniformBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: uniformBuffer
                    }
                }
            ]
        });

      
      
        render(context, device, pipeline, queue, null, depthTextureView, positionBuffer, colorBuffer, indexBuffer, canvas, uniformBindGroup)

      
    }


    // ✍️ Write commands to send to the GPU
    function encodeCommands(device: GPUDevice, pipeline: any, queue: any, colorTextureView: any, depthTextureView: any, 
            positionBuffer: any, colorBuffer: any, indexBuffer: any, canvas: any, uniformBindGroup: any) {
        let colorAttachment: GPURenderPassColorAttachment = {
            view: colorTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store'
        };

        const depthAttachment: GPURenderPassDepthStencilAttachment = {
            view: depthTextureView,
            depthClearValue: 1,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
            stencilClearValue: 0,
            stencilLoadOp: 'clear',
            stencilStoreOp: 'store'
        };

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment],
            depthStencilAttachment: depthAttachment
        };

        let commandEncoder = device.createCommandEncoder();

        // 🖌️ Encode drawing commands
        let passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
        passEncoder.setPipeline(pipeline);
        passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        passEncoder.setScissorRect(0, 0, canvas.width, canvas.height);
        passEncoder.setVertexBuffer(0, positionBuffer);
        passEncoder.setVertexBuffer(1, colorBuffer);
        passEncoder.setIndexBuffer(indexBuffer, 'uint16');
        passEncoder.drawIndexed(3);
        passEncoder.endPass();
        // ✍ Later when you're encoding commands:
        passEncoder.setBindGroup(0, uniformBindGroup);
        queue.submit([commandEncoder.finish()]);
    };

    function render(context: any, device: GPUDevice, pipeline: any, queue: any, colorTextureView: any, depthTextureView: any, 
        positionBuffer: any, colorBuffer: any, indexBuffer: any, canvas: any, uniformBindGroup: any) {
        // ⏭ Acquire next image from context
        let colorTexture = context.getCurrentTexture();
        colorTextureView = colorTexture.createView();
        console.log(colorTextureView);
        

        // 📦 Write and submit commands to queue
        encodeCommands(device, pipeline, queue, colorTextureView, depthTextureView, positionBuffer, colorBuffer, indexBuffer, canvas, uniformBindGroup);

        // ➿ Refresh canvas
        requestAnimationFrame(() => render(context, device, pipeline, queue, colorTextureView, depthTextureView, positionBuffer, colorBuffer, indexBuffer, canvas, uniformBindGroup));
    };

    // 👋 Helper function for creating GPUBuffer(s) out of Typed Arrays
    function createBuffer(arr: Float32Array | Uint16Array, usage: number, device: GPUDevice) {
        // 📏 Align to 4 bytes (thanks @chrimsonite)
        let desc = {
            size: (arr.byteLength + 3) & ~3,
            usage,
            mappedAtCreation: true
        };
        let buffer = device.createBuffer(desc);

        const writeArray =
            arr instanceof Uint16Array
                ? new Uint16Array(buffer.getMappedRange())
                : new Float32Array(buffer.getMappedRange());
        writeArray.set(arr);
        buffer.unmap();
        return buffer;
    };

}

export default WebGPUComponent