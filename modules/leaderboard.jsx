import UseQueryUserList from "@/hooks/use-query-user-list";

const Leaderboard = () => {
    const { data, isLoading, error } = UseQueryUserList();
    const { users = [] } = data || {};
    return (<>
        <div className="leaderboard">
            {!isLoading && users.length === 0 && <div>---</div>}
            <div className="leaderboard__item  leaderboard__header">
                <div className="leaderboard__item__left ">
                    排行榜
                </div>
                <div className="leaderboard__item__right ">
                    <div className="leaderboard__item__number">
                        錢錢
                    </div>
                    <div className="leaderboard__item__number">
                        贏輸
                    </div>
                </div>
            </div>
            <div className="leaderboard__list">

                {isLoading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
                {!isLoading &&
                    users.map((user, index) => (
                        <div className="leaderboard__item" key={`leaderboard-${index}`}>
                            <div className="leaderboard__item__left">
                                <div>{index + 1}</div>
                                <div className="font-bold" >
                                    {user.name}
                                </div>
                            </div>
                            <div className="leaderboard__item__right ">
                                <div className="leaderboard__item__number" data-negative={user.bank < 0}>
                                    {user.bank}
                                </div>
                                <div className="leaderboard__item__number" data-negative={user.bank - user.capital < 0}>
                                    {user.bank - user.capital}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>


        </div>
    </>)
}

export default Leaderboard;