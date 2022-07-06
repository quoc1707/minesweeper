import { GameState, IField } from '../types'
import { MouseEvent as ReactMouseEvent, memo, useCallback } from 'react'

import cn from 'classnames'
import style from '../styles/components/Field.module.css'

interface IProps {
    field: IField
    gameState: GameState
    onOpen: (field: IField) => void
    onSetFlag: (field: IField) => void
    onDeleteFlag: (field: IField) => void
}

const Field = ({
    field,
    gameState,
    onOpen,
    onSetFlag,
    onDeleteFlag,
}: IProps) => {
    const isDisabled =
        gameState === GameState.Pause || gameState === GameState.GameOver
    let label: number | string = ''

    if (field.isOpened) {
        if (field.hasBomb) label = '💣'
        else if (field.bombsAround) label = field.bombsAround
    } else if (field.hasFlag) label = '🚩'

    const classes = cn({
        [style.Field]: true,
        [style.isOpened]: field.isOpened,
        [style.hasOpenedBomb]: field.isOpened && field.hasBomb,
        [style.dangerLevel1]: field.isOpened && field.bombsAround === 1,
        [style.dangerLevel2]: field.isOpened && field.bombsAround === 2,
        [style.dangerLevel3]: field.isOpened && field.bombsAround === 3,
        [style.dangerLevel4]: field.isOpened && field.bombsAround === 4,
        [style.dangerLevel5]: field.isOpened && field.bombsAround === 5,
        [style.dangerLevel6]: field.isOpened && field.bombsAround >= 6,
    })

    const handleClick = useCallback(() => {
        if (!field.hasFlag) onOpen(field)
    }, [field, onOpen])

    const handleContextMenuClick = useCallback(
        (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault()
            if (gameState === GameState.Playing && !field.isOpened) {
                field.hasFlag ? onDeleteFlag(field) : onSetFlag(field)
            }
        },
        [field, onSetFlag, onDeleteFlag, gameState]
    )

    return (
        <button
            className={classes}
            disabled={isDisabled}
            onClick={handleClick}
            onContextMenu={handleContextMenuClick}>
            {label}
        </button>
    )
}

export default memo(Field)
