import { initializeBlock, useBase } from '@airtable/blocks/ui'
import { Base } from '@airtable/blocks/models'
import React, { useState } from 'react'

function HelloWorldBlock() {
	const base = useBase() as Base

	return <div>Hello Custom App in {base.name}!</div>
}

initializeBlock(() => <HelloWorldBlock />)
