import Game from './Game'
import style from '../styles/components/App.module.css'

const App = () => {
    return (
        <main className={style.App}>
            <div className={style.container}>
                <Game />
            </div>
        </main>
    )
}

export default App
