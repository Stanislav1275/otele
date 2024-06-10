export type CreateFabricRequestSchema =
    {
        "name": string,
        "width": number,
        "price_per_meter": number,
        "total_length": number
    }
export type FabricResponseSchema = Omit<CreateFabricRequestSchema, 'total_length'> & { id: number }
export type FabricListResponseSchema = {
    fabrics: Array<FabricResponseSchema>
}
