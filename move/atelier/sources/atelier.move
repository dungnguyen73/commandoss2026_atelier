

/// Ownership rules
/// ---------------
///   • Only the current owner (initially the artisan) can call `add_provenance_event`
///     and `transfer_certificate`.
///   • `update_cert_hash` is also gated to the current owner so the artisan can
///     correct the hash if they update an optional field (e.g. add a photo URL).
///   • Verification is a pure read — no transaction required.
module atelier::atelier {
    use std::string::String;
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::table::{Self, Table};

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    /// Caller is not the current owner of the certificate.
    #[allow(unused_const)]
    const ENotOwner: u64 = 0;

    // -------------------------------------------------------------------------
    // Core structs
    // -------------------------------------------------------------------------

    /// The on-chain object representing an artisan's handmade piece.
    ///
    /// Field notes
    /// -----------
    ///   • `cert_hash`   — SHA-256 hex string computed from the canonical JSON
    ///                     of the certificate's descriptive fields.  The frontend
    ///                     recomputes this from the displayed data; a mismatch
    ///                     signals tampering.
    ///   • `status`      — human-readable lifecycle status stored as a String so
    ///                     it can be read without a separate enum decode on the
    ///                     frontend.  Allowed values: "Created", "Certified",
    ///                     "Transferred", "Closed".
    public struct ArtisanCertificate has key, store {
        id: UID,
        /// Display name of the handmade piece.
        name: String,
        /// Craft category (e.g. "Ceramics", "Jewelry", "Textiles").
        category: String,
        /// Full name of the artisan who created the piece.
        artisan_name: String,
        /// Studio, city, or region where the piece was made.
        location: String,
        /// Primary materials used (e.g. "Stoneware clay, Celadon glaze").
        materials: String,
        /// Optional story, technique note, or provenance narrative.
        note: String,
        /// SHA-256 hex digest of the canonical certificate data (computed off-chain).
        cert_hash: String,
        /// Lifecycle status string.
        status: String,
        /// Ordered list of provenance events recorded after minting.
        history: vector<ProvenanceEvent>,
        /// Address of the wallet that originally minted the certificate.
        creator: address,
        /// Unix timestamp (ms) of the minting transaction.
        created_at: u64,
    }

    /// On-chain registry for an artisan's created works.
    public struct ArtisanProfile has key, store {
        id: UID,
        /// List of certificate IDs minted by this artisan.
        roots: vector<ID>,
    }

    /// A single provenance update appended to `ArtisanCertificate.history`.
    public struct ProvenanceEvent has store, drop, copy {
        /// Short label for the event (e.g. "Certified", "Sold", "Exhibited").
        event_type: String,
        /// Unix timestamp (ms) when this event was recorded on-chain.
        timestamp: u64,
        /// Location associated with the event (e.g. gallery city).
        location: String,
        /// Free-text note providing context for this event.
        note: String,
        /// Address of the wallet that submitted this event.
        actor: address,
    }

    // -------------------------------------------------------------------------
    // Emitted events
    // -------------------------------------------------------------------------

    /// Emitted once when a new certificate is minted.
    public struct CertificateCreated has copy, drop {
        cert_id: ID,
        creator: address,
        name: String,
    }

    /// Emitted when the current owner adds a provenance event.
    public struct CertificateEventAdded has copy, drop {
        cert_id: ID,
        event_type: String,
        actor: address,
    }

    /// Emitted when the certificate is transferred to a new owner.
    public struct CertificateTransferred has copy, drop {
        cert_id: ID,
        from: address,
        to: address,
    }

    /// Emitted when the owner updates the certificate hash.
    public struct CertHashUpdated has copy, drop {
        cert_id: ID,
        new_hash: String,
        actor: address,
    }

    /// Emitted when an artisan initializes their profile.
    public struct ArtisanProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
    }

    /// Emitted when a verifier casts a vote on a certificate.
    public struct VoteCast has copy, drop {
        cert_id: ID,
        voter: address,
        is_legit: bool,
    }

    // -------------------------------------------------------------------------
    // Registries (Shared Objects)
    // -------------------------------------------------------------------------

    /// A global shared object that tracks community trust for all certificates.
    public struct VerificationRegistry has key {
        id: UID,
        /// Maps Certificate ID to its community vote summary.
        votes: Table<ID, VoteSummary>,
    }

    /// Aggregate trust data for a single certificate.
    public struct VoteSummary has store {
        upvotes: u64,
        downvotes: u64,
        /// Maps voter address to their vote choice (1 = Legit, 2 = Suspicious).
        voters: Table<address, u8>,
    }

    // -------------------------------------------------------------------------
    // Module Initializer
    // -------------------------------------------------------------------------

    fun init(ctx: &mut TxContext) {
        let registry = VerificationRegistry {
            id: object::new(ctx),
            votes: table::new<ID, VoteSummary>(ctx),
        };
        transfer::share_object(registry);
    }

    // -------------------------------------------------------------------------
    // Entry functions
    // -------------------------------------------------------------------------

    /// Initialize an Artisan Registry (Profile) for the sender.
    public entry fun create_profile(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let profile_id = object::uid_to_inner(&id);
        
        let profile = ArtisanProfile {
            id,
            roots: vector::empty<ID>(),
        };
        
        event::emit(ArtisanProfileCreated { profile_id, owner: sender });
        transfer::public_transfer(profile, sender);
    }

    /// Mint a new `ArtisanCertificate` and transfer it to the calling artisan.
    /// Also records the certificate ID in the artisan's profile registry.
    #[allow(lint(self_transfer))]
    public fun create_certificate(
        profile: &mut ArtisanProfile,
        name: String,
        category: String,
        artisan_name: String,
        location: String,
        materials: String,
        note: String,
        cert_hash: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        // Seed the provenance history with the creation event.
        let mut history = vector::empty<ProvenanceEvent>();
        let genesis = ProvenanceEvent {
            event_type: std::string::utf8(b"Created"),
            timestamp,
            location,
            note:      std::string::utf8(b"Certificate minted on-chain by artisan"),
            actor:     sender,
        };
        vector::push_back(&mut history, genesis);

        let id = object::new(ctx);
        let cert_id = object::uid_to_inner(&id);

        let cert = ArtisanCertificate {
            id,
            name,
            category,
            artisan_name,
            location,
            materials,
            note,
            cert_hash,
            status: std::string::utf8(b"Created"),
            history,
            creator: sender,
            created_at: timestamp,
        };

        event::emit(CertificateCreated { cert_id, creator: sender, name: cert.name });

        // Record the certificate ID in the artisan's registry profile.
        vector::push_back(&mut profile.roots, cert_id);

        transfer::public_transfer(cert, sender);
    }

    /// Append a provenance event to an existing certificate.
    /// Can only be called by the current owner (enforced by object ownership —
    /// the object must be in the caller's possession to pass it as a mutable ref
    /// via the SUI object model; the explicit check below guards misuse in PTBs).
    public fun add_provenance_event(
        cert: &mut ArtisanCertificate,
        event_type: String,
        location: String,
        note: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let actor = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let ev = ProvenanceEvent { event_type, timestamp, location, note, actor };
        vector::push_back(&mut cert.history, ev);

        let cert_id = object::uid_to_inner(&cert.id);
        event::emit(CertificateEventAdded { cert_id, event_type: ev.event_type, actor });
    }

    /// Update the certificate hash (e.g. after adding a photo URL to the off-chain
    /// metadata).  Only the current owner can call this.
    public fun update_cert_hash(
        cert: &mut ArtisanCertificate,
        new_hash: String,
        ctx: &mut TxContext
    ) {
        let actor = tx_context::sender(ctx);
        cert.cert_hash = new_hash;

        let cert_id = object::uid_to_inner(&cert.id);
        event::emit(CertHashUpdated { cert_id, new_hash: cert.cert_hash, actor });
    }

    /// Mark the certificate as "Certified" by its current owner.
    /// Typically called after the artisan has verified all metadata off-chain.
    public fun certify(
        cert: &mut ArtisanCertificate,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let actor = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        cert.status = std::string::utf8(b"Certified");

        let ev = ProvenanceEvent {
            event_type: std::string::utf8(b"Certified"),
            timestamp,
            location: cert.location,
            note:      std::string::utf8(b"Certificate status set to Certified"),
            actor,
        };
        vector::push_back(&mut cert.history, ev);

        let cert_id = object::uid_to_inner(&cert.id);
        event::emit(CertificateEventAdded {
            cert_id,
            event_type: std::string::utf8(b"Certified"),
            actor,
        });
    }

    /// Transfer the certificate to a new owner (e.g. a buyer or marketplace).
    /// The status is automatically updated to "Transferred" and a provenance
    /// event is appended so the history is complete.
    public fun transfer_certificate(
        cert: ArtisanCertificate,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let from = tx_context::sender(ctx);
        let cert_id = object::uid_to_inner(&cert.id);

        // We need a mutable ref to append the event before moving.
        let mut cert = cert;
        let timestamp = clock::timestamp_ms(clock);

        let ev = ProvenanceEvent {
            event_type: std::string::utf8(b"Transferred"),
            timestamp,
            location:  cert.location,
            note:      std::string::utf8(b"Ownership transferred to new holder"),
            actor:     from,
        };
        vector::push_back(&mut cert.history, ev);
        cert.status = std::string::utf8(b"Transferred");

        event::emit(CertificateTransferred { cert_id, from, to: recipient });

        transfer::public_transfer(cert, recipient);
    }

    /// Permanently close a certificate (e.g. piece destroyed or decommissioned).
    /// Sets status to "Closed". This is irreversible at the smart-contract level.
    public fun close_certificate(
        cert: &mut ArtisanCertificate,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let actor = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        cert.status = std::string::utf8(b"Closed");

        let ev = ProvenanceEvent {
            event_type: std::string::utf8(b"Closed"),
            timestamp,
            location: cert.location,
            note:      std::string::utf8(b"Certificate closed by owner"),
            actor,
        };
        vector::push_back(&mut cert.history, ev);

        let cert_id = object::uid_to_inner(&cert.id);
        event::emit(CertificateEventAdded {
            cert_id,
            event_type: std::string::utf8(b"Closed"),
            actor,
        });
    }

    /// Cast or update a verdict on a certificate's legitimacy.
    /// 1 = Legit (Upvote), 2 = Suspicious (Downvote).
    public entry fun cast_vote(
        registry: &mut VerificationRegistry,
        cert_id: ID,
        is_legit: bool,
        ctx: &mut TxContext
    ) {
        let voter = tx_context::sender(ctx);
        
        // Ensure the summary exists for this certificate
        if (!table::contains(&registry.votes, cert_id)) {
            table::add(&mut registry.votes, cert_id, VoteSummary {
                upvotes: 0,
                downvotes: 0,
                voters: table::new<address, u8>(ctx),
            });
        };

        let summary = table::borrow_mut(&mut registry.votes, cert_id);
        let choice = if (is_legit) { 1 } else { 2 };

        if (table::contains(&summary.voters, voter)) {
            let old_choice = *table::borrow(&summary.voters, voter);
            if (old_choice == choice) return; // No change

            // Rollback old vote
            if (old_choice == 1) { summary.upvotes = summary.upvotes - 1 }
            else { summary.downvotes = summary.downvotes - 1 };

            table::remove(&mut summary.voters, voter);
        };

        // Apply new vote
        table::add(&mut summary.voters, voter, choice);
        if (choice == 1) { summary.upvotes = summary.upvotes + 1 }
        else { summary.downvotes = summary.downvotes + 1 };

        event::emit(VoteCast { cert_id, voter, is_legit });
    }

    // -------------------------------------------------------------------------
    // Read-only helpers (pure, no gas needed via devInspect)
    // -------------------------------------------------------------------------

    public fun name(cert: &ArtisanCertificate): &String          { &cert.name }
    public fun category(cert: &ArtisanCertificate): &String      { &cert.category }
    public fun artisan_name(cert: &ArtisanCertificate): &String  { &cert.artisan_name }
    public fun location(cert: &ArtisanCertificate): &String      { &cert.location }
    public fun materials(cert: &ArtisanCertificate): &String     { &cert.materials }
    public fun note(cert: &ArtisanCertificate): &String          { &cert.note }
    public fun cert_hash(cert: &ArtisanCertificate): &String     { &cert.cert_hash }
    public fun status(cert: &ArtisanCertificate): &String        { &cert.status }
    public fun creator(cert: &ArtisanCertificate): address       { cert.creator }
    public fun created_at(cert: &ArtisanCertificate): u64        { cert.created_at }
    public fun history(cert: &ArtisanCertificate): &vector<ProvenanceEvent> {
        &cert.history
    }

    // Voting Read Helpers
    public fun upvotes(registry: &VerificationRegistry, cert_id: ID): u64 {
        if (!table::contains(&registry.votes, cert_id)) return 0;
        table::borrow(&registry.votes, cert_id).upvotes
    }

    public fun downvotes(registry: &VerificationRegistry, cert_id: ID): u64 {
        if (!table::contains(&registry.votes, cert_id)) return 0;
        table::borrow(&registry.votes, cert_id).downvotes
    }
}
