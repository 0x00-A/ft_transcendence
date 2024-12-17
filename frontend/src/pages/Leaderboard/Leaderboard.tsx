import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Link } from "react-router-dom"


import css from './Leaderboard.module.css';
import { Flag } from "lucide-react";

const users = [
  {
    id: 0,
    username: '@username',
    score: '1400',
    country: 'Morroco',
  },
]

const Leaderboard = () => {
  return (
    <main className={css.container}>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="h-20 w-[40px] text-center">#</TableHead>
            <TableHead className="h-20 w-[200px]">Username</TableHead>
            <TableHead className="h-20 w-[100px]">Score</TableHead>
            <TableHead className="h-20 w-[150px]">Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
              <TableRow className="hover:bg-gray-500 dark:hover:bg-gray-800 transition-colors h-20">
                <TableCell className="text-center font-medium">{user.id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" alt="@username1" />
                      <AvatarFallback>U1</AvatarFallback>
                    </Avatar>
                    <Link to="#" className="text-blue-500 hover:underline">
                      {user.username}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="">{user.score}</TableCell>
                <TableCell className="flex items-center justify-start">
                  <span className="sr-only">{user.country}</span>
                  <Flag />
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Leaderboard;