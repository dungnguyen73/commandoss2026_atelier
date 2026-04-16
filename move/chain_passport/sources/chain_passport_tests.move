#[test_only]
module chain_passport::chain_passport_tests {
    use sui::test_scenario;
    use sui::clock::{Self, Clock};
    use chain_passport::chain_passport::{Self, OriginItem};
    use std::string;

    #[test]
    fun test_mint_and_history() {
        let admin = @0xAD;
        let user1 = @0x42;
        let mut scenario_val = test_scenario::begin(admin);
        let scenario = &mut scenario_val;

        // 1. Setup Clock
        let clock_obj = clock::create_for_testing(test_scenario::ctx(scenario));
        clock::share_for_testing(clock_obj);
        test_scenario::next_tx(scenario, admin);
        
        let mut clock = test_scenario::take_shared<Clock>(scenario);
        clock::set_for_testing(&mut clock, 1000);

        // 2. Mint OriginItem
        chain_passport::create_origin_item(
            string::utf8(b"Organic Coffee"),
            string::utf8(b"Beverage"),
            string::utf8(b"100kg"),
            string::utf8(b"Doi Chang Farm"),
            string::utf8(b"Chiang Rai"),
            string::utf8(b"Organic Thailand"),
            &clock,
            test_scenario::ctx(scenario)
        );

        test_scenario::next_tx(scenario, user1);

        // 3. Verify Item
        let mut item = test_scenario::take_from_address<OriginItem>(scenario, admin);
        
        // 4. Add Event
        clock::set_for_testing(&mut clock, 2000);
        chain_passport::add_event(
            &mut item,
            string::utf8(b"In Transit"),
            string::utf8(b"Chiang Mai Warehouse"),
            string::utf8(b"Temperature controlled"),
            &clock,
            test_scenario::ctx(scenario)
        );

        // 5. Transfer Item
        chain_passport::transfer_item(item, user1, test_scenario::ctx(scenario));

        test_scenario::next_tx(scenario, user1);

        // 6. Verify Ownership change
        let item_user1 = test_scenario::take_from_address<OriginItem>(scenario, user1);
        
        test_scenario::return_to_address(user1, item_user1);
        test_scenario::return_shared(clock);
        test_scenario::end(scenario_val);
    }
}
