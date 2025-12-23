import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { completeOnboarding } from '../lib/api.js';
import toast from 'react-hot-toast';

const useOnboarding = () => {
      const queryClient = useQueryClient();
   const { mutate, isPending } = useMutation({
      mutationFn: completeOnboarding,
      onSuccess: () => {
        toast.success("Profile onboarded successfully");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message);
      }
    });

    return { onboardingMutation: mutate, isPending}
}

export default useOnboarding
