export interface Category {
    id: string;
    category_name: string;
    description: string;
}

export interface CategoriesListProps {
    categories: Category[];
}