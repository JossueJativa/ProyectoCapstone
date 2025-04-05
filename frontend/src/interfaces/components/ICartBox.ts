export interface ICartBoxProps {
    id: number;
    dish_name: string;
    description: string;
    price: number;
    quantity: number;
    linkAR: string;
    desk_id: string;
    linkTo: string; // Link to details page
    garrisons?: string[]; // Garrison information
    onQuantityChange: (id: number, newQuantity: number) => void; // Callback for quantity change
    onDelete: (id: number) => void; // Callback for delete action
}