import React, { useEffect, useState } from "react"

import InventoryList from "@/components/Inventories/InventoryList"

const index = (props) => {
	const [inventories, setInventories] = useState([])

	const [name, setName] = useState("")
	const [type, setType] = useState("")
	const [location, setLocation] = useState("")
	const [clientId, setClientId] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Inventories", path: ["inventories"] })
	}, [])

	useEffect(() => {
		// Fetch Inventories
		props.getPaginated(
			`inventories?
			name=${name}&
			type=${type}&
			location=${location}&
			clientId=${clientId}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setInventories
		)
	}, [name, type, location, clientId, startMonth, endMonth, startYear, endYear])

	return (
		<InventoryList
			{...props}
			inventories={inventories}
			setInventories={setInventories}
			setName={setName}
			setType={setType}
			setLocation={setLocation}
			setClientId={setClientId}
			setStartMonth={setStartMonth}
			setEndMonth={setEndMonth}
			setStartYear={setStartYear}
			setEndYear={setEndYear}
		/>
	)
}

export default index
