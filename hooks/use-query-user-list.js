import { getUserList } from "@/services/user";
import { useQuery } from "@tanstack/react-query";

const UseQueryUserList = () => {
  
    return useQuery({
        queryKey: ["users", '1'],
        queryFn: () => getUserList(),
    });
};

export default UseQueryUserList;
