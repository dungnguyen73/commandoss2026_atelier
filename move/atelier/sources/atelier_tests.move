

#[test_only]
module atelier::atelier_tests {
    use std::string;
    use sui::clock;
    use sui::test_scenario::{Self as ts, Scenario};
    use atelier::atelier::{Self, ArtisanCertificate};

    // ── Helpers ────────────────────────────────────────────────────────────────

    const ARTISAN: address = @0xA711;
    const BUYER:   address = @0xB177;

    fun s(bytes: vector<u8>): string::String { string::utf8(bytes) }

    /// Mint a certificate inside a test scenario and return it.
    fun mint_cert(scenario: &mut Scenario) {
        let clock = clock::create_for_testing(ts::ctx(scenario));

        atelier::create_certificate(
            s(b"Celadon Teapot No.12"),
            s(b"Ceramics"),
            s(b"Nguyen Thi Lan"),
            s(b"Hanoi, Vietnam"),
            s(b"Stoneware clay, Celadon glaze"),
            s(b"Wheel-thrown and reduction-fired at cone 10."),
            s(b"a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d41234abcd"),
            &clock,
            ts::ctx(scenario),
        );

        clock::destroy_for_testing(clock);
    }

    // ── Tests ──────────────────────────────────────────────────────────────────

    #[test]
    fun test_create_certificate() {
        let mut scenario = ts::begin(ARTISAN);

        ts::next_tx(&mut scenario, ARTISAN);
        mint_cert(&mut scenario);

        // Confirm the artisan received the certificate object.
        ts::next_tx(&mut scenario, ARTISAN);
        {
            let cert = ts::take_from_sender<ArtisanCertificate>(&scenario);

            assert!(*atelier::name(&cert)         == s(b"Celadon Teapot No.12"),   0);
            assert!(*atelier::category(&cert)     == s(b"Ceramics"),               1);
            assert!(*atelier::artisan_name(&cert) == s(b"Nguyen Thi Lan"),         2);
            assert!(*atelier::location(&cert)     == s(b"Hanoi, Vietnam"),         3);
            assert!(*atelier::materials(&cert)    == s(b"Stoneware clay, Celadon glaze"), 4);
            assert!(*atelier::status(&cert)       == s(b"Created"),                5);
            // History must contain only the genesis "Created" event.
            assert!(vector::length(atelier::history(&cert)) == 1,                  6);

            ts::return_to_sender(&scenario, cert);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_certify_updates_status_and_history() {
        let mut scenario = ts::begin(ARTISAN);

        ts::next_tx(&mut scenario, ARTISAN);
        mint_cert(&mut scenario);

        ts::next_tx(&mut scenario, ARTISAN);
        {
            let mut cert = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let clock    = clock::create_for_testing(ts::ctx(&mut scenario));

            atelier::certify(&mut cert, &clock, ts::ctx(&mut scenario));

            assert!(*atelier::status(&cert) == s(b"Certified"), 0);
            // History: "Created" + "Certified" = 2 events.
            assert!(vector::length(atelier::history(&cert)) == 2, 1);

            clock::destroy_for_testing(clock);
            ts::return_to_sender(&scenario, cert);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_add_provenance_event() {
        let mut scenario = ts::begin(ARTISAN);

        ts::next_tx(&mut scenario, ARTISAN);
        mint_cert(&mut scenario);

        ts::next_tx(&mut scenario, ARTISAN);
        {
            let mut cert = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let clock    = clock::create_for_testing(ts::ctx(&mut scenario));

            atelier::add_provenance_event(
                &mut cert,
                s(b"Exhibited"),
                s(b"Paris, France"),
                s(b"Shown at Salon du Craft 2026"),
                &clock,
                ts::ctx(&mut scenario),
            );

            // History: "Created" + "Exhibited" = 2 events.
            assert!(vector::length(atelier::history(&cert)) == 2, 0);

            clock::destroy_for_testing(clock);
            ts::return_to_sender(&scenario, cert);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_update_cert_hash() {
        let mut scenario = ts::begin(ARTISAN);

        ts::next_tx(&mut scenario, ARTISAN);
        mint_cert(&mut scenario);

        ts::next_tx(&mut scenario, ARTISAN);
        {
            let mut cert  = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let new_hash  = s(b"deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef");

            atelier::update_cert_hash(&mut cert, new_hash, ts::ctx(&mut scenario));

            assert!(*atelier::cert_hash(&cert) == new_hash, 0);

            ts::return_to_sender(&scenario, cert);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_transfer_certificate() {
        let mut scenario = ts::begin(ARTISAN);

        ts::next_tx(&mut scenario, ARTISAN);
        mint_cert(&mut scenario);

        // Artisan transfers to buyer.
        ts::next_tx(&mut scenario, ARTISAN);
        {
            let cert  = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let clock = clock::create_for_testing(ts::ctx(&mut scenario));

            atelier::transfer_certificate(cert, BUYER, &clock, ts::ctx(&mut scenario));

            clock::destroy_for_testing(clock);
        };

        // Buyer now holds the certificate with "Transferred" status.
        ts::next_tx(&mut scenario, BUYER);
        {
            let cert = ts::take_from_sender<ArtisanCertificate>(&scenario);

            assert!(*atelier::status(&cert) == s(b"Transferred"), 0);
            // History: "Created" + "Transferred" = 2 events.
            assert!(vector::length(atelier::history(&cert)) == 2, 1);

            ts::return_to_sender(&scenario, cert);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_close_certificate() {
        let mut scenario = ts::begin(ARTISAN);

        ts::next_tx(&mut scenario, ARTISAN);
        mint_cert(&mut scenario);

        ts::next_tx(&mut scenario, ARTISAN);
        {
            let mut cert = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let clock    = clock::create_for_testing(ts::ctx(&mut scenario));

            atelier::close_certificate(&mut cert, &clock, ts::ctx(&mut scenario));

            assert!(*atelier::status(&cert) == s(b"Closed"), 0);
            assert!(vector::length(atelier::history(&cert)) == 2, 1);

            clock::destroy_for_testing(clock);
            ts::return_to_sender(&scenario, cert);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_full_lifecycle() {
        let mut scenario = ts::begin(ARTISAN);

        // 1. Artisan mints.
        ts::next_tx(&mut scenario, ARTISAN);
        mint_cert(&mut scenario);

        // 2. Artisan certifies.
        ts::next_tx(&mut scenario, ARTISAN);
        {
            let mut cert = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let clock    = clock::create_for_testing(ts::ctx(&mut scenario));
            atelier::certify(&mut cert, &clock, ts::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
            ts::return_to_sender(&scenario, cert);
        };

        // 3. Artisan adds "Exhibited" event.
        ts::next_tx(&mut scenario, ARTISAN);
        {
            let mut cert = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let clock    = clock::create_for_testing(ts::ctx(&mut scenario));
            atelier::add_provenance_event(
                &mut cert,
                s(b"Exhibited"),
                s(b"Tokyo, Japan"),
                s(b"Featured at Japan Craft Week"),
                &clock,
                ts::ctx(&mut scenario),
            );
            clock::destroy_for_testing(clock);
            ts::return_to_sender(&scenario, cert);
        };

        // 4. Artisan transfers to buyer.
        ts::next_tx(&mut scenario, ARTISAN);
        {
            let cert  = ts::take_from_sender<ArtisanCertificate>(&scenario);
            let clock = clock::create_for_testing(ts::ctx(&mut scenario));
            atelier::transfer_certificate(cert, BUYER, &clock, ts::ctx(&mut scenario));
            clock::destroy_for_testing(clock);
        };

        // 5. Verify buyer owns cert with 4 history entries.
        ts::next_tx(&mut scenario, BUYER);
        {
            let cert = ts::take_from_sender<ArtisanCertificate>(&scenario);
            // Events: Created, Certified, Exhibited, Transferred
            assert!(vector::length(atelier::history(&cert)) == 4, 0);
            assert!(*atelier::status(&cert) == s(b"Transferred"), 1);
            ts::return_to_sender(&scenario, cert);
        };

        ts::end(scenario);
    }
}
