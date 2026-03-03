const DealerPanel = ({ rollDice, newGame, isOpenBet, setDealerMsg,dices }) => {
    return (<>
        <div className="py-5 flex flex-col items-center">
            <div className="text-xl mb-2">莊家</div>
            <div className='flex gap-3'>
                <div className="button" onClick={() => setDealerMsg(1)} data-active={isOpenBet}>
                    買定離手！
                </div>
                <div className="button" onClick={rollDice} data-active={isOpenBet && dices.length === 0}>
                    擲骰！
                </div>
                <div className="button" onClick={newGame} >
                    下一局！
                </div>
            </div>
        </div>

    </>)
}

export default DealerPanel;