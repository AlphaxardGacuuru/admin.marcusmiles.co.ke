import React, { useEffect, useState } from "react"

import SupplierList from "@/components/Suppliers/SupplierList"

const index = (props) => {
	// Get Supplier
	const [suppliers, setSuppliers] = useState(props.getLocalStorage("suppliers"))

	const [nameQuery, setNameQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Suppliers", path: ["suppliers"] })
	}, [])

	useEffect(() => {
	  props.getPaginated(
		`suppliers?
		name=${nameQuery}`, 
		setSuppliers, 
		"suppliers"
	)
	}, [nameQuery])
	

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Suppliers Tab */}
				<SupplierList
					{...props}
					suppliers={suppliers}
					setSuppliers={setSuppliers}
					setNameQuery={setNameQuery}
				/>
				{/* Suppliers Tab End */}
			</div>
		</div>
	)
}

export default index
