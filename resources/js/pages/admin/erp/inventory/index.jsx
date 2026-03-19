import React, { useEffect, useState } from "react"

import InventoryList from "@/components/Inventories/InventoryList"

const index = (props) => {
	const [inventories, setInventories] = useState(
		props.getLocalStorage("inventories")
	)

	const [goodIdQuery, setGoodIdQuery] = useState("")
	const [projectIdQuery, setProjectIdQuery] = useState("")
	const [supplierIdQuery, setSupplierIdQuery] = useState("")
	const [startMonthQuery, setStartMonthQuery] = useState("")
	const [endMonthQuery, setEndMonthQuery] = useState("")
	const [startYearQuery, setStartYearQuery] = useState("")
	const [endYearQuery, setEndYearQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Inventories", path: ["erp/inventories"] })
	}, [])

	useEffect(() => {
		// Fetch Inventories
		props.getPaginated(
			`inventories?
			goodId=${goodIdQuery}&
			projectId=${projectIdQuery}&
			supplierId=${supplierIdQuery}&
			startMonth=${startMonthQuery}&
			endMonth=${endMonthQuery}&
			startYear=${startYearQuery}&
			endYear=${endYearQuery}`,
			setInventories,
			"inventories"
		)
	}, [
		goodIdQuery,
		projectIdQuery,
		supplierIdQuery,
		startMonthQuery,
		endMonthQuery,
		startYearQuery,
		endYearQuery,
	])

	return (
		<InventoryList
			{...props}
			inventories={inventories}
			setInventories={setInventories}
			setGoodIdQuery={setGoodIdQuery}
			setProjectIdQuery={setProjectIdQuery}
			setSupplierIdQuery={setSupplierIdQuery}
			setStartMonthQuery={setStartMonthQuery}
			setEndMonthQuery={setEndMonthQuery}
			setStartYearQuery={setStartYearQuery}
			setEndYearQuery={setEndYearQuery}
		/>
	)
}

export default index
