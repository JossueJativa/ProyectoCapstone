export interface IButtonLogicProps {
    text: string;
    typeButton: 'primary' | 'outlined' | 'secondary';
    urlLink?: string;
    onClick?: () => void;
    icon?: JSX.Element;
}