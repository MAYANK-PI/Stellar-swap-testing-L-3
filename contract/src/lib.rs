#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Env};

#[contract]
pub struct SwapContract;

#[contractimpl]
impl SwapContract {

    pub fn swap(env: Env, amount_in: i128, min_amount_out: i128) -> i128 {

        if amount_in <= 0 {
            panic!("Invalid input amount");
        }

        // Demo swap logic (1:1 conversion)
        let output = amount_in;

        if output < min_amount_out {
            panic!("Slippage too high");
        }

        // Emit swap event
        env.events().publish(
            (symbol_short!("swap"),),
            output
        );

        output
    }
}