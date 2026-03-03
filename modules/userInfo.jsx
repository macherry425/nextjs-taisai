"use client";
import { useEffect, useState } from "react";
import { updateCapital } from "@/services/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const UserInfo = (userData) => {

    const { data, isLoading, error } = userData;
    const [amount, setAmount] = useState(50);
    const { tel, name, bank, capital } = data || { tel: '', name: '', bank: '', capital: '' };
    const queryClient = useQueryClient();
    const router = useRouter();

    const onAmountChange = (e) => {
        setAmount(e.target.value);
    };
    const onAdd = () => {
        console.log('add')
        updateCapitalMutate({ tel, amount })
    }

    const { mutate: updateCapitalMutate, isPending } = useMutation({
        mutationFn: updateCapital,
        onSuccess: () => {
            console.log("add success");
            queryClient.invalidateQueries({ queryKey: ["user", "1"] });
            queryClient.invalidateQueries({ queryKey: ["users", "1"] });
        }

    });


    return (<>
        {data && <div className="user">
            <div className="user__left">
                <div className="user__name ">
                    {name}
                </div>
                <div>
                    錢錢: {bank}
                </div>
                <div>
                    贏輸: {bank - capital}
                </div>
            </div>

            <div className="user__right">

                <input type="text" className=" input --small focus:outline-none"
                    value={amount}
                    onChange={onAmountChange}
                />
                <button
                    className="button"
                    onClick={onAdd}
                    disabled={isPending}
                >
                    {isPending ? "。。。" : "入錢"}
                </button>

            </div>

        </div>
        }

    </>)
}

export default UserInfo;