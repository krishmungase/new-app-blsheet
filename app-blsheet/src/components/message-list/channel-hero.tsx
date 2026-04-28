import { Channel } from "@/types";
import { format } from "date-fns";

const ChannelHero = ({ channel }: { channel: Channel }) => {
  return (
    <div className="mt-[88px] mx-4 mb-4">
      <div className="text-2xl font-bold flex items-center mb-2">
        # {channel.name}
      </div>
      <p className="font-normal mb-4">
        This channel was created on {format(channel.createdAt, "MMMM do, yyyy")}
        . This is the very beginning of the <strong>{channel.name}</strong>
      </p>
    </div>
  );
};

export default ChannelHero;
