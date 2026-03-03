import { getUser } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useUser = () => {
    const searchParams = useSearchParams();
    const tel = searchParams.get('tel');

    return useQuery({
        queryKey: ["user", '1'],
        queryFn: () => getUser(tel),
    });
};

export default useUser;
