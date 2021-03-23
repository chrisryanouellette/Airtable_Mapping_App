import { Field, Table, View } from '@airtable/blocks/models'
import { AllMappings, FieldMapping, Mappings } from './types'

export function parseMappings(raw: string): Mappings | null {
	try {
		const mappings: Mappings = JSON.parse(raw)
		if (!mappings?.bases || !mappings.tables || !mappings.views) {
			throw new Error(
				'Missing required field in mappings ( bases, tables, or views ).'
			)
		}
		return mappings
	} catch (error) {
		console.error(error.message)
		return null
	}
}

/** Finds an existing refName or makes a new one */
export function handleRefName(args: {
	id: string
	model: Table | View | Field
	mappings: { [refName: string]: AllMappings | FieldMapping }
	newMappings: { [refName: string]: AllMappings | FieldMapping }
}): string {
	const { id, model, mappings, newMappings } = args
	let refName =
		Object.values(mappings).find((mapping) => mapping.id === id)?.refName ||
		createRefName(model.name)
	if (
		(mappings[refName] || newMappings[refName]) &&
		mappings[refName]?.id !== id
	) {
		refName = refName + Math.floor(Math.random() * 100).toString()
	}
	return refName
}

export function createRefName(name: string): string {
	const words = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9 ]/g, '')
		.split(' ')
	return (
		words[0] +
		words
			.slice(1)
			.map(
				(word) =>
					`${word.substring(0, 1).toUpperCase()}${word.slice(1)}`
			)
			.join('')
	)
}

export function splitRefName(refName: string): string {
	let formatted = ''
	refName.split('').forEach((char, index) => {
		if (index === 0) {
			formatted = char.toUpperCase()
		} else if (/([A-Z])/.test(char)) {
			formatted = formatted + ' ' + char
		} else {
			formatted = formatted + char
		}
	})

	return formatted
}

export function sortByProp<T>(list: T[], prop: string): T[] {
	return list.sort((a, b) => {
		if (a[prop] < b[prop]) return -1
		if (a[prop] > b[prop]) return 1
		return 0
	})
}

export function findArrDiff(arr1: string[], arr2: string[]): string[] {
	return arr1
		.filter((refName) => !arr2.includes(refName))
		.concat(arr2.filter((refName) => !arr1.includes(refName)))
}
