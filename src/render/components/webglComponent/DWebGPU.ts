
import TriangleVertexShaderCode from "./wgsl/demoVertex.wgsl?raw"
import TriangleFramentShaderCode from "./wgsl/demoFragment.wgsl?raw"


class DWebGPU {
    canvas!: HTMLElement
    adapter!: GPUAdapter;
    device!: GPUDevice
    queue!: GPUQueue
    context!: GPUCanvasContext
    renderPassEncoder!: GPURenderPassEncoder
    uniformGroupLayout!: GPUBindGroupLayout
    commandEncoder!: GPUCommandEncoder
    format: GPUTextureFormat
    constructor() {
        this.format = "rgba8unorm"
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
    async initialGPU(): Promise<[GPUAdapter, GPUDevice, GPUQueue]> {
        const navigator: any = window.navigator;
        const gpu: GPU = navigator.gpu;
        if (!gpu) {
            alert('你的浏览器不支持 WebGPU 或未开启 WebGPU 支持')
            throw new Error('Your browser seems not support WebGPU!');
        }
        const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" })
        if (adapter) {
            const device = await adapter.requestDevice()
            const queue = device.queue;
            return [adapter, device, queue]
        } else {
            throw new Error('Your browser seems not support WebGPU!');
        }
    }

    async config(canvasId: string) {
        const canvas: any = document.getElementById(canvasId)
        const [adapter, device, queue] = await this.initialGPU()
        this.canvas = canvas;
        this.adapter = adapter;
        this.device = device;
        this.queue = queue;
        // 为了显示渲染的内容，需要有一个载体显示，webGPU采用canvas，wgpu可以用winit窗口。
        const context = canvas.getContext('webgpu') as GPUCanvasContext
        if (context) {
            console.info(`Congratulations! You've got a WebGPU context!`);
        } else {
            throw new Error('Your browser seems not support WebGPU!');
        }

        context.configure({
            device,
            format: this.format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            alphaMode: 'opaque'
        })
        this.context = context
    }

    /**
     * 初始化渲染通道
     * @param backgroundColor 
     */
    initRenderPass(backgroundColor: GPUColor) {
        // 创建渲染通道，在渲染通道中，我们会进行具体的绘制工作，每个渲染通道结束，我们都会得到一幅图像。在复杂的 3D 应用中，最终呈现在显示器上的图像，往往是多个渲染通道组合迭代的结果。

        let textureView = this.context.getCurrentTexture().createView();
        let renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: backgroundColor
            }]
        }
        // 创建命令编码，作用是把你需要让 GPU 执行的指令写入到 GPU 的指令缓冲区（Command Buffer）中
        let commandEncoder = this.device.createCommandEncoder();
        let renderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPassEncoder.setViewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, 1)
        
        this.renderPassEncoder = renderPassEncoder
        this.commandEncoder = commandEncoder
    }

    initPipeline() {
        let device = this.device;
        let uniformGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });
        this.uniformGroupLayout = uniformGroupLayout;

        let layout: GPUPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [uniformGroupLayout]
        });

        let vxModule: GPUShaderModule = device.createShaderModule({
            code: TriangleVertexShaderCode
        });

        let fxModule: GPUShaderModule = device.createShaderModule({
            code: TriangleFramentShaderCode
        });

        
        const colorBufferDesc: GPUVertexBufferLayout = {
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex',
            attributes: [
                {
                    shaderLocation: 1, // [[location(1)]]
                    offset: 0,
                    format: 'float32x3'
                }
            ],
        };

        // 渲染管线，把渲染管线理解为工厂生产作业的流水线，它分为若干个步骤，经由这些步骤，最后可以生产出我们想要的东西。
        let pipelineDesc: GPURenderPipelineDescriptor = {
            layout: layout,
            vertex: {
                module: vxModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 4 * 3,
                        attributes: [
                            // position
                            {
                                shaderLocation: 0,
                                offset: 0,
                                format: 'float32x3'
                            }
                        ]
                    }
                ],
            },
            fragment: {
                module: fxModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: this.format,
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list'
            },
        }
        let renderPipeline = device.createRenderPipeline(pipelineDesc)
        this.renderPassEncoder.setPipeline(renderPipeline);
    }
    
    /**
     * 根据数据创建GPUBuffer,然后将数据放在buffer中
     * @param vertex 
     * @param index 
     * @param mxArray 
     */
    initGPUBuffer(vertex: Float32Array, index: Uint32Array, mxArray: Float32Array) {
        let vertexBuffer = this._CreateGPUBuffer(vertex, GPUBufferUsage.VERTEX);
        this.renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    
        let indexBuffer = this._CreateGPUBuffer(index, GPUBufferUsage.INDEX);
        this.renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");
    
        let uniformBuffer = this._CreateGPUBuffer(mxArray, GPUBufferUsage.UNIFORM);
    
        let uniformBindGroup = this.device.createBindGroup({
            layout: this.uniformGroupLayout,
            entries: [{
                binding: 0,
                resource: { buffer: uniformBuffer }
            }]
        });
        this.renderPassEncoder.setBindGroup(0, uniformBindGroup);
    }
    
    /**
     * 绘制
     */
    draw(indexCount: number) {        
        this.renderPassEncoder.drawIndexed(indexCount, 1, 0, 0, 0);
    }
    
    /**
     * 配置完成renderpass，然后通过queue将指令发送给GPU
     */
    present() {
        this.renderPassEncoder.end();
        this.device.queue.submit([this.commandEncoder.finish()]);
    }

    /**
     * 像GPU申请缓存
     * @param typedArray 
     * @param usage 
     * @returns 
     */
    private _CreateGPUBuffer(typedArray: any, usage: GPUBufferUsageFlags) {
        let gpuBuffer = this.device.createBuffer({
            size: typedArray.byteLength,
            usage: usage | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });

        let constructor = typedArray.constructor as new (buffer: ArrayBuffer) => any;
        let view = new constructor(gpuBuffer.getMappedRange());
        view.set(typedArray, 0);
        gpuBuffer.unmap();
        return gpuBuffer;
    }


    render() {

    }
}

export default DWebGPU