'use client';

import { use, useEffect, useState } from "react";
import * as util from '@/utils/game';
import caseData from '@/app/data/case.json';


const Gameboard = ({ caseData, caseStatus }) => {
    return (<>
        <div className={''}>
            <ol className='flex flex-wrap gap-5'>
                {caseData.map((_case, index) => (
                    <li className={`border border-gray-500 flex-1 p-2 rounded ${caseStatus[index].status ? 'bg-green-200' : ''}`} key={index} >
                        <h6>{index}:{_case.name}
                        </h6>
                    </li>
                ))}
            </ol>
        </div >

    </>)
}

const PreviewPage = () => {
    const [dice, setDice] = useState([1, 1, 1]);
    const [val, setVal] = useState(111);
    const [caseStatus, setCaseStatus] = useState();

    const onDiceChange = (e) => {
        const cleaned = e.target.value.replace(/\D+/g, '');
        const arr = [Number(cleaned[0]), Number(cleaned[1]), Number(cleaned[2])];
        console.log(arr)
        setVal(cleaned);
        setDice(arr);
    };

    useEffect(() => {
        console.log('dice change')
        const hasNull = dice.includes(NaN);
        if (!hasNull) {
            setCaseStatus(util.checkBet(dice));

        }
    }, [dice])

    return (<>
        <div className="p-2 flex flex-col gap-10">
            <div className='font-bold text-3xl'>  Debug page</div>
            <div>
                Dice: {JSON.stringify(dice)}
                <input
                    type="number"
                    value={val}
                    onChange={onDiceChange}
                    maxLength={3}
                />

            </div>
            {caseStatus && <>   <Gameboard caseStatus={caseStatus} caseData={caseData} />
                <div className="divider"></div>
                <div>
                    {JSON.stringify(caseStatus)}
                </div></>}

        </div>

    </>);

}
export default PreviewPage;