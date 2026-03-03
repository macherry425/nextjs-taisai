'use client';
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { userLogin } from "@/services/user";

import ring from '@/public/images/ring.png';

const Login = () => {
    const [tel, setTel] = useState('');
    const [name, setName] = useState('');
    const [capital, setCapital] = useState(100);
    const router = useRouter();
    const onTelChange = (e) => {
        const cleaned = e.target.value.replace(/\D+/g, '');
        setTel(cleaned);
    };
    const onNameChange = (e) => {
        setName(e.target.value);
    };
    const onCapitalChange = (e) => {
        setCapital(e.target.value);
    };

    const { mutate: loginMutate, isPending } = useMutation({
        mutationFn: userLogin,
        onSuccess: () => {
            console.log("login success");
            // setCookie('user_tel', tel);
            const params = new URLSearchParams();
            params.set("tel", tel);
            router.push(`/?${params.toString()}`);
        },
        onError:()=>{
            // console.log("login fail")
        }
    });

    const randomName = () => {
        const nameList = ["萬馬奔騰", "一馬當先", "駿業宏開", "馬上有成", "馬到功成", "策馬揚鞭", "龍馬精神", "馬年大吉", "福馬臨門", "闔家安康", "馬歲安康", "金馬迎春"];
        return nameList[Math.floor(Math.random() * nameList.length)];
    };
     
    const onLogin = () => {
        console.log('onLogin()')
        // const _name = name.length > 0 ? name : randomName();
        // console.log(_name);
        if (isPending) return;
        if (!tel || tel.length < 8) {
            alert("請輸入正確電話號碼～");
            return;
        }
        loginMutate({ tel, name:name, capital });
    };




    return (<>
        <div className="login">
            <div className="login__panel">
                <div className='login__panel__top'>
                    <img src={ring.src} alt="" className="login__logo" />
                    <div className="login__title">
                       賭大細
                    </div>
                </div>
                <div className="flex gap-5 items-center">
                    <span >*電話: </span>
                    <input 
                        type="tel"
                        value={tel}
                        onChange={onTelChange}
                        maxLength={8}
                    />
                </div>
                <div className="flex gap-5 items-center">
                    <span >花名: </span>
                    <input type="text" className="  border text-sm border-black rounded-md p-2 focus:outline-none"
                        value={name}
                        onChange={onNameChange}
                    />
                </div>
                <div className="flex gap-5 items-center">
                    <span >本金: </span>
                    <input  type="number" className="  border text-sm border-black rounded-md p-2 focus:outline-none"
                        value={capital}
                        onChange={onCapitalChange}
                    />
                </div>
                <div className="flex gap-4  w-full mt-5">
                    <button
                        className="button w-full"
                        onClick={onLogin}
                        disabled={isPending}
                    >
                        {isPending ? "。。。" : "加入"}
                    </button>
                </div>
            </div>
        </div>

    </>);
}
export default Login;