import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSubscriptions, addSubscription, removeSubscription } from '../services/subscriptions';
import { useAuth } from './useAuth';

export const useSubscriptions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading, error } = useQuery({
    queryKey: ['subscriptions', user?.uid],
    queryFn: () => user ? getUserSubscriptions(user.uid) : Promise.resolve([]),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: ({ ticker }: { ticker: string }) => {
      if (!user) throw new Error('User not authenticated');
      return addSubscription(user.uid, ticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', user?.uid] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ ticker }: { ticker: string }) => {
      if (!user) throw new Error('User not authenticated');
      return removeSubscription(user.uid, ticker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', user?.uid] });
    },
  });

  return {
    subscriptions,
    isLoading,
    error,
    addSubscription: (ticker: string) => addMutation.mutate({ ticker }),
    removeSubscription: (ticker: string) => removeMutation.mutate({ ticker }),
    isSubscribed: (ticker: string) => subscriptions.includes(ticker),
  };
};
