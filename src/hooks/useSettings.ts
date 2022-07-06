import { ISettings, SettingsLevel } from '../types'
import { useCallback, useState } from 'react'

export const settings: ISettings[] = [
    {
        level: SettingsLevel.Beginner,
        xFieldsCount: 10,
        yFieldsCount: 10,
        bombsCount: 10,
    },
    {
        level: SettingsLevel.Intermediate,
        xFieldsCount: 16,
        yFieldsCount: 16,
        bombsCount: 40,
    },
    {
        level: SettingsLevel.Expert,
        xFieldsCount: 30,
        yFieldsCount: 16,
        bombsCount: 99,
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
