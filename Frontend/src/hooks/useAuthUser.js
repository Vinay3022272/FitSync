import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api"; // Ensure this path is correct

const useAuthUser = () => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  // We use authData directly (assuming getAuthUser returns the user object)
  return {
    isLoading,
    authUser: authData,
  };
};

export default useAuthUser;
