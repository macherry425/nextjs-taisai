'use client';
import * as Ably from 'ably';
import { LiveObjects, LiveMap, LiveCounter } from 'ably/liveobjects';

import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import caseData from '../data/case.json';
import * as util from '../../utils/game';


// style
const winningBet = 'bg-green-200';
const Game = () => {


    //connection 
    // const realtimeClient = new Ably.Realtime({ authUrl: '/api' });

    const realtimeClient = new Ably.Realtime({ key: 'bRVG8Q.RXJq_Q:dTKLGV9B1ykpKYA4qRybOvMcxzzmEVPp1BWDr1SDhfA', plugins: { LiveObjects } });

    const channelName = 'objects-live-map';
    const channel = realtimeClient.channels.get(channelName, { modes: ['object_publish', 'object_subscribe'] });



    async function main() {
        const tasksObject = await channel.object.get();

        await initTasks(tasksObject);
  
    }

    async function initTasks(tasks) {
        // Subscribe to all changes for the tasks object
        tasks.subscribe(({ message }) => {
            if (!message) {
                return;
            }

            // Handle individual task updates
            // const { operation } = message;
            // if (operation.action === 'map.set' && operation.mapOp?.key) {
            //   tasksOnUpdated(operation.mapOp.key, tasks);
            // } else if (operation.action === 'map.remove' && operation.mapOp?.key) {
            //   tasksOnRemoved(operation.mapOp.key);
            // }
        });


    }
    // const
    const [dices, setDices] = useState([]);
    const [caseStatus, setCaseStatus] = useState({});
    const [currentBet, setCurrentBet] = useState(
        [{ case: 1, amount: 50 }]
    );

    const [userData, setUserData] = useState(
        {
            id: 1,
            name: 'Keki',
            capital: 100,
            bank: 100
        }
    )

    const addBet = (caseId) => {
        console.log("addBet()")

        var newBet = { case: caseId, amount: 50 };
        setCurrentBet([...currentBet, newBet])

    }

    const removeBet = (caseId) => {


        setCurrentBet(
            currentBet.filter(bet =>
                bet.case !== caseId));
    }



    const settleBet = () => {
        //for each user
        //for each case, 

        const difference = 50 * 1;
        //newamount user.amount +difference
        var newAmount = userData.bank + difference;
        setUserData({ ...userData, bank: newAmount });

    }


    // game
    const rollDice = () => {
        setDices(util.rollThreeDice());
    }
    const checkResult = () => {
        var result = util.checkBet(dices);
        setCaseStatus(result);
    }
    useEffect(() => {
        main()
        .then()
        .catch((e) => console.error(e));
    }, [])
    return (
        <div>
            <div>

                <div>
                    Dice:
                    {dices && dices.map((dice, index) => (
                        <span key={index}>{dice},  </span>
                    ))}
                </div>
                <div>
                    <div className="border " onClick={rollDice}>Roll dice</div>
                </div>
            </div>

            <div className="flex gap-10">
                <div className="flex flex-col gap-1">
                    <div>
                        name:{userData.name}
                    </div>
                    <div>
                        id:{userData.id}
                    </div>
                    <div>
                        capital:{userData.capital}
                    </div>
                    <div>
                        bank:{userData.bank}
                    </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                    <div className="flex  gap-10 case">
                        <div>1:</div>
                        <button onClick={() => addBet(1)} >add bet</button>
                        <button onClick={() => removeBet(1)} >remove bet</button>
                    </div>
                    <div className="flex  gap-10 case">
                        <div>2:</div>
                        <button onClick={() => addBet(2)} >add bet</button>
                        <button onClick={() => removeBet(2)} >remove bet</button>
                    </div>
                </div> */}
                <div>
                    <h1>CurrentBet:</h1>
                    <ul>
                        {currentBet.map((bet, index) => (
                            <li key={index}>case:{bet.case} , amount:{bet.amount}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
                <button onClick={settleBet}>Settle</button>
                <div className="border" onClick={checkResult}>Check result</div>
            </div>
            <hr />
            <ol className='flex flex-wrap gap-5'>
                {caseData.map((_case, index) => (
                    <li className={`border border-gray-500 flex-15 ${caseStatus.length > 0 && caseStatus[index].status ? winningBet : ''}`} key={index} >

                        <h6>{index}:{_case.name}
                        </h6>
                        <div className="flex  flex-col gap-1 case">

                            <div className='border border-black' onClick={() => addBet(index)} >add bet</div>
                            <div className='border border-black' onClick={() => removeBet(index)} >remove bet</div>
                        </div>
                    </li>
                ))}
            </ol>

        </div>

    );
};

export default Game;
