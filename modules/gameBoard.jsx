import { useEffect, useState } from "react";
import UserBetChip from "./chips/userBetChip";
const winningBet = 'bg-green-200';

const UserBet = ({ case_id, allBets }) => {
    const betGroup = allBets[case_id]; // Get the group of bets
    return (
        <div className='border border-black rounded bg-pink-100' key={case_id} >
            {
                Object.keys(allBets).length > 0 && allBets[case_id] && Object.keys(allBets[case_id]).map(tel => {
                    const { name, amount } = betGroup[tel]; // Access the player name
                    return (
                        <div key={tel}>
                            {name}
                        </div>

                    );
                })}
        </div>
    );
}

const Dice = ({ num }) => {
    return (<>
        <div className="dice" data-num={num}></div>
    </>

    )
}

const DicesGrid = ({ num, win, dice_amount, id, allBets, caseStatus, isOpenBet, tel }) => {
    return (
        <>
            <div className="gameboard__grid" data-win={!isOpenBet && caseStatus && caseStatus.length > 0 && caseStatus[id].status} data-case={id}>
                <div className="dice-grid" data-amount={dice_amount}>
                    {Array.from({ length: dice_amount }, (_, i) => (
                        <Dice num={num} key={i} />
                    ))}
                </div>
                <div className='text-tiny'>1 賠 {win}</div>
                {allBets && <UserBetChip tel={tel} case_id={id} allBets={allBets} />}

            </div>
        </>
    )
}

const TwoDices = ({ num }) => {
    return <>
        <div className="dice--two">
            <Dice num={num[0]} />
            <Dice num={num[1]} />
        </div>
    </>
}

