import cn from 'classnames'
import { memo } from 'react'
import style from '../styles/components/Statistics.module.css'

interface IProps {
    value: string
    icon: string
    title: string
    className?: string
}

const Statistics = ({ className = '', title, icon, value }: IProps) => {
    return (
        <div className={cn(style.Statistics, className)} title={title}>
            <div className={style.emoji}>{icon}</div>
            <div className={style.value}>{value}</div>
        </div>
    )
}

export default memo(Statistics)
