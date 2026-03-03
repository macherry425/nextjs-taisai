

const BetChip = ({ name, amount, isUser }) => {
    return (
        <div className="chip chip--mini" data-value={amount} data-is-user={isUser}>
            <span>
                {name && name[0]}
            </span>
        </div>

    )
}

export default BetChip;

