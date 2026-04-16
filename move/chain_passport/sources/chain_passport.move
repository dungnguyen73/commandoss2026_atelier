// Copyright (c) ChainPassport
// SPDX-License-Identifier: Apache-2.0

module chain_passport::chain_passport {
    use std::string::{String};
    use sui::clock::{Self, Clock};
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    /// The core object representing a product batch in the supply chain.
    public struct OriginItem has key, store {
        id: UID,
        name: String,
        category: String,
        quantity: String,
        farm: String,
        province: String,
        certification: String,
        history: vector<OriginEvent>,
        creator: address,
        created_at: u64,
    }

    /// A sub-structure representing a single event in the product's journey.
    public struct OriginEvent has store, drop, copy {
        event_type: String,
        timestamp: u64,
        location: String,
        note: String,
        actor: address,
    }

    /// Event emitted when a new item is created.
    public struct ItemCreated has copy, drop {
        item_id: ID,
        creator: address,
    }

    /// Create a new OriginItem and transfer it to the sender.
    public fun create_origin_item(
        name: String,
        category: String,
        quantity: String,
        farm: String,
        province: String,
        certification: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);
        
        let mut history = vector::empty<OriginEvent>();
        
        // Add initial "Created" event
        let initial_event = OriginEvent {
            event_type: std::string::utf8(b"Created"),
            timestamp,
            location: province, // Initial location is the province of origin
            note: std::string::utf8(b"Batch registered on-chain"),
            actor: sender,
        };
        vector::push_back(&mut history, initial_event);

        let id = object::new(ctx);
        let item_id = object::uid_to_inner(&id);

        let item = OriginItem {
            id,
            name,
            category,
            quantity,
            farm,
            province,
            certification,
            history,
            creator: sender,
            created_at: timestamp,
        };

        // Emit creation event
        sui::event::emit(ItemCreated {
            item_id,
            creator: sender,
        });

        transfer::public_transfer(item, sender);
    }

    /// Add a new event to an existing OriginItem.
    public fun add_event(
        item: &mut OriginItem,
        event_type: String,
        location: String,
        note: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let timestamp = clock::timestamp_ms(clock);
        let actor = tx_context::sender(ctx);

        let event = OriginEvent {
            event_type,
            timestamp,
            location,
            note,
            actor,
        };

        vector::push_back(&mut item.history, event);
    }

    /// Transfer an OriginItem to a new owner.
    public fun transfer_item(
        item: OriginItem,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        transfer::public_transfer(item, recipient);
    }
}
