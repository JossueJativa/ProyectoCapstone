export interface IPopUpInformationProps {
    open: boolean;
    title?: string;
    message: string;
    isInformative?: boolean;
    redirect: string;
    children?: React.ReactNode;
}
