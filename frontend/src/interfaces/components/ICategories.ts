export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface CategoriesListProps {
    categories: Category[];
}