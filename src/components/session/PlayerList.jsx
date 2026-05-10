import PlayerChip from '../ui/PlayerChip';

export default function PlayerList({ players, onRemovePlayer }) {
  const emojis = ['👽', '👻', '🤖', '🤡', '🤠', '😈', '🦁', '🦖', '🦊', '🦄', '🐸', '🐼'];
  
  return (
    <div className="flex flex-wrap gap-2 justify-center my-4">
      {players.map((player, index) => (
        <PlayerChip 
          key={index} 
          name={player.name || player} 
          emoji={emojis[index % emojis.length]} 
          onRemove={onRemovePlayer ? () => onRemovePlayer(index) : undefined}
        />
      ))}
    </div>
  );
}
