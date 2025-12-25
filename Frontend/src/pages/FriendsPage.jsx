import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUserFriends } from '../lib/api.js'
import { UsersIcon } from 'lucide-react'
import FriendCard from '../components/FriendCard.jsx'
import NoFriendsFound from '../components/NoFriendsFound.jsx'

const FriendsPage = () => {
  // Fetch only the friends list
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <UsersIcon className="size-8 text-primary" />
              My Connections
            </h1>
            <p className="text-base-content/70 mt-1">
              Manage your language learning partners
            </p>
          </div>
          
          <div className="badge badge-lg badge-primary badge-outline">
            {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : friends.length === 0 ? (
          <div className="py-10">
            <NoFriendsFound />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendsPage