import { ISettings, SettingsLevel } from '../types'
import { useCallback, useState } from 'react'

export const settings: ISettings[] = [
    {
        level: SettingsLevel.Beginner,
        xFieldsCount: 8,
        yFieldsCount: 8,
        bombsCount: 6,
    },
    {
        level: SettingsLevel.Intermediate,
        xFieldsCount: 12,
        yFieldsCount: 12,
        bombsCount: 43,
    },
    {
        level: SettingsLevel.Expert,
        xFieldsCount: 16,
        yFieldsCount: 16,
        bombsCount: 128,
    },
]

const getSettingsByLevel = (level: SettingsLevel): ISettings => {
    return settings.find((s) => s.level === level) || settings[0]
}

const useSettings = (initialLevel: SettingsLevel) => {
    const [settings, setSettings] = useState<ISettings>(
        getSettingsByLevel(initialLevel)
    )

    const setSettingsByLevel = useCallback((level: SettingsLevel) => {
        setSettings(getSettingsByLevel(level))
    }, [])

    return {
        settings,
        setSettings,
        setSettingsByLevel,
    }
}

export default useSettings
