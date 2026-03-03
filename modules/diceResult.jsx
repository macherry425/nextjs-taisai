import Dice from 'modern-react-dice-roll';
import { useEffect, useRef } from 'react';

const DiceResult = ({ dices, setIsShowDice }) => {
    const refs = useRef([null, null, null]);
    const handleRoll = (value) => {
        // console.log(`You rolled a ${value}!`);
    };
    useEffect(() => {

        // divRef.current.rollDice()
        refs.current.forEach((el) => {
            if (el) {
                el.rollDice()
            }
        })
    }, [refs]);


    return <>
        <div className="dice-result-container" onClick={() => { setIsShowDice(false) }}>

            <div className="dice-result__inner">{
                dices.map((dice, id) => {
                    return (<Dice onRoll={handleRoll} cheatValue={dice} ref={(el) => (refs.current[id] = el)} size={100} triggers={[]} key={id} sound={id === 0 ? '/sound/dice-1.mp3' : ''} />)
                })
            }

            </div>

        </div></>
}

export default DiceResult;