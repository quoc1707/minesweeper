import { ReactNode } from 'react'
import cn from 'classnames'
import style from '../styles/components/Panel.module.css'

interface IProps {
    children: ReactNode
    className?: string
}

const Panel = ({ className = '', children }: IProps) => {
    return <div className={cn(style.Panel, className)}>{children}</div>
}

export default Panel
