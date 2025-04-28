import { useTheme } from '@mui/material';
import { CategoriesListProps } from '@/interfaces';
import { Box } from '@mui/material';

export const CategoriesList = ({ categories, onCategorySelect, selectedCategory }: CategoriesListProps) => {
    const theme = useTheme();

    const handleCategoryClick = (categoryId: number) => {
        onCategorySelect(categoryId);
    };

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
            {categories.map((category) => (
                <Box
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    sx={{
                        minWidth: '150px',
                        textAlign: 'center',
                        padding: 1,
                        backgroundColor: selectedCategory === category.id ? theme.button.verde : theme.button.transparente,
                        borderRadius: '8px',
                        border: `1px solid ${theme.button.verde}`,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: selectedCategory === category.id ? theme.button.verde : theme.button.transparente,
                        },
                    }}
                    className="category-item"
                >
                    <h3>{category.category_name}</h3>
                </Box>
            ))}
        </Box>
    );
};
