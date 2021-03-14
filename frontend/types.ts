export interface Mappings {
	bases: {
		[refName: string]: BaseMapping
	}
	tables: {
		[refName: string]: TableMapping
	}
	views: {
		[refName: string]: ViewMapping
	}
}
export interface BaseMapping {
	id: string
	name: string
	refName: string
	tables: {
		[id: string]: string
	}
}

export interface TableMapping {
	id: string
	baseId: string
	name: string
	refName: string
	views: {
		[id: string]: string
	}
}

export interface ViewMapping {
	id: string
	name: string
	tableId: string
	refName: string
	fields: {
		[refName: string]: FieldMapping
	}
}

export interface FieldMapping {
	id: string
	tableId: string
	viewId: string
	name: string
	type: string
	refName: string
}

export type AllMappings = BaseMapping | TableMapping | ViewMapping
