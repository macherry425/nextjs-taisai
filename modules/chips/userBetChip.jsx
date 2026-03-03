import BetChip from "./betChip";

const UserBetChip = ({ case_id, allBets, tel }) => {
    const betGroup = allBets ? allBets[case_id] : []; // Get the group of bets
    return (
        (allBets && <div className='user-bet-chips-container' key={case_id} >
            {
                Object.keys(allBets).length > 0 && allBets[case_id] && Object.keys(allBets[case_id]).map(_tel => {
                    const { name, amount } = betGroup[_tel]; // Access the player name
                    return (
                        <BetChip name={name} amount={amount} key={`${name}-${amount}`} isUser={tel === _tel} />
                    );
                })}
        </div>)
    );
}

export default UserBetChip;