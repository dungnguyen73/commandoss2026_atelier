/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/


/**
 * The Atelier — SUI-based artisan authenticity and certificate verification.
 * 
 * An artisan mints an `ArtisanCertificate` object for each handmade piece. The
 * certificate stores descriptive metadata alongside a `cert_hash` that is computed
 * off-chain from the canonical field values and anchored here. Anyone can verify a
 * piece's authenticity by recomputing the hash from the displayed data and
 * comparing it to the on-chain value.
 * 
 * Ownership rules
 * 
 * ---
 * 
 * • Only the current owner (initially the artisan) can call `add_provenance_event`
 * and `transfer_certificate`. • `update_cert_hash` is also gated to the current
 * owner so the artisan can correct the hash if they update an optional field (e.g.
 * add a photo URL). • Verification is a pure read — no transaction required.
 */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@mysten/sui/bcs';
import { type Transaction } from '@mysten/sui/transactions';
const $moduleName = '@local-pkg/atelier::atelier';
export const ProvenanceEvent = new MoveStruct({
    name: `${$moduleName}::ProvenanceEvent`, fields: {
        /** Short label for the event (e.g. "Certified", "Sold", "Exhibited"). */
        event_type: bcs.string(),
        /** Unix timestamp (ms) when this event was recorded on-chain. */
        timestamp: bcs.u64(),
        /** Location associated with the event (e.g. gallery city). */
        location: bcs.string(),
        /** Free-text note providing context for this event. */
        note: bcs.string(),
        /** Address of the wallet that submitted this event. */
        actor: bcs.Address
    }
});
export const ArtisanCertificate = new MoveStruct({
    name: `${$moduleName}::ArtisanCertificate`, fields: {
        id: bcs.Address,
        /** Display name of the handmade piece. */
        name: bcs.string(),
        /** Craft category (e.g. "Ceramics", "Jewelry", "Textiles"). */
        category: bcs.string(),
        /** Full name of the artisan who created the piece. */
        artisan_name: bcs.string(),
        /** Studio, city, or region where the piece was made. */
        location: bcs.string(),
        /** Primary materials used (e.g. "Stoneware clay, Celadon glaze"). */
        materials: bcs.string(),
        /** Optional story, technique note, or provenance narrative. */
        note: bcs.string(),
        /** SHA-256 hex digest of the canonical certificate data (computed off-chain). */
        cert_hash: bcs.string(),
        /** Lifecycle status string. */
        status: bcs.string(),
        /** Ordered list of provenance events recorded after minting. */
        history: bcs.vector(ProvenanceEvent),
        /** Address of the wallet that originally minted the certificate. */
        creator: bcs.Address,
        /** Unix timestamp (ms) of the minting transaction. */
        created_at: bcs.u64()
    }
});
export const CertificateCreated = new MoveStruct({
    name: `${$moduleName}::CertificateCreated`, fields: {
        cert_id: bcs.Address,
        creator: bcs.Address,
        name: bcs.string()
    }
});
export const CertificateEventAdded = new MoveStruct({
    name: `${$moduleName}::CertificateEventAdded`, fields: {
        cert_id: bcs.Address,
        event_type: bcs.string(),
        actor: bcs.Address
    }
});
export const CertificateTransferred = new MoveStruct({
    name: `${$moduleName}::CertificateTransferred`, fields: {
        cert_id: bcs.Address,
        from: bcs.Address,
        to: bcs.Address
    }
});
export const CertHashUpdated = new MoveStruct({
    name: `${$moduleName}::CertHashUpdated`, fields: {
        cert_id: bcs.Address,
        new_hash: bcs.string(),
        actor: bcs.Address
    }
});
export interface CreateCertificateArguments {
    name: RawTransactionArgument<string>;
    category: RawTransactionArgument<string>;
    artisanName: RawTransactionArgument<string>;
    location: RawTransactionArgument<string>;
    materials: RawTransactionArgument<string>;
    note: RawTransactionArgument<string>;
    certHash: RawTransactionArgument<string>;
}
export interface CreateCertificateOptions {
    package?: string;
    arguments: CreateCertificateArguments | [
        name: RawTransactionArgument<string>,
        category: RawTransactionArgument<string>,
        artisanName: RawTransactionArgument<string>,
        location: RawTransactionArgument<string>,
        materials: RawTransactionArgument<string>,
        note: RawTransactionArgument<string>,
        certHash: RawTransactionArgument<string>
    ];
}
/**
 * Mint a new `ArtisanCertificate` and transfer it to the calling artisan.
 *
 * Parameters
 *
 * ---
 *
 * `cert_hash` — SHA-256 hex string, computed off-chain from the canonical JSON of
 * the other fields before calling this.
 */
