export type TransactionResponse = {
    hash?: string;
    error?: {
        code: number;
        message: string;
    };
    status: boolean;
};
