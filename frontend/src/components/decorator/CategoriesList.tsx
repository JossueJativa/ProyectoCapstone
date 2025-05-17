import { CategoriesListProps, Category } from '@/interfaces/components/ICategories';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material';

interface ExtendedCategoriesListProps extends CategoriesListProps {
    onCategorySelect: (categoryId: string) => void;
    selectedCategory: string | null;
}

export const CategoriesList = ({ categories, onCategorySelect, selectedCategory }: ExtendedCategoriesListProps) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 2,
                padding: 1,
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                },
            }}
            className="categories-slider"
        >
            {categories.map((category: Category) => (
                <Box
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    sx={{
                        minWidth: '150px',
                        textAlign: 'center',
                        padding: 1,
                        backgroundColor: selectedCategory === category.id ? theme.button.verde : theme.button.transparente,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: `1px solid ${theme.button.verde}`,
                    }}
                >
                    <h3>{category.category_name}</h3>
                </Box>
            ))}
        </Box>
    );
};
