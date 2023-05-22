type GPUFlagsConstant = number;
interface GPUObjectDescriptorBase {
    /**
     * The initial value of {@link GPUObjectBase#label|GPUObjectBase.label}.
     */
    label?: string;
}

interface GPUObjectBase {
    label: string;
}

interface GPUBufferUsage {
    /**
     * Nominal type branding.
     * https://github.com/microsoft/TypeScript/pull/33038
     * @internal
     */
    readonly __brand: "GPUBufferUsage";
    readonly MAP_READ: GPUFlagsConstant;
    readonly MAP_WRITE: GPUFlagsConstant;
    readonly COPY_SRC: GPUFlagsConstant;
    readonly COPY_DST: GPUFlagsConstant;
    readonly INDEX: GPUFlagsConstant;
    readonly VERTEX: GPUFlagsConstant;
    readonly UNIFORM: GPUFlagsConstant;
    readonly STORAGE: GPUFlagsConstant;
    readonly INDIRECT: GPUFlagsConstant;
    readonly QUERY_RESOLVE: GPUFlagsConstant;
  }
  
  declare var GPUBufferUsage: {
    prototype: GPUBufferUsage;
    readonly MAP_READ: GPUFlagsConstant;
    readonly MAP_WRITE: GPUFlagsConstant;
    readonly COPY_SRC: GPUFlagsConstant;
    readonly COPY_DST: GPUFlagsConstant;
    readonly INDEX: GPUFlagsConstant;
    readonly VERTEX: GPUFlagsConstant;
    readonly UNIFORM: GPUFlagsConstant;
    readonly STORAGE: GPUFlagsConstant;
    readonly INDIRECT: GPUFlagsConstant;
    readonly QUERY_RESOLVE: GPUFlagsConstant;
  };


declare interface GPU {
    requestAdapter(): any
}

declare interface GPUShaderModule {

}

declare interface GPUAdapter {

}

declare interface GPUDevice {
    createShaderModule(any),
    createRenderPipeline(any),
    createCommandEncoder()
    /**
     * Creates a {@link GPUTexture}.
     * @param descriptor - Description of the {@link GPUTexture} to create.
     */
    createTexture(
        descriptor: GPUTextureDescriptor
    ): GPUTexture;

    /**
 * Creates a {@link GPUBuffer}.
 * @param descriptor - Description of the {@link GPUBuffer} to create.
 */
    createBuffer(
        descriptor: GPUBufferDescriptor
    ): GPUBuffer;
}

declare interface GPUQueue {
    submit(any)
}

interface GPUTextureDescriptor
    extends GPUObjectDescriptorBase {
    /**
     * The width, height, and depth or layer count of the texture.
     */
    size: GPUExtent3DStrict;
    /**
     * The number of mip levels the texture will contain.
     */
    mipLevelCount?: GPUIntegerCoordinate;
    /**
     * The sample count of the texture. A {@link GPUTextureDescriptor#sampleCount} &gt; `1` indicates
     * a multisampled texture.
     */
    sampleCount?: GPUSize32;
    /**
     * Whether the texture is one-dimensional, an array of two-dimensional layers, or three-dimensional.
     */
    dimension?: GPUTextureDimension;
    /**
     * The format of the texture.
     */
    format: GPUTextureFormat;
    /**
     * The allowed usages for the texture.
     */
    usage: GPUTextureUsageFlags;
    /**
     * Specifies what view {@link GPUTextureViewDescriptor#format} values will be allowed when calling
     * {@link GPUTexture#createView} on this texture (in addition to the texture's actual
     * {@link GPUTextureDescriptor#format}).
     * <div class=note>
     * Note:
     * Adding a format to this list may have a significant performance impact, so it is best
     * to avoid adding formats unnecessarily.
     * The actual performance impact is highly dependent on the target system; developers must
     * test various systems to find out the impact on their particular application.
     * For example, on some systems any texture with a {@link GPUTextureDescriptor#format} or
     * {@link GPUTextureDescriptor#viewFormats} entry including
     * {@link GPUTextureFormat#"rgba8unorm-srgb"} will perform less optimally than a
     * {@link GPUTextureFormat#"rgba8unorm"} texture which does not.
     * Similar caveats exist for other formats and pairs of formats on other systems.
     * </div>
     * Formats in this list must be texture view format compatible with the texture format.
     * <div algorithm>
     * Two {@link GPUTextureFormat}s `format` and `viewFormat` are <dfn dfn for=>texture view format compatible</dfn> if:
     * - `format` equals `viewFormat`, or
     * - `format` and `viewFormat` differ only in whether they are `srgb` formats (have the `-srgb` suffix).
     * </div>
     */
    viewFormats?: Iterable<GPUTextureFormat>;
}

