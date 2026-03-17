%lang starknet

from contracts.ShieldedPool import ShieldedPool

@external
func test_deposit{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}():
    let amount = Uint256(100, 0)
    ShieldedPool.deposit(amount)
    let (deposit) = ShieldedPool.get_deposit(12345)  # Test user
    assert deposit.low = 100
    return ()
end