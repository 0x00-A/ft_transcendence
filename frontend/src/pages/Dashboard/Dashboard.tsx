import css from './Dashboard.module.css';
import Welcome from '../../components/Welcome';
import CompetitiveOverview from '../../components/CompetitiveOverview';
import Achievements from '../../components/Achievements';
import Leaderboard from '../../components/Leaderboard';
import FriendsList from '../../components/FriendsList';
import LastMatch from '../../components/LastMatch';

const Dashboard = () => {
  return (
    <main className={css.container}>
      <div className={css.heroSection}>
        <Welcome />
        <div className={css.other}>
        </div> 
        <Leaderboard />
      </div>

      <div className={css.mainContent}>
        <div className={css.competitiveOverview}>
          <CompetitiveOverview />
        </div>
        <div className={css.achievements}>
          <Achievements />
        </div>
      </div>

      <div className={css.lastSection}>
        <LastMatch /> 
        <FriendsList />
        
      </div>
    </main>
  );
};

export default Dashboard;


// import React from 'react';
// import css from './Friends.module.css';

// const friendsData = [
//   { id: 1, name: 'rel-isma', level: '2.5', status: 'online', avatar: '/path/to/avatar1.png' },
//   { id: 2, name: 'rel-isma', level: '2.5', status: 'offline', avatar: '/path/to/avatar2.png' },
//   { id: 3, name: 'rel-isma', level: '2.5', status: 'online', avatar: '/path/to/avatar3.png' },
//   { id: 4, name: 'rel-isma', level: '2.5', status: 'online', avatar: '/path/to/avatar4.png' },
//   { id: 5, name: 'rel-isma', level: '2.5', status: 'online', avatar: '/path/to/avatar5.png' },
//   { id: 6, name: 'rel-isma', level: '2.5', status: 'online', avatar: '/path/to/avatar6.png' },
// ];

// const Friends = () => {
//   return (
//     <div className={css.friendsContainer}>
//       <div className={css.header}>
//         <h3>Your Friends</h3>
//         <a href="/friends" className={css.viewMore}>view more</a>
//       </div>
      
//       <div className={css.friendsList}>
//         {friendsData.map(friend => (
//           <div className={css.friendItem} key={friend.id}>
//             <img src={friend.avatar} alt={friend.name} className={css.avatar} />
//             <div className={css.friendInfo}>
//               <span className={css.name}>{friend.name}</span>
//               <span className={css.level}>Level: {friend.level}</span>
//             </div>
//             <div className={`${css.status} ${friend.status === 'online' ? css.online : css.offline}`}>
//               {friend.status}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <button className={css.inviteButton}>Invite your friends &rsaquo;</button>
//     </div>
//   );
// };

// export default Friends;