const Gameboard = ({ addBet, removeBet, caseData, caseStatus, allBets, isOpenBet, currentBet, betAmount, tel }) => {

    const tripletCases_1 = caseData.slice(3, 6);
    const tripletCases_2 = caseData.slice(6, 9);
    const doubleCases = caseData.slice(9, 15);
    const singleCases = caseData.slice(15, 21);
    const totalCases = caseData.slice(21, 35);
    const dicesCases = caseData.slice(35, 50);

    const toggleBet = (case_id) => {
        function hasBet(obj, outerKey, innerId) {
            return !!(obj && obj[outerKey] && Object.prototype.hasOwnProperty.call(obj[outerKey], innerId));
        }

        if (hasBet(allBets, case_id, tel)) {
            console.log('allbets:', allBets)
            console.log('allbets:', allBets[Number(case_id)][tel].amount)
            const isSameAmount = allBets[Number(case_id)][tel].amount === betAmount;
            if (isSameAmount) {
                removeBet(case_id);

            } else {
                addBet(case_id);
            }

        } else {
            addBet(case_id);
        }
    }

    const handleContainerClick = (e) => {
        // console.log('clicked', e);

        // find nearest .my-item
        const itemEl = e.target.closest('.gameboard__grid');
        // console.log(itemEl)
        if (!itemEl || !e.currentTarget.contains(itemEl)) return;

        const case_id = itemEl.dataset.case;   // data-outer attribute
        toggleBet(case_id);
    };

    useEffect(() => { console.log("[Gameboard] case status updated") }, [caseStatus])
    return (<>
        <div className={` gameboard-container`} data-active={isOpenBet}>

            {/* new */}
            <div className="gameboard" onClick={handleContainerClick}>
                <div className="gameboard__row">
                    <div className="gameboard__grid" data-win={!isOpenBet && caseStatus.length > 0 && caseStatus[0].status} data-case={0} key={isOpenBet}>
                        <div className="font-hanyisenty">
                            小
                        </div>
                        <div className='font-bold' >4 - 10</div>
                        <div className='text-tiny'>圍骰通吃</div>
                        <div className='text-tiny'>1 賠 1</div>
                        <UserBetChip tel={tel} case_id={0} allBets={allBets} />
                    </div>
                    {doubleCases.map((_case, id) => {
                        return <DicesGrid key={id} num={_case.dice} dice_amount={2} win={_case.win} id={_case.id} allBets={allBets} caseStatus={caseStatus} isOpenBet={isOpenBet} tel={tel} />
                    })}
                    <div className="gameboard__grid" data-win={!isOpenBet && caseStatus.length > 0 && caseStatus[1].status} data-case={1}>
                        <div className="font-hanyisenty">
                            大
                        </div>
                        <div className='font-bold' >11-17</div>
                        <div className='text-tiny'>圍骰通吃</div>
                        <div className='text-tiny'>1 賠 1</div>
                        <UserBetChip tel={tel} case_id={1} allBets={allBets} />
                    </div>
                </div>

                <div className="gameboard__row">

                    {tripletCases_1.map((_case, id) => {
                        return <DicesGrid key={id} num={_case.dice} dice_amount={3} win={_case.win} id={_case.id} allBets={allBets} caseStatus={caseStatus} isOpenBet={isOpenBet} tel={tel} />
                    })}
                    <div className="gameboard__grid" data-win={!isOpenBet && caseStatus.length > 0 && caseStatus[2].status} data-case={2}>
                        <div className="font-hanyisenty">
                            任意圍骰
                        </div>
                        <div className='text-tiny'>1 賠 24</div>
                        <UserBetChip tel={tel} case_id={2} allBets={allBets} />
                    </div>
                    {tripletCases_2.map((_case, id) => {
                        return <DicesGrid key={id} num={_case.dice} dice_amount={3} win={_case.win} id={_case.id} allBets={allBets} isOpenBet={isOpenBet} tel={tel} />
                    })}
                </div>

                <div className="gameboard__row">
                    {totalCases.map((_case, id) => {
                        return (
                            <div className="gameboard__grid" data-win={!isOpenBet && caseStatus.length > 0 && caseStatus[_case.id].status} key={id} data-case={_case.id}>
                                <div>
                                    {_case.total}
                                </div>
                                <div className='text-tiny'>1 賠 {_case.win}</div>
                                <UserBetChip tel={tel} case_id={_case.id} allBets={allBets} />
                            </div>
                        )
                    })}
                </div>
                <div className="gameboard__row">
                    {dicesCases.map((_case, id) => {
                        return (
                            <div className="gameboard__grid" data-win={!isOpenBet && caseStatus.length > 0 && caseStatus[_case.id].status} key={id} data-case={_case.id}>
                                <TwoDices num={_case.dice} />
                                <div className='text-tiny'>1 賠 {_case.win}</div>
                                <UserBetChip tel={tel} case_id={_case.id} allBets={allBets} />
                            </div>
                        )
                    })}
                </div>
                <div className="gameboard__row">
                    {singleCases.map((_case, id) => {
                        return (
                            <div className="gameboard__grid" data-win={!isOpenBet && caseStatus.length > 0 && caseStatus[_case.id].status} key={id} data-case={_case.id}>
                                <div>
                                    <Dice num={id+1} />
                                </div>
                                <div className='text-tiny'>1 賠 {_case.win}</div>
                                <UserBetChip tel={tel} case_id={_case.id} allBets={allBets} />
                            </div>
                        )
                    })}
                </div>

            </div>
            {/* old */}
            {/* <ol className='flex flex-wrap gap-5'>
                {caseData.map((_case, index) => (
                    <li className={`border border-gray-500 flex-1 p-2 rounded ${caseStatus.length > 0 && caseStatus[index].status ? winningBet : ''}`} key={index} >
                        <h6>{index}:{_case.name}
                        </h6>
                        <div className="flex  flex-col gap-1 case">
                            <div className='border border-black' onClick={() => addBet(index)} >add bet</div>
                            <div className='border border-black' onClick={() => removeBet(index)} >remove bet</div>
                        </div>
                        <div>
                            <UserBet case_id={index} allBets={allBets} />
                        </div>
                    </li>
                ))}
            </ol> */}

        </div >

    </>)
}

export default Gameboard;