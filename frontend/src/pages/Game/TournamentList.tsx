import React, { useEffect, useState } from 'react';
import axios from 'axios';
import css from './TournamentList.module.css'
import { useGetData } from '../../api/apiHooks';

import ArcadeLoader from './ArcadeLoader/ArcadeLoader';
import ErrorMessage from './ErrorMessage/ErrorMessage';


interface User {
    id: number;
    username: string;
}

interface Tournament {
    id: number;
    name: string;
    creator: User;
    created_at: string; // Use `Date` if you plan to parse it into a Date object
    participants_count: number;
    number_of_players: number;
    user_id: number,
    players: number[],
}


const TournamentList = ({handleJoin}: {handleJoin:(tournamentId: number, refetch: () => void) => void}) => {
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
  const { data: tournaments, isLoading, error, refetch } = useGetData<Tournament[]>('matchmaker/tournaments');

    function isInTournament(players: number[], player_id: number) {
        return players.some(id => id === player_id);
    }




    // if (error) return <p>error</p>

    return (
        <div className={css.container}>
            {/* Header Row */}
            <div className={css.header}>
                <div className={`${css.col} ${css.id}`}>ID</div>
                <div className={`${css.col} ${css.name}`}>Name</div>
                <div className={`${css.col} ${css.creator}`}>Creator</div>
                <div className={`${css.col} ${css.date}`}>Creation Date</div>
                <div className={`${css.col} ${css.players}`}>Players</div>
                <div className={`${css.col} ${css.action}`}>Action</div>
            </div>

            {/* List of Tournaments */}

            <div className={css.tournamentList}>
                {tournaments?.map((tournament) => (
                    <div key={tournament.id} className={`${css.row}`}>
                        <div className={`${css.col} ${css.id}`}>{tournament.id}</div>
                        <div className={`${css.col} ${css.name}`}>{tournament.name}</div>
                        <div className={`${css.col} ${css.creator}`}>{tournament.creator.username}</div>
                        <div className={`${css.col} ${css.date}`}>{new Date(tournament.created_at).toLocaleDateString()}</div>
                        <div className={`${css.col} ${css.players}`}>
                            {tournament.participants_count}/{tournament.number_of_players}
                        </div>
                        <div className={`${css.col} ${css.action}`}>
                            {!isInTournament(tournament.players, tournament.user_id)?
                            <button onClick={() => handleJoin(tournament.id, refetch)}>Join</button> :
                            <button onClick={() => alert(`view tournament ${tournament.id}`)}>View</button>}
                        </div>
                    </div>
                ))}
                {!error && !isLoading && !tournaments?.length && <div className={css.noTournaments}>
                        <p>No tournaments available at the moment.</p>
                    </div>}
                {error && <div className={css.errorWrapper}>
                    <ErrorMessage/>
                    </div>}
                {!error && isLoading && <div className={css.loaderWrapper}>
                    <ArcadeLoader/>
                </div>}
            </div>
        </div>
    );
};

export default TournamentList;
