// import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import css from './Dashboard.module.css'

const Dashboard = () => {
    return (
        <div className='container'>
            <Sidebar />
            <main className={css.dashboard}>
                <p>Main app</p>
            </main>
        </div>
    )
}

export default Dashboard