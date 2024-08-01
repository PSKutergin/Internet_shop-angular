import { CategoryType } from "./category.type"

export type ProductType = {
    id: string,
    name: string,
    price: string,
    image: string,
    lightning: string,
    humidity: string,
    temperature: string,
    height: string,
    diameter: string,
    url: string,
    type: CategoryType,
    countInCart?: number,
    isInFavorite?: boolean
}