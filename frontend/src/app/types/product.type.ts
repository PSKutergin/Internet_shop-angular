import { CategoryType } from "./category.type"

export type ProductType = {
    id: string,
    name: string,
    price: number,
    image: string,
    lightning: string,
    humidity: string,
    temperature: string,
    height: number,
    diameter: number,
    url: string,
    type: CategoryType,
    countInCart?: number,
    isInFavorite?: boolean
}