export declare class NBTAccounter {
    static readonly UNLIMITED: NBTAccounter;
    private readonly quota;
    private usage;
    constructor(quota: bigint);
    accountBits(bits: bigint): void;
}
