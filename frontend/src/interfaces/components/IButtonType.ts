export interface IButtonTypeProps {
    text: string;
    typeButton: 'primary' | 'outlined' | 'secondary';
    urlLink?: string;
    onClick?: () => void;
}