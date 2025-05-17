export interface IDishBoxProps {
  name: string;
  price: number;
  description: string;
  linkAR: string;
  linkTo: string | null;
  allergens: number[] | null;
  dish_id: number;
  has_garrison: boolean;
}