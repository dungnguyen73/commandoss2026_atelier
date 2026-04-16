/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/chain-passport::chain_passport';
export const OriginEvent = new MoveStruct({ name: `${$moduleName}::OriginEvent`, fields: {
        event_type: bcs.string(),
        timestamp: bcs.u64(),
        location: bcs.string(),
        note: bcs.string(),
        actor: bcs.Address
    } });
export const OriginItem = new MoveStruct({ name: `${$moduleName}::OriginItem`, fields: {
        id: bcs.Address,
        name: bcs.string(),
        category: bcs.string(),
        quantity: bcs.string(),
        farm: bcs.string(),
        province: bcs.string(),
        certification: bcs.string(),
        history: bcs.vector(OriginEvent),
        creator: bcs.Address,
        created_at: bcs.u64()
    } });
export const ItemCreated = new MoveStruct({ name: `${$moduleName}::ItemCreated`, fields: {
        item_id: bcs.Address,
        creator: bcs.Address
    } });
export interface CreateOriginItemArguments {
    name: RawTransactionArgument<string>;
    category: RawTransactionArgument<string>;
    quantity: RawTransactionArgument<string>;
    farm: RawTransactionArgument<string>;
    province: RawTransactionArgument<string>;
    certification: RawTransactionArgument<string>;
}
export interface CreateOriginItemOptions {
    package?: string;
    arguments: CreateOriginItemArguments | [
        name: RawTransactionArgument<string>,
        category: RawTransactionArgument<string>,
        quantity: RawTransactionArgument<string>,
        farm: RawTransactionArgument<string>,
        province: RawTransactionArgument<string>,
        certification: RawTransactionArgument<string>
    ];
}
/** Create a new OriginItem and transfer it to the sender. */
export function createOriginItem(options: CreateOriginItemOptions) {
    const packageAddress = options.package ?? '@local-pkg/chain-passport';
    const argumentsTypes = [
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["name", "category", "quantity", "farm", "province", "certification"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'chain_passport',
        function: 'create_origin_item',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddEventArguments {
    item: RawTransactionArgument<string>;
    eventType: RawTransactionArgument<string>;
    location: RawTransactionArgument<string>;
    note: RawTransactionArgument<string>;
}
export interface AddEventOptions {
    package?: string;
    arguments: AddEventArguments | [
        item: RawTransactionArgument<string>,
        eventType: RawTransactionArgument<string>,
        location: RawTransactionArgument<string>,
        note: RawTransactionArgument<string>
    ];
}
/** Add a new event to an existing OriginItem. */
export function addEvent(options: AddEventOptions) {
    const packageAddress = options.package ?? '@local-pkg/chain-passport';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["item", "eventType", "location", "note"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'chain_passport',
        function: 'add_event',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TransferItemArguments {
    item: RawTransactionArgument<string>;
    recipient: RawTransactionArgument<string>;
}
export interface TransferItemOptions {
    package?: string;
    arguments: TransferItemArguments | [
        item: RawTransactionArgument<string>,
        recipient: RawTransactionArgument<string>
    ];
}
/** Transfer an OriginItem to a new owner. */
export function transferItem(options: TransferItemOptions) {
    const packageAddress = options.package ?? '@local-pkg/chain-passport';
    const argumentsTypes = [
        null,
        'address'
    ] satisfies (string | null)[];
    const parameterNames = ["item", "recipient"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'chain_passport',
        function: 'transfer_item',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}