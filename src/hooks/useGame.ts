import { FieldCoords, FieldsMap, IField, ISettings } from '../types'
import { useCallback, useEffect, useState } from 'react'

import { randomNumber } from '../utils/helpers'

let cycles = 0

const coordsToKey = ([x, y]: FieldCoords): string => {
    return `[${x},${y}]`
}

const useGame = (settings: ISettings) => {
    // Array of game fields
    const [fields, setFields] = useState<FieldsMap>(new Map())
    // Array of game fields which has been opened
    const [fieldsOpened, setFieldsOpened] = useState(0)
    // Flags count
    const [flagsCount, setFlagsCount] = useState(0)

    // Private methods
    // Checks if given X and Y coordinates are in game field boundaries
    const areCoordsInBoundaries = useCallback(
        ([x, y]: FieldCoords): boolean => {
            return (
                x >= 1 &&
                x <= settings.xFieldsCount &&
                y >= 1 &&
                y <= settings.yFieldsCount
            )
        },
        [settings]
    )

    const findCoordsAround = useCallback(
        ([x, y]: FieldCoords): FieldCoords[] => {
            const coords: FieldCoords[] = [
                [x - 1, y - 1],
                [x, y - 1],
                [x + 1, y - 1],
                [x - 1, y],
                [x + 1, y],
                [x - 1, y + 1],
                [x, y + 1],
                [x + 1, y + 1],
            ]

            const fieldCoords = coords.filter(([x, y]) => {
                cycles += 1
                return areCoordsInBoundaries([x, y])
            })

            return fieldCoords
        },
        [areCoordsInBoundaries]
    )

    const generateEmptyFields = useCallback((): FieldsMap => {
        const fields: FieldsMap = new Map()

        for (let y = 0; y < settings.yFieldsCount; y++) {
            for (let x = 0; x < settings.xFieldsCount; x++) {
                cycles += 1
                const coords: FieldCoords = [x + 1, y + 1]
                fields.set(coordsToKey(coords), {
                    id: x + 1 + settings.xFieldsCount * y,
                    coords,
                    isOpened: false,
                    hasBomb: false,
                    hasFlag: false,
                    bombsAround: 0,
                })
            }
        }

        return fields
    }, [settings])

    const generateFieldsWithBombs = useCallback(
        (firstClicked: IField): FieldsMap => {
            const fields: FieldsMap = generateEmptyFields()
            const fieldsWithBombsIds: Set<number> = new Set()

            // Generate reserved fields which can't have bombs due to the first clicked field
            const reservedIdsAround = findCoordsAround(firstClicked.coords).map(
                (coords: FieldCoords) => {
                    cycles += 1
                    return fields.get(coordsToKey(coords))?.id as number
                }
            )
            const reservedIds = new Set<number>([
                firstClicked.id,
                ...reservedIdsAround,
            ])

            // Random generator for bombs IDs
            while (fieldsWithBombsIds.size < settings.bombsCount) {
                cycles += 1
                const randomBombId = randomNumber(
                    1,
                    settings.xFieldsCount * settings.yFieldsCount
                )

                if (!reservedIds.has(randomBombId)) {
                    fieldsWithBombsIds.add(randomBombId)
                }
            }

            for (const field of fields.values()) {
                cycles += 1
                field.hasBomb = fieldsWithBombsIds.has(field.id)

                if (field.hasBomb) {
                    findCoordsAround(field.coords)
                        // eslint-disable-next-line no-loop-func
                        .map((coords) => {
                            cycles += 1
                            return fields.get(coordsToKey(coords))
                        })
                        // eslint-disable-next-line no-loop-func
                        .forEach((field) => {
                            cycles += 1
                            return field && field.bombsAround++
                        })
                }
            }

            return fields
        },
        [findCoordsAround, generateEmptyFields, settings]
    )

    const openEmptyFields = useCallback(
        (clickedField: IField, fields: FieldsMap): void => {
            const emptiesStack: IField[] = [clickedField]
            const verifiedEmptiesIds = new Set<number>()
            let opened = 0
            let deletedFlags = 0

            // Open currently clicked field
            const clickedFieldToOpen = fields.get(
                coordsToKey(clickedField.coords)
            )

            if (clickedFieldToOpen) {
                clickedFieldToOpen.isOpened = true
                opened += 1
            }

            // Recursively check all empty fields around clicked field
            // and change their `isOpened` flag
            const verifyEmptiesAround = (field: IField) => {
                const coordsAround = findCoordsAround(field.coords)

                for (const coords of coordsAround) {
                    cycles += 1
                    const sibling = fields.get(coordsToKey(coords))

                    if (sibling && !sibling.isOpened) {
                        sibling.isOpened = true
                        opened += 1

                        if (sibling.hasFlag) {
                            sibling.hasFlag = false
                            deletedFlags += 1
                        }

                        if (
                            sibling.bombsAround === 0 &&
                            !emptiesStack.find(({ id }) => id === sibling.id) &&
                            !verifiedEmptiesIds.has(sibling.id)
                        ) {
                            emptiesStack.push(sibling)
                        }
                    }
                }

                verifiedEmptiesIds.add(field.id)
                emptiesStack.shift()

                if (emptiesStack.length > 0) {
                    verifyEmptiesAround(emptiesStack[0])
                }
            }

            verifyEmptiesAround(clickedField)

            if (deletedFlags) {
                setFlagsCount(flagsCount - deletedFlags)
            }

            setFields(new Map(fields))
            setFieldsOpened(fieldsOpened + opened)
        },
        [findCoordsAround, fieldsOpened, flagsCount]
    )

    const openFieldWithBombsAround = useCallback(
        (clickedField: IField): void => {
            for (const field of fields.values()) {
                cycles += 1
                if (clickedField.id === field.id) {
                    field.isOpened = true
                    break
                }
            }

            setFields(new Map(fields))
            setFieldsOpened(fieldsOpened + 1)
        },
        [fields, fieldsOpened]
    )

    const openAllBombs = useCallback((): void => {
        let opened = 0
        for (const field of fields.values()) {
            cycles += 1
            if (field.hasBomb) {
                field.isOpened = true
                opened += 1
            }
            if (opened >= settings.bombsCount) {
                break
            }
        }

        setFields(new Map(fields))
    }, [fields, settings])

    const setFlagValue = useCallback(
        (clickedField: IField, value: boolean) => {
            for (const field of fields.values()) {
                cycles += 1
                if (clickedField.id === field.id) {
                    field.hasFlag = value
                    break
                }
            }

            setFields(new Map(fields))
            setFlagsCount(value ? flagsCount + 1 : flagsCount - 1)
        },
        [fields, flagsCount]
    )

    // Public methods
    const initFields = useCallback(() => {
        setFields(generateEmptyFields())
        setFieldsOpened(0)
        setFlagsCount(0)
    }, [generateEmptyFields])

    // Main public handler for field click
    const openField = useCallback(
        (clickedField: IField) => {
            if (clickedField.isOpened) {
                return
            }

            if (clickedField.hasBomb) {
                // Handle click on field with bomb
                openAllBombs()
            } else if (fieldsOpened === 0) {
                // Handle first click.
                // Regenerate fields with bombs and then open fields around first clicked field.
                // The first click in any game will never be a mine.
                openEmptyFields(
                    clickedField,
                    generateFieldsWithBombs(clickedField)
                )
            } else if (clickedField.bombsAround === 0) {
                // Handle click on empty field and open fields around it.
                openEmptyFields(clickedField, fields)
            } else {
                openFieldWithBombsAround(clickedField)
            }
        },
        [
            fields,
            fieldsOpened,
            generateFieldsWithBombs,
            openEmptyFields,
            openAllBombs,
            openFieldWithBombsAround,
        ]
    )

    const setFlag = useCallback(
        (clickedField: IField) => {
            if (flagsCount >= settings.bombsCount) {
                return
            }

            setFlagValue(clickedField, true)
        },
        [setFlagValue, flagsCount, settings]
    )

    const deleteFlag = useCallback(
        (clickedField: IField) => {
            if (flagsCount < 1) {
                return
            }

            setFlagValue(clickedField, false)
        },
        [setFlagValue, flagsCount]
    )

    // Update debug cycles counter on every fields change
    useEffect(() => {
        console.log(`Cycles count: ${cycles}`)
        cycles = 0
    }, [fields])

    return {
        fields,
        fieldsOpened,
        openField,
        initFields,
        flagsCount,
        setFlag,
        deleteFlag,
    }
}

export default useGame
