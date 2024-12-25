import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

import css from './Leaderboard.module.css';
import { Flag } from "lucide-react";
import {  API_GET_LEADER_BOARD_URL } from "@/api/apiConfig";
import { useGetData } from "@/api/apiHooks";
import { LeaderBoard } from "@/types/apiTypes";
import GamesHistory from "./GamesHistory";

const users = [
  {
    id: 0,
    username: '@username',
    score: '1400',
    country: 'Morroco',
  },
];

const Leaderboard = () => {
  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetData<LeaderBoard[]>(API_GET_LEADER_BOARD_URL);

  if (isLoading) {
    return (
      <div className={css.container}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <main className={css.container}>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="h-20 w-[40px] text-center">#Rank</TableHead>
            <TableHead className="h-20 w-[200px]">Username</TableHead>
            <TableHead className="h-20 w-[200px]">Games</TableHead>
            <TableHead className="h-20 w-[200px]">Win Rate</TableHead>
            <TableHead className="h-20 w-[200px]">Lose Rate</TableHead>
            <TableHead className="h-20 w-[100px]">Score</TableHead>
            {/* <TableHead className="h-20 w-[150px]">Country</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData &&
            leaderboardData?.length > 0 &&
            leaderboardData?.map((data: LeaderBoard, index: number) => (
              <TableRow
                key={index}
                className="hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors h-20"
              >
                <TableCell className="text-center font-medium">
                  {data.rank}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={data.avatar} alt="@username1" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Link to="#" className="text-blue-500 hover:underline">
                      {data.username}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="">{data.played_games}</TableCell>
                <TableCell className="">
                  {Number.isInteger(data.win_rate)
                    ? data.win_rate
                    : data.win_rate.toFixed(2)}
                  %
                </TableCell>
                <TableCell className="">
                  {Number.isInteger(data.lose_rate)
                    ? data.lose_rate
                    : data.lose_rate.toFixed(2)}
                  %
                </TableCell>
                <TableCell className="">{data.score}</TableCell>
                {/* <TableCell className="flex items-center justify-start">
                  <span className="sr-only">{data.country}</span>
                  <Flag />
                </TableCell> */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* <div className="text-center mt-4">
        <Link to="/leaderboard" className="text-blue-500 hover:underline">View All Leaderboard</Link>
      </div> */}
    </main>
  );
};

export default Leaderboard;
