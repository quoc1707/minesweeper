import { GameState, IField, SettingsLevel } from '../types'
import { useCallback, useEffect, useState } from 'react'

import { formatSeconds } from '../utils/helpers'
import useGame from './useGame'
import useInterval from './useInterval'
import useSettings from './useSettings'

const useGameController = () => {
    const { settings, setSettingsByLevel } = useSettings(SettingsLevel.Beginner)
    const {
        fields,
        fieldsOpened,
        openField,
        initFields,
        flagsCount,
        setFlag,
        deleteFlag,
    } = useGame(settings)
    const [timer, setTimer] = useState(0)
    const [formattedTimer, setFormattedTimer] = useState('00:00:00')
    const [gameState, setGameState] = useState<GameState>(GameState.Idle)

    const prepareGame = useCallback(() => {
        initFields()
        setTimer(0)
        setGameState(GameState.Idle)
    }, [initFields])

    const continuePlaying = useCallback(() => {
        setGameState(GameState.Playing)
    }, [])

    const pause = useCallback(() => {
        setGameState(GameState.Pause)
    }, [])

    const onFieldOpen = useCallback(
        (clickedField: IField) => {
            if (clickedField.hasBomb) setGameState(GameState.GameOver)
            else if (fieldsOpened === 0) setGameState(GameState.Playing)

            openField(clickedField)
        },
        [fieldsOpened, openField]
    )

    useInterval(
        () => {
            setTimer(timer + 1)
        },
        gameState === GameState.Playing ? 1000 : null
    )

    useEffect(() => {
        prepareGame()
    }, [prepareGame])

    useEffect(() => {
        prepareGame()
    }, [settings, prepareGame])

    useEffect(() => {
        setFormattedTimer(formatSeconds(timer))
    }, [timer])

    useEffect(() => {
        if (
            fieldsOpened + settings.bombsCount ===
            settings.xFieldsCount * settings.yFieldsCount
        ) {
            alert('Congratulations! You won!')
            setGameState(GameState.GameOver)
        }
    }, [fieldsOpened, settings])

    return {
        settings,
        setSettingsByLevel,
        fields,
        fieldsOpened,
        timer,
        formattedTimer,
        gameState,
        prepareGame,
        continuePlaying,
        pause,
        onFieldOpen,
        flagsCount,
        setFlag,
        deleteFlag,
    }
}

export default useGameController
