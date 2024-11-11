import css from './LastMatch.module.css';

const matchesData = [
  { name: 'elfarhat', date: '21/03/2001', score: '10 : 51', points: '+19', avatar: 'https://picsum.photos/203', color: 'green' },
  { name: 'elfarhat', date: '21/03/2001', score: '23 : 11', points: '+92', avatar: 'https://picsum.photos/203', color: 'yellow' },
  { name: 'elfarhat', date: '21/03/2001', score: '10 : 51', points: '+19', avatar: 'https://picsum.photos/203', color: 'green' },
  { name: 'elfarhat', date: '21/03/2001', score: '23 : 11', points: '+92', avatar: 'https://picsum.photos/203', color: 'yellow' },
  { name: 'elfarhat', date: '21/03/2001', score: '23 : 11', points: '+92', avatar: 'https://picsum.photos/203', color: 'yellow' },
];

const LastMatch = () => {
    return (
        <>
            <div className={css.header}>
                <h3>LAST MATCH</h3>
                <a href="/view-more" className={css.viewMore}>view more</a>
            </div>


            <div className={css.containerBody}>
                <div className={css.line}></div>
                <div className={css.containerList}>
                    <div className={css.weekLabel}>TO WEEK</div>
                    <div className={css.matchList}>
                    {matchesData.map((match, index) => (
                        <div className={`${css.matchItem} ${css[match.color]}`} key={index}>
                        <img src={match.avatar} alt={match.name} className={css.avatar} />
                        <div className={css.matchInfo}>
                            <span className={css.name}>{match.name}</span>
                            <span className={css.date}>{match.date}</span>
                        </div>
                        <span className={css.score}>{match.score}</span>
                        <div className={css.pointsContainer}>
                            <span className={css.points}>{match.points}</span>
                            <img src="/icons/score.svg" alt="score" />
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LastMatch;
