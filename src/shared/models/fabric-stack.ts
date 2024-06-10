export type UpdateFabricStockRequestSchema = {
    total_length: number;
}
export type FabricStockResponseSchema = {
    id: number;
    fabric_id: number;
    total_length: number;
}
export type FabricStockListResponseSchema = {
    fabric_stocks: Array<FabricStockResponseSchema>
}
