import React, { useEffect, useState } from 'react';
import axios from 'axios';
import css from './TournamentList.module.css'
import { useGetData } from '../../api/apiHooks';

interface Creator {
    id: number;
    username: string;
}

interface Tournament {
    id: number;
    name: string;
    creator: Creator;
    created_at: string; // Use `Date` if you plan to parse it into a Date object
    participants_count: number;
    max_participants: number;
}


const TournamentList = () => {
    // const [tournaments, setTournaments] = useState([]);

    // useEffect(() => {
    //     const fetchTournaments = async () => {
    //         try {
    //             const response = await axios.get('/api/matchmaker/tournaments/');
    //             setTournaments(response.data);
    //         } catch (error) {
    //             console.error('Error fetching tournaments:', error);
    //         }
    //     };

    //     fetchTournaments();
    // }, []);
  const { data: tournaments, isLoading, error } = useGetData<Tournament[]>('matchmaker/tournaments');


    const handleJoin = (tournamentId: number) => {
        // client.onopen = () => {
        //     client.send(JSON.stringify({
        //         action: "join_tournament",
        //         tournament_id: tournamentId,
        //     }));
        // };

        // client.onmessage = (message) => {
        //     const data = JSON.parse(message.data);
        //     if (data.success) {
        //         alert("Successfully joined the tournament!");
        //     } else if (data.error) {
        //         alert(data.error);
        //     }
        // };
    };

    return (
        <div className={css.activeTournaments}>
            <h2>Active Tournaments</h2>
            <table className={css.tournamentTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Creator</th>
                        <th>Creation Date</th>
                        <th>Players</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map((tournament) => (
                        <tr key={tournament.id}>
                            <td>{tournament.id}</td>
                            <td>{tournament.name}</td>
                            <td>{tournament.creator.username}</td>
                            <td>{new Date(tournament.created_at).toLocaleDateString()}</td>
                            <td>{tournament.participants_count}/{tournament.max_participants}</td>
                            <td>
                                <button onClick={() => handleJoin(tournament.id)}>Join</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TournamentList;
