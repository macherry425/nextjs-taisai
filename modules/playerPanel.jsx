
const chips = [1, 5, 10, 25, 50, 100];

const PlayerPanel = ({ updateBetAmount, betAmount }) => {

    return (

        <div className="chips-panel">

            <div className="chip" onClick={() => { updateBetAmount(1) }} data-active={1 === betAmount ? true : false} data-value={1}>
                <span>
                    1
                </span>
            </div>
            <div className="chip" onClick={() => { updateBetAmount(5) }} data-active={5 === betAmount ? true : false}  data-value={5}>
                <span>
                    5
                </span>
            </div>
            <div className="chip" onClick={() => { updateBetAmount(10) }} data-active={10 === betAmount ? true : false}  data-value={10}>
                <span>
                    10
                </span>
            </div>
            <div className="chip" onClick={() => { updateBetAmount(25) }} data-active={25 === betAmount ? true : false}  data-value={25}>
                <span>
                    25
                </span>
            </div>
            <div className="chip" onClick={() => { updateBetAmount(50) }} data-active={50 === betAmount ? true : false}  data-value={50}>
                <span>
                    50
                </span>
            </div>
            <div className="chip" onClick={() => { updateBetAmount(100) }} data-active={100 === betAmount ? true : false}  data-value={100}>
                <span>
                    100
                </span>
            </div>
        </div>

    )
}

export default PlayerPanel;