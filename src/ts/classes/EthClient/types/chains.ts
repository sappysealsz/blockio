export type Chain = {
    name: string;
    chain: string;
    icon: string;
    rpc: string[];
    features: Object[];
    faucets: [];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44: number;
    ens: {
        registry: string;
    };
    explorers: Object[];
};

export type Network = {
    name: string;
    currency: string;
};
