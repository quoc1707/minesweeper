import { memo, useCallback } from 'react'

import Panel from './Panel'
import { SettingsLevel } from '../types'
import cn from 'classnames'
import { settings } from '../hooks/useSettings'
import style from '../styles/components/Settings.module.css'

interface IProps {
    className?: string
    level: SettingsLevel
    onLevelChange: (level: SettingsLevel) => void
}

const Settings = ({ className = '', level, onLevelChange }: IProps) => {
    const handleLevelChange = useCallback(
        (settingsLevel: SettingsLevel) => () => onLevelChange(settingsLevel),
        [onLevelChange]
    )

    return (
        <Panel className={cn(style.Settings, className)}>
            {settings.map((s) => (
                <button
                    key={s.level}
                    className={cn(style.button, {
                        [style.isActive]: level === s.level,
                    })}
                    onClick={handleLevelChange(s.level)}>
                    {s.level}
                </button>
            ))}
        </Panel>
    )
}

export default memo(Settings)
