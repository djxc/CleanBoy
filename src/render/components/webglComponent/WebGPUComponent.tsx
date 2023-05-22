import { useEffect } from "react"
// import "@webgpu/types"
import FragmentShaderCode from "./wgsl/fragmentModule.wgsl?raw"
import VertexShaderCode from "./wgsl/vertexModule.wgsl?raw"

import TriangleVertexShaderCode from "./wgsl/triangleVertex.wgsl?raw"
import TriangleFramentShaderCode from "./wgsl/triangleFrament.wgsl?raw"
import "./webgc.css"

function WebGPUComponent() {
    useEffect(() => {
        renderGPU()
    }, [])
    return (
        <div className="webgpu-body">
            <canvas id="webGPUCanvas" width="512" height="300">
                Oops ... your browser doesn't support the HTML5 canvas element
            </canvas>
        </div>
    )

    /**
     * 初始化GPU对象
     * 1、首先在浏览器对象中获取navigator，其中包含浏览器的基本信息
     * 2、在navigator对象中获取gpu，如果当前浏览器不支持，则获取为空
     * 3、异步获取gpu适配器，adapter描述了显卡的基本信息
     * 4、异步获取设备，即为显卡的引用。用来操纵显卡，还可以创建数据结构
     * 5、queue是用来向GPU发送异步任务的
     * @returns 
     */
    async function initialGPU(): Promise<[GPUAdapter, GPUDevice, GPUQueue] | []> {
        const navigator: any = window.navigator;
        const gpu: GPU = navigator.gpu;
        if (!gpu) {
            alert('你的浏览器不支持 WebGPU 或未开启 WebGPU 支持')
            return []
        }
        const adapter = await gpu.requestAdapter()
        if (adapter) {
            const device = await adapter.requestDevice()
            const queue = device.queue;
            return [adapter, device, queue]
        } else {
            return []
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
     * @returns 
     */
    async function renderGPU() {
        const canvas: any = document.getElementById('webGPUCanvas')
        const [adapter, device, queue] = await initialGPU()
        if (!adapter || !device || !queue) {
            return
        }

        // 为了显示渲染的内容，需要有一个载体显示，webGPU采用canvas，wgpu可以用winit窗口。
        const context = canvas.getContext('webgpu')
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

        const pipeline = device.createRenderPipeline({
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
            }
        })

        // 使用device创建指令编码器
        const commandEncoder = device.createCommandEncoder()
        const textureView = context.getCurrentTexture().createView()
        const renderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    loadValue: {
                        r: 0.0,
                        g: 0.0,
                        b: 0.0,
                        a: 1.0
                    },
                    storeOp: 'store'
                }
            ]
        }

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        passEncoder.setPipeline(pipeline)
        passEncoder.draw(3, 1, 0, 0)
        passEncoder.endPass()

        queue.submit([commandEncoder.finish()])
    }


    async function renderTrangle() {
        const canvas: any = document.getElementById('webGPUCanvas')
        const [adapter, device, queue] = await initialGPU()
        if (!adapter || !device || !queue) {
            return
        }

        const context = canvas.getContext('webgpu')

        // 🤔 Create Depth Backing
        const depthTextureDesc: GPUTextureDescriptor = {
            size: [canvas.width, canvas.height, 1],
            dimension: '2d',
            format: 'depth24plus-stencil8',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        };

        let depthTexture = device.createTexture(depthTextureDesc);
        let depthTextureView = depthTexture.createView();

        // ✋ Declare canvas context image handles
        let colorTexture = context.getCurrentTexture();
        let colorTextureView = colorTexture.createView();

        // 📈 Position Vertex Buffer Data
        const positions = new Float32Array([
            1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0
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

        // 📇 Index Buffer Data
        const indices = new Uint16Array([0, 1, 2]);
        // ✋ Declare buffer handles
        let positionBuffer = createBuffer(positions, GPUBufferUsage.VERTEX, device);
        let colorBuffer = createBuffer(colors, GPUBufferUsage.VERTEX, device);
        let indexBuffer = createBuffer(indices, GPUBufferUsage.INDEX, device);

        // ✋ Declare shader module handles        
        const vsmDesc = { code: TriangleVertexShaderCode };
        let vertModule = device.createShaderModule(vsmDesc);

        const fsmDesc = { code: TriangleFramentShaderCode };
        let fragModule = device.createShaderModule(fsmDesc);

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

        // 👨‍🔧 Create your graphics pipeline...

        // 🧙‍♂️ Then get your implicit pipeline layout:
        let bindGroupLayout = pipeline.getBindGroupLayout(0);

        // 🗄️ Bind Group
        // ✍ This would be used when *encoding commands*
        let uniformBindGroup = device.createBindGroup({
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
        // ✋ Declare handles
        let uniformBindGroupLayout: GPUBindGroupLayout = null;
        let uniformBindGroup: GPUBindGroup = null;
        let layout: GPUPipelineLayout = null;

        // 📁 Bind Group Layout
        uniformBindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {}
                }
            ]
        });

        // 🗄️ Bind Group
        // ✍ This would be used when *encoding commands*
        uniformBindGroup = device.createBindGroup({
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

        // 🗂️ Pipeline Layout
        // 👩‍🔧 This would be used as a member of a GPUPipelineDescriptor when *creating a pipeline*
        const pipelineLayoutDesc = { bindGroupLayouts: [uniformBindGroupLayout] };
        layout = device.createPipelineLayout(pipelineLayoutDesc);
        // ✍ Later when you're encoding commands:
        passEncoder.setBindGroup(0, uniformBindGroup);
        // ✋ Declare pipeline handle
        let pipeline: GPURenderPipeline = null;

        // ⚗️ Graphics Pipeline

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

        // 🦄 Uniform Data
        const pipelineLayoutDesc = { bindGroupLayouts: [] };
        const layout = device.createPipelineLayout(pipelineLayoutDesc);

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

        const pipelineDesc: GPURenderPipelineDescriptor = {
            layout,
            vertex,
            fragment,
            primitive,
            depthStencil
        };

        pipeline = device.createRenderPipeline(pipelineDesc);
       

    }


    // ✍️ Write commands to send to the GPU
    function encodeCommands() {
        let colorAttachment: GPURenderPassColorAttachment = {
            view: this.colorTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store'
        };

        const depthAttachment: GPURenderPassDepthStencilAttachment = {
            view: this.depthTextureView,
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

        queue.submit([commandEncoder.finish()]);
    };

    function render(context: any) {
        // ⏭ Acquire next image from context
        let colorTexture = context.getCurrentTexture();
        let colorTextureView = colorTexture.createView();

        // 📦 Write and submit commands to queue
        encodeCommands();

        // ➿ Refresh canvas
        requestAnimationFrame(() => render(context));
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