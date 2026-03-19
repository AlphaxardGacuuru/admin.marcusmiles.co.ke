import React, { useEffect, useState } from "react"

import SupplierList from "@/components/Suppliers/SupplierList"

const index = (props) => {
	// Get Supplier
	const [suppliers, setSuppliers] = useState(props.getLocalStorage("suppliers"))

	const [nameQuery, setNameQuery] = useState("")
	const [emailQuery, setEmailQuery] = useState("")
	const [phoneQuery, setPhoneQuery] = useState("")
	const [genderQuery, setGenderQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Suppliers", path: ["erp/suppliers"] })
	}, [])

	useEffect(() => {
	  props.getPaginated(
		`suppliers?
		name=${nameQuery}&
		email=${emailQuery}&
		phone=${phoneQuery}&
		gender=${genderQuery}`, 
		setSuppliers, 
		"suppliers"
	)
	}, [nameQuery, emailQuery, phoneQuery, genderQuery])
	

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Suppliers Tab */}
				<SupplierList
					{...props}
					suppliers={suppliers}
					setSuppliers={setSuppliers}
					setNameQuery={setNameQuery}
					setEmailQuery={setEmailQuery}
					setPhoneQuery={setPhoneQuery}
					setGenderQuery={setGenderQuery}
				/>
				{/* Suppliers Tab End */}
			</div>
		</div>
	)
}

export default index
