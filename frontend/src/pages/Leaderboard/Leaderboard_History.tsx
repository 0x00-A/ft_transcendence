import { LeaderBoard } from "@/types/apiTypes";
import GamesHistory from "./GamesHistory";

// Styles
import css from './Leaderboard_History.module.css';
import Leaderboard from "./Leaderboard";

const Leaderboard_History = () => {

  return (
      <div className={css.container}>
        <Leaderboard />
        <GamesHistory />
      </div>
  );
};

export default Leaderboard_History;