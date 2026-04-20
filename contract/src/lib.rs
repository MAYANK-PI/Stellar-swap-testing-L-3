#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Env, Address, IntoVal, Symbol};

#[contract]
pub struct SwapContract;

#[contractimpl]

impl SwapContract {

    pub fn swap(
        env: Env,
        helper_addr: Address,
        amount_in: i128,
        min_amount_out: i128,
    ) -> i128 {

        if amount_in <= 0 {
            panic!("Invalid amount");
        }

        // 🔥 CALL CONTRACT-B (correct way)
        let fee_percent: u32 = env.invoke_contract(
            &helper_addr,
            &Symbol::new(&env, "get_fee"),
            ().into_val(&env),
        );

        let fee = amount_in * fee_percent as i128 / 100;
        let output = amount_in - fee;

        if output < min_amount_out {
            panic!("Slippage too high");
        }

        env.events().publish((symbol_short!("swap"),), output);

        output
    }
}