export type CreateModelRequestSchema = {
    "name": string,
    "recommended_fabric_id": number,
    "fabric_consumption": number,
    "price": number
}
export type ModelResponseSchema = CreateModelRequestSchema & { id: number }
export type ModelListResponseSchema = {
    models: Array<ModelResponseSchema>
}
