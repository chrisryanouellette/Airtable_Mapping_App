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
