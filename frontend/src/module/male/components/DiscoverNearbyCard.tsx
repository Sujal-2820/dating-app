import { MaterialSymbol } from '../types/material-symbol';

interface NearbyUser {
  id: string;
  avatar: string;
  name: string;
}

interface DiscoverNearbyCardProps {
  nearbyUsers: NearbyUser[];
  onExploreClick?: () => void;
}

export const DiscoverNearbyCard = ({ nearbyUsers, onExploreClick }: DiscoverNearbyCardProps) => {
  const displayedUsers = nearbyUsers.slice(0, 2);
  const remainingCount = nearbyUsers.length > 2 ? nearbyUsers.length - 2 : 0;

  return (
    <div className="p-4 mt-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-pink-600 shadow-xl">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-30"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHuQ9thR_Q8bw5KyAKuHdBgTxbMQzbTaF9wxH_jdhvxRsseop7AcwAnK-nQYZsye0tERXB0Y0xnV3Hng--TGDar-5kWubelbU-uA6UT36YC2BZuytzzu8YJumnkKpvGxNJfykWfKsESfiA0gHWOYwWy5BmDnVxuUdi65_3Ue4DcdE4xCS6zpEQUJGpOQJl8w-3KNNf7wtaraImiLSW3sD3P7HWIjkKRrwtG6cKn-DFYG50e31fzGKD0ra-Ol3b0Zx6nqPtjHM-HlU")`
          }}
          aria-label="Blurred background image of a city map"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-rose-600/85 to-pink-600/90" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        
        <div className="relative flex items-center justify-between gap-4 p-5">
          <div className="flex flex-[2_2_0px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-bold text-white leading-tight flex items-center gap-2">
                <span>💕</span> Discover Nearby
              </p>
              <p className="text-pink-100 text-sm font-medium leading-normal">
                Find people within 5km
              </p>
            </div>
            <button
              onClick={onExploreClick}
              className="flex w-fit items-center justify-center gap-2 rounded-full bg-white/95 backdrop-blur-sm py-2.5 pl-5 pr-4 text-sm font-bold text-pink-700 transition-all hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 duration-200 shadow-lg border border-white/50"
            >
              Explore
              <MaterialSymbol name="arrow_forward" size={18} />
            </button>
          </div>

          {/* Circular Avatars Stack */}
          <div className="flex flex-1 items-center justify-end -space-x-3 mr-2">
            {displayedUsers.map((user) => (
              <div
                key={user.id}
                className="h-12 w-12 rounded-full border-4 border-white/80 bg-cover bg-center shadow-lg ring-2 ring-pink-200/50"
                style={{ backgroundImage: `url("${user.avatar}")` }}
                aria-label={`Portrait of ${user.name}`}
              />
            ))}
            {remainingCount > 0 && (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white/80 bg-white/20 backdrop-blur-sm text-xs font-bold text-white shadow-lg ring-2 ring-pink-200/50">
                +{remainingCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

