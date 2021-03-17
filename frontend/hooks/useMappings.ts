import { useCallback, useState } from 'react'
import { createRefName } from '../helpers'
import {
	AllMappings,
	BaseMapping,
	FieldMapping,
	Mappings,
	TableMapping,
	ViewMapping,
} from '../types'

export type UpdateMappings = (
	key: 'bases' | 'tables' | 'views',
	newMappings: {
		[refName: string]: AllMappings
	}
) => void

export function useMappings(): {
	mappings: Mappings
	setMappings: UpdateMappings
} {
	const [mappings, setmappings] = useState<Mappings>({
		bases: {},
		tables: {},
		views: {},
	})

	const updateMappings = useCallback(function (
		key: 'bases' | 'tables' | 'views' | 'field',
		newMappings: {
			[refName: string]: AllMappings
		}
	): void {
		function isBaseMappings(mappings: {
			[refName: string]: AllMappings
		}): mappings is { [refName: string]: BaseMapping } {
			return 'tables' in Object.values(mappings)[0]
		}

		function isTableMappings(mappings: {
			[refName: string]: AllMappings
		}): mappings is { [refName: string]: TableMapping } {
			return 'views' in Object.values(mappings)[0]
		}

		function isViewMappings(mappings: {
			[refName: string]: AllMappings
		}): mappings is { [refName: string]: ViewMapping } {
			return 'fields' in Object.values(mappings)[0]
		}

		function mergeMappings<
			T extends AllMappings
		>(...mappings: T[]): { [refName: string]: T } {
			const merged: T[] = []
			mappings.forEach((current) => {
				const existing = merged.find(
					(mapping) => mapping.id === current.id
				)
				if (!existing) {
					merged.push(current)
				}
			})
			return Object.fromEntries(
				merged.map((mapping) => {
					const refName =
						mapping.refName || createRefName(mapping.name)
					return [refName, mapping]
				})
			)
		}

		function removeOldReference(
			items: { [index: string]: string },
			itemId: string,
			newRefName: string
		): { [index: string]: string } {
			Object.entries(items).forEach(([refName, id]) => {
				if (id === itemId && refName !== newRefName) {
					delete items[refName]
				}
			})
			return items
		}

		if (key === 'bases' && isBaseMappings(newMappings)) {
			mappings[key] = mergeMappings<BaseMapping>(
				...Object.values(mappings.bases),
				...Object.values(newMappings)
			)
		} else if (key === 'tables' && isTableMappings(newMappings)) {
			Object.values(newMappings).forEach((tableMappings) => {
				const baseMapping = Object.values(mappings.bases).find(
					(mapping) => mapping.id === tableMappings.baseId
				)
				baseMapping.tables[tableMappings.refName] = tableMappings.id
				baseMapping.tables = removeOldReference(
					baseMapping.tables,
					tableMappings.id,
					tableMappings.refName
				)
			})
			mappings[key] = mergeMappings<TableMapping>(
				...Object.values(mappings.tables),
				...Object.values(newMappings)
			)
		} else if (key === 'views' && isViewMappings(newMappings)) {
			Object.values(newMappings).forEach((viewMappings) => {
				const tableMapping = Object.values(mappings.tables).find(
					(mapping) => mapping.id === viewMappings.tableId
				)
				tableMapping.views[viewMappings.refName] = viewMappings.id
				tableMapping.views = removeOldReference(
					tableMapping.views,
					viewMappings.id,
					viewMappings.refName
				)
			})
			mappings[key] = newMappings
		} else {
			throw new Error(
				'Enable to update mappings. Invalid mapping passed to update function'
			)
		}
		setmappings({ ...mappings })
	}, [])

	return { mappings, setMappings: updateMappings }
}
