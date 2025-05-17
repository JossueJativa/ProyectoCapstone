<<<<<<< HEAD
import { useTheme } from '@mui/material';
import { CategoriesListProps, Category } from '@/interfaces';
=======
import { CategoriesListProps, Category } from '@/interfaces/components/ICategories';
>>>>>>> 24a2e6b7b01bd1ed706a6b31422c051b23dea57f
import { Box } from '@mui/material';
import { useTheme } from '@mui/material';

interface ExtendedCategoriesListProps extends CategoriesListProps {
    onCategorySelect: (categoryId: string) => void;
<<<<<<< HEAD
    selectedCategory: string | null;
}

export const CategoriesList = ({ categories, onCategorySelect, selectedCategory }: ExtendedCategoriesListProps) => {
    const theme = useTheme();

=======
    selectedCategory: string;
}

export const CategoriesList = ({ categories, onCategorySelect, selectedCategory }: ExtendedCategoriesListProps) => {
    const theme = useTheme();

>>>>>>> 24a2e6b7b01bd1ed706a6b31422c051b23dea57f
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
                    }}
                >
                    <h3>{category.name}</h3>
                </Box>
            ))}
        </Box>
    );
};