interface GPUBuffer
    extends GPUObjectBase {
    /**
     * Nominal type branding.
     * https://github.com/microsoft/TypeScript/pull/33038
     * @internal
     */
    readonly __brand: "GPUBuffer";
    readonly size: GPUSize64;
    readonly usage: GPUBufferUsageFlags;
    readonly mapState: GPUBufferMapState;
    /**
     * Maps the given range of the {@link GPUBuffer} and resolves the returned {@link Promise} when the
     * {@link GPUBuffer}'s content is ready to be accessed with {@link GPUBuffer#getMappedRange}.
     * The resolution of the returned {@link Promise} **only** indicates that the buffer has been mapped.
     * It does not guarantee the completion of any other operations visible to the content timeline,
     * and in particular does not imply that any other {@link Promise} returned from
     * {@link GPUQueue#onSubmittedWorkDone()} or {@link GPUBuffer#mapAsync} on other {@link GPUBuffer}s
     * have resolved.
     * The resolution of the {@link Promise} returned from {@link GPUQueue#onSubmittedWorkDone}
     * **does** imply the completion of
     * {@link GPUBuffer#mapAsync} calls made prior to that call,
     * on {@link GPUBuffer}s last used exclusively on that queue.
     * @param mode - Whether the buffer should be mapped for reading or writing.
     * @param offset - Offset in bytes into the buffer to the start of the range to map.
     * @param size - Size in bytes of the range to map.
     */
    mapAsync(
        mode: GPUMapModeFlags,
        offset?: GPUSize64,
        size?: GPUSize64
    ): Promise<undefined>;
    /**
     * Returns an {@link ArrayBuffer} with the contents of the {@link GPUBuffer} in the given mapped range.
     * @param offset - Offset in bytes into the buffer to return buffer contents from.
     * @param size - Size in bytes of the {@link ArrayBuffer} to return.
     */
    getMappedRange(
        offset?: GPUSize64,
        size?: GPUSize64
    ): ArrayBuffer;
    /**
     * Unmaps the mapped range of the {@link GPUBuffer} and makes it's contents available for use by the
     * GPU again.
     */
    unmap(): undefined;
    /**
     * Destroys the {@link GPUBuffer}.
     * Note: It is valid to destroy a buffer multiple times.
     * Note: Since no further operations can be enqueued using this buffer, implementations can
     * free resource allocations, including mapped memory that was just unmapped.
     */
    destroy(): undefined;
}

declare var GPUBuffer: {
    prototype: GPUBuffer;
    new(): never;
};

interface GPUTextureUsage {
    /**
     * Nominal type branding.
     * https://github.com/microsoft/TypeScript/pull/33038
     * @internal
     */
    readonly __brand: "GPUTextureUsage";
    readonly COPY_SRC: GPUFlagsConstant;
    readonly COPY_DST: GPUFlagsConstant;
    readonly TEXTURE_BINDING: GPUFlagsConstant;
    readonly STORAGE_BINDING: GPUFlagsConstant;
    readonly RENDER_ATTACHMENT: GPUFlagsConstant;
}

declare var GPUTextureUsage: {
    prototype: GPUTextureUsage;
    readonly COPY_SRC: GPUFlagsConstant;
    readonly COPY_DST: GPUFlagsConstant;
    readonly TEXTURE_BINDING: GPUFlagsConstant;
    readonly STORAGE_BINDING: GPUFlagsConstant;
    readonly RENDER_ATTACHMENT: GPUFlagsConstant;
};