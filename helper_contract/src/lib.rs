#![no_std]

use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct HelperContract;

#[contractimpl]
impl HelperContract {
    pub fn get_fee(_env: Env) -> u32 {
        5
    }
}