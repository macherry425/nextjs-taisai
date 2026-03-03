// 'use client';

// const isDebug = true;
const isDebug = false;
const emptyBets = { "0": {}, "1": {}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}, "8": {}, "9": {}, "10": {}, "11": {}, "12": {}, "13": {}, "14": {}, "15": {}, "16": {}, "17": {}, "18": {}, "19": {}, "20": {}, "21": {}, "22": {}, "23": {}, "24": {}, "25": {}, "26": {}, "27": {}, "28": {}, "29": {}, "30": {}, "31": {}, "32": {}, "33": {}, "34": {}, "35": {}, "36": {}, "37": {}, "38": {}, "39": {}, "40": {}, "41": {}, "42": {}, "43": {}, "44": {}, "45": {}, "46": {}, "47": {}, "48": {}, "49": {}, "50": {} };

import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";

import caseData from '@/app/data/case.json';
import * as util from '@/utils/game';
import { updateBank } from '@/services/user';
import useQueryUser from "@/hooks/use-query-user";
import { useCleanedState } from "@/hooks/use-cleaned-state";
import { useRouter } from "next/navigation";

import UserInfo from "@/modules/userInfo";
import DealerPanel from "@/modules/dealer/dealerPanel"
import GameBoard from "@/modules/gameBoard"
import Leaderboard from "@/modules/leaderboard"
import PlayerPanel from '../modules/playerPanel';

import * as Ably from 'ably';
import { LiveObjects, LiveMap, LiveCounter } from 'ably/liveobjects';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nanoid } from 'nanoid';
import DealerAlert from '../modules/dealer/dealerAlert';
import DiceResult from '../modules/diceResult';
// style
if (typeof window === "undefined") {
    return null;
}

const realtimeClient = new Ably.Realtime({ key: 'OHNX-Q.2rkk4g:c8OLNnq2LtEP3aGZj_sz6Mu5NLJoGdURMaV01AlrtCg', clientId: '1', plugins: { LiveObjects } });
const channelName = 'objects-live-map';
const channel = realtimeClient.channels.get(channelName, { modes: ['object_publish', 'object_subscribe'] });


const Game = () => {
    // const realtimeClient = new Ably.Realtime({ authUrl: '/api' });

    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const userData = useQueryUser().data;
    const router = useRouter();

    const tel = searchParams.get('tel');
    const [dices, setDices] = useState([]);
    const [caseStatus, setCaseStatus] = useState({});
    const [currentBet, setCurrentBet] = useState([]);
    const [allBets, setAllBets] = useCleanedState({});
    const [dealerTel, setDealerTel] = useState('');
    const [isOpenBet, setIsOpenBet] = useState(false);
    const [betAmount, setBetAmount] = useState(1);
    const [isShowDice, setIsShowDice] = useState(false);
    const [change, setChange] = useState('');
    const [msg, setMsg] = useState(0);

    const [liveObject, setLiveObject] = useState(null);

    const isDealer = dealerTel.length > 0 && dealerTel === tel ? true : false;

    useEffect(() => {
        var tmpAllBets;

        const allBetsOnUpdated = (case_id, tel, name, amount) => {
            tmpAllBets = {
                ...tmpAllBets,
                [case_id]: {
                    ...tmpAllBets[case_id],
                    [tel]: { name: name, amount: amount }
                }
            };
            setAllBets({ ...tmpAllBets });
        }
        const allBetsOnRemoved = (case_id, tel) => {
            delete tmpAllBets[case_id][tel];
            setAllBets(tmpAllBets);
        }

        const initAbly = async () => {
            const myObject = await channel.object.get();
            const gameInstance = myObject.get('game');
       
            const initDice = myObject.get('game').get('dice').value() && myObject.get('game').get('dice').value().length > 0 ? JSON.parse(myObject.get('game').get('dice').value()) : [];
            // case 1: init - dice
            if (initDice) {
                setDices(initDice);
            }
            // case 2: init - dealer tel
            const initDealerTel = myObject.get('game').get('dealer_tel').value();
            if (initDealerTel) {
                setDealerTel(initDealerTel);
            }
            // case 3: init - bets
            var initBet = myObject.get('game').get('all_bet');
            tmpAllBets = initBet.compact();
            setAllBets(tmpAllBets);

            const { unsubscribe } = gameInstance.subscribe(({ object, message }) => {
                if (!message) {
                    return;
                }
                console.log("[Game Instance] update");
                const { operation } = message;
                const key = operation.mapOp.key;
                const newValue = operation.mapOp?.data?.value;
                const path = object.path();
                const paths = path.split(".");

                // case 1: update dice
                if (key === 'dice') {
                    const newDice = JSON.parse(newValue);
                    if (newDice) {
                        setDices(newDice);
                    }
                }
                // case 2: update - set dealer

                if (key === 'dealer_tel') {
                    console.log("[GameInstance] update dealer_tel: ", newValue)
                    if (newValue !== dealerTel || newValue === "") {
                        setDealerTel(newValue);
                    }
                }
                if (key === 'dealer_msg') {
                    console.log("[GameInstance] update dealer_msg: ", newValue)
                    setMsg(val => val + 1);
                }

                // case 3: update - update bets

                //on reset

                if (path === 'game' && key === 'all_bet') {
                    console.log("on reset bet")
                    const newBet = myObject.get('game').get('all_bet').compact();
                    setAllBets(newBet);
                    setIsOpenBet(true)
                    tmpAllBets = emptyBets;
                }
                if (paths[1] === 'all_bet') {
                    console.log("Update all_bet")
                    const case_id = paths[2];
                    const tel = operation.mapOp.key;
                    // on update
                    if (operation.action === 'map.set' && operation.mapOp?.key) {
                        const { name, amount } = JSON.parse(operation.mapOp.data.value);
                        allBetsOnUpdated(case_id, operation.mapOp.key, name, amount);
                    }
                    if (operation.action === 'map.remove' && operation.mapOp?.key) {
                        allBetsOnRemoved(case_id, operation.mapOp.key);
                    }
                }
            })
            setLiveObject(myObject);
        };

        initAbly();


        // Cleanup on unmount
        return () => {
            if (liveObject) {
                liveObject.off(); // Remove listeners when component unmounts
                unsubscribe();
            }
        };
    }, []);

    // query
    const { mutate: updateBankMutate, isPending } = useMutation({
        mutationFn: updateBank,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "1"] });
        },
    });

    const addBet = async (caseId) => {
        if (!isDealer) {
            // console.log("addBet()");
            const _data = JSON.stringify({ name: userData.name, amount: betAmount });
            await liveObject.get('game').get('all_bet').get(caseId.toString()).set(userData.tel, _data);

            setCurrentBet(prevData => {
                // Find the index of the object with the specific 'case' value
                const index = prevData.findIndex(item => item.case === caseId);
                if (index !== -1) {
                    // If it exists, update the amount
                    const newData = [...prevData]; // Create a new array
                    newData[index].amount = betAmount; // Update the amount
                    console.log(`Updated: Case ${caseId}, New Amount: ${betAmount}`);
                    return newData;
                } else {
                    // If it doesn't exist, add a new object
                    const newData = [...prevData, { case: caseId, amount: betAmount }];
                    return newData;
                }
            });
        }


    }

    const removeBet = async (caseId) => {
        await liveObject.get('game').get('all_bet').get(caseId.toString()).remove(tel);
        setCurrentBet(
            currentBet.filter(bet =>
                bet.case !== caseId));
    }

    const settleBet = (caseStatus) => {
        console.log(" currentBet.length", currentBet.length)
        console.log(currentBet)
        console.log(caseStatus)
        if (caseData.length > 0 && currentBet.length > 0 && caseStatus.length > 0) {
            var change = 0;
            console.log(caseStatus)
            currentBet.forEach((bet, id) => {
                const case_id = Number(bet.case);
                const status = caseStatus[case_id].status;
                const amount = bet.amount;
                const win = caseData[case_id].win;

                if (status === true) {
                    var n = 1;
                    if (case_id > 14 && case_id < 21) {
                        const count = caseStatus[case_id].count;
                        n = count;
                    }
                    change += amount * win * n;
                    console.log(caseData[case_id].name, 'win +', amount * win * n)
                } else {
                    change = change - amount;
                    console.log(caseData[case_id].name, 'lose -', -amount)
                }
            })
            console.log("[settleBet] change:", change)
            setChange(change)
            if (change !== 0) {
                updateBankMutate({ tel, change, dealerTel });

            }
        }
    }
    //useEffect
    useEffect(() => {
        if (dices.length > 0) {
            console.log('settleBet')
            checkResult();
            setIsOpenBet(false);
            setIsShowDice(true);
            const timer = setTimeout(() => {
                setIsShowDice(false);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            // new game
            setIsOpenBet(true)
            setCurrentBet([]);
            setChange('');
            queryClient.invalidateQueries({ queryKey: ["users", "1"] });
            queryClient.invalidateQueries({ queryKey: ["user", "1"] });
        }
    }, [dices])

    useEffect(() => {
        if (isDealer) {
            setCaseStatus([])
        }
    }, [isDealer])


    // game
    const rollDice = async () => {
        if (isOpenBet) {
            setIsOpenBet(false);
            const newDice = util.rollThreeDice();
            setDices(newDice);
            await liveObject.get('game').set('dice', JSON.stringify(newDice));
        }
    }
    const checkResult = () => {
        var result = util.checkBet(dices);
        setCaseStatus(result);
        settleBet(result);
    }

    const updateBetAmount = (amount) => {
        setBetAmount(amount);
    }
    // dealer 
    const beDealer = async () => {
        await liveObject.get('game').set('dealer_tel', tel);
    }
    const resetDealer = async () => {
        await liveObject.get('game').set('dealer_tel', '');
    }

    const newGame = async () => {
        setCaseStatus({});
        setCurrentBet([]);
        await resetDiceLiveObject();
        await resetAllBetLiveobject();
    }

    const resetDiceLiveObject = async () => {
        await liveObject.get('game').set('dice', JSON.stringify([]));
    }

    const resetAllBetLiveobject = async () => {
        await liveObject.get('game').set('all_bet', LiveMap.create({
            '0': LiveMap.create({}),
            '1': LiveMap.create({}),
            '2': LiveMap.create({}),
            '3': LiveMap.create({}),
            '4': LiveMap.create({}),
            '5': LiveMap.create({}),
            '6': LiveMap.create({}),
            '7': LiveMap.create({}),
            '8': LiveMap.create({}),
            '9': LiveMap.create({}),
            '10': LiveMap.create({}),
            '11': LiveMap.create({}),
            '12': LiveMap.create({}),
            '13': LiveMap.create({}),
            '14': LiveMap.create({}),
            '15': LiveMap.create({}),
            '16': LiveMap.create({}),
            '17': LiveMap.create({}),
            '18': LiveMap.create({}),
            '19': LiveMap.create({}),
            '20': LiveMap.create({}),
            '21': LiveMap.create({}),
            '22': LiveMap.create({}),
            '23': LiveMap.create({}),
            '24': LiveMap.create({}),
            '25': LiveMap.create({}),
            '26': LiveMap.create({}),
            '27': LiveMap.create({}),
            '28': LiveMap.create({}),
            '29': LiveMap.create({}),
            '30': LiveMap.create({}),
            '31': LiveMap.create({}),
            '32': LiveMap.create({}),
            '33': LiveMap.create({}),
            '34': LiveMap.create({}),
            '35': LiveMap.create({}),
            '36': LiveMap.create({}),
            '37': LiveMap.create({}),
            '38': LiveMap.create({}),
            '39': LiveMap.create({}),
            '40': LiveMap.create({}),
            '41': LiveMap.create({}),
            '42': LiveMap.create({}),
            '43': LiveMap.create({}),
            '44': LiveMap.create({}),
            '45': LiveMap.create({}),
            '46': LiveMap.create({}),
            '47': LiveMap.create({}),
            '48': LiveMap.create({}),
            '49': LiveMap.create({}),
            '50': LiveMap.create({}),
        }))
            .then(() => {
                console.log('all_bet set successfully:', liveObject);

            })
            .catch((error) => {
                console.error('Error setting all_bet:', error);
            });
    }

    const setDealerMsg = async (msg) => {
        const timer = setTimeout(() => {
            console.log('setMsg');
            setMsg(0);
        }, 2000);
        await liveObject.get('game').set('dealer_msg', msg);
    }

    const diceTotal = () => {
        if (dices.length === 3) {
            return dices[0] + dices[1] + dices[2];
        }
    }

    const diceDaisai = () => {
        const total = diceTotal();
        if (total >= 4 && total <= 10) {
            return "小"
        }
        if (total >= 11 && total <= 17) {
            return "大"
        }
    }

    return (

        < div className="game" key={caseStatus.length} >
            <div className="game__main">
                {dices.length === 3 && !isShowDice && <div className="game__top">
                    <div>
                        <div className="text-result ">
                            {caseStatus && caseStatus[2]?.status === true ? "圍骰" :
                                <>
                                    <div className='font-lxgw '>
                                        {diceTotal()}點
                                    </div>
                                    <div className='font-hanyisenty'>
                                        {diceDaisai()}
                                    </div>
                                </>
                            }

                        </div>
                    </div>
                    <div className="game-dice-container">
                        {dices && dices.map((dice, index) => (
                            <img src={`/images/dice/${dice}.svg`} alt="" key={index} className='dice dice--medium' />
                        ))}
                    </div>
                    {change !== 0 && <div className='font-lxgw text-change' data-positive={change > 0} >{change}</div>}

                </div>}

                <GameBoard addBet={addBet} removeBet={removeBet} caseData={caseData} caseStatus={caseStatus} allBets={allBets} isOpenBet={isOpenBet} currentBet={currentBet} betAmount={betAmount}
                    tel={tel} />
                <div className="divider"></div>
                <Leaderboard />
            </div>
            {isShowDice && <DiceResult dices={dices} setIsShowDice={setIsShowDice} />}
            {!dealerTel && <DealerAlert />}
            <div className="bottom-panel">
                <div className="bottom-panel__inner">
                    <UserInfo data={userData} />
                    {isDealer ? <DealerPanel rollDice={rollDice} beDealer={beDealer} newGame={newGame} isOpenBet={isOpenBet} setDealerMsg={setDealerMsg} dices={dices} /> : <><PlayerPanel updateBetAmount={updateBetAmount} betAmount={betAmount} tel={tel} />
                    </>
                    }  <div>
                        {isDealer ? <div className='button button--primary' onClick={resetDealer}>
                            唔做莊！</div> : <div className='button button--primary' onClick={beDealer}>
                            我做莊！</div>
                        }
                    </div>
                </div>
            </div>
            {msg > 0 && <div className='msg-popup' key={msg} data-key={msg}>
                <div className='' >
                    買定離手！
                </div>

            </div>}

        </div >

    );
};

export default Game;