export function createCertificate(options: CreateCertificateOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["name", "category", "artisanName", "location", "materials", "note", "certHash"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'create_certificate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface AddProvenanceEventArguments {
    cert: RawTransactionArgument<string>;
    eventType: RawTransactionArgument<string>;
    location: RawTransactionArgument<string>;
    note: RawTransactionArgument<string>;
}
export interface AddProvenanceEventOptions {
    package?: string;
    arguments: AddProvenanceEventArguments | [
        cert: RawTransactionArgument<string>,
        eventType: RawTransactionArgument<string>,
        location: RawTransactionArgument<string>,
        note: RawTransactionArgument<string>
    ];
}
/**
 * Append a provenance event to an existing certificate. Can only be called by the
 * current owner (enforced by object ownership — the object must be in the caller's
 * possession to pass it as a mutable ref via the SUI object model; the explicit
 * check below guards misuse in PTBs).
 */
export function addProvenanceEvent(options: AddProvenanceEventOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null,
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["cert", "eventType", "location", "note"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'add_provenance_event',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface UpdateCertHashArguments {
    cert: RawTransactionArgument<string>;
    newHash: RawTransactionArgument<string>;
}
export interface UpdateCertHashOptions {
    package?: string;
    arguments: UpdateCertHashArguments | [
        cert: RawTransactionArgument<string>,
        newHash: RawTransactionArgument<string>
    ];
}
/**
 * Update the certificate hash (e.g. after adding a photo URL to the off-chain
 * metadata). Only the current owner can call this.
 */
export function updateCertHash(options: UpdateCertHashOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null,
        '0x1::string::String'
    ] satisfies (string | null)[];
    const parameterNames = ["cert", "newHash"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'update_cert_hash',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CertifyArguments {
    cert: RawTransactionArgument<string>;
}
export interface CertifyOptions {
    package?: string;
    arguments: CertifyArguments | [
        cert: RawTransactionArgument<string>
    ];
}
/**
 * Mark the certificate as "Certified" by its current owner. Typically called after
 * the artisan has verified all metadata off-chain.
 */
export function certify(options: CertifyOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null,
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'certify',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface TransferCertificateArguments {
    cert: RawTransactionArgument<string>;
    recipient: RawTransactionArgument<string>;
}
export interface TransferCertificateOptions {
    package?: string;
    arguments: TransferCertificateArguments | [
        cert: RawTransactionArgument<string>,
        recipient: RawTransactionArgument<string>
    ];
}
/**
 * Transfer the certificate to a new owner (e.g. a buyer or marketplace). The
 * status is automatically updated to "Transferred" and a provenance event is
 * appended so the history is complete.
 */
export function transferCertificate(options: TransferCertificateOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null,
        'address',
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["cert", "recipient"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'transfer_certificate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CloseCertificateArguments {
    cert: RawTransactionArgument<string>;
}
export interface CloseCertificateOptions {
    package?: string;
    arguments: CloseCertificateArguments | [
        cert: RawTransactionArgument<string>
    ];
}
/**
 * Permanently close a certificate (e.g. piece destroyed or decommissioned). Sets
 * status to "Closed". This is irreversible at the smart-contract level.
 */
export function closeCertificate(options: CloseCertificateOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null,
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'close_certificate',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NameArguments {
    cert: RawTransactionArgument<string>;
}
export interface NameOptions {
    package?: string;
    arguments: NameArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function name(options: NameOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'name',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CategoryArguments {
    cert: RawTransactionArgument<string>;
}
export interface CategoryOptions {
    package?: string;
    arguments: CategoryArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function category(options: CategoryOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'category',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface ArtisanNameArguments {
    cert: RawTransactionArgument<string>;
}
export interface ArtisanNameOptions {
    package?: string;
    arguments: ArtisanNameArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function artisanName(options: ArtisanNameOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'artisan_name',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface LocationArguments {
    cert: RawTransactionArgument<string>;
}
export interface LocationOptions {
    package?: string;
    arguments: LocationArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function location(options: LocationOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'location',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface MaterialsArguments {
    cert: RawTransactionArgument<string>;
}
export interface MaterialsOptions {
    package?: string;
    arguments: MaterialsArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function materials(options: MaterialsOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'materials',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface NoteArguments {
    cert: RawTransactionArgument<string>;
}
export interface NoteOptions {
    package?: string;
    arguments: NoteArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function note(options: NoteOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'note',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CertHashArguments {
    cert: RawTransactionArgument<string>;
}
export interface CertHashOptions {
    package?: string;
    arguments: CertHashArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function certHash(options: CertHashOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'cert_hash',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface StatusArguments {
    cert: RawTransactionArgument<string>;
}
export interface StatusOptions {
    package?: string;
    arguments: StatusArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function status(options: StatusOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'status',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CreatorArguments {
    cert: RawTransactionArgument<string>;
}
export interface CreatorOptions {
    package?: string;
    arguments: CreatorArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function creator(options: CreatorOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'creator',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface CreatedAtArguments {
    cert: RawTransactionArgument<string>;
}
export interface CreatedAtOptions {
    package?: string;
    arguments: CreatedAtArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function createdAt(options: CreatedAtOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'created_at',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface HistoryArguments {
    cert: RawTransactionArgument<string>;
}
export interface HistoryOptions {
    package?: string;
    arguments: HistoryArguments | [
        cert: RawTransactionArgument<string>
    ];
}
export function history(options: HistoryOptions) {
    const packageAddress = options.package ?? '@local-pkg/atelier';
    const argumentsTypes = [
        null
    ] satisfies (string | null)[];
    const parameterNames = ["cert"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'atelier',
        function: 'history',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}