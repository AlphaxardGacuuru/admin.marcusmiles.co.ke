import React, { useEffect, useState } from "react"

import StaffList from "@/components/Staff/StaffList"

const index = (props) => {
	// Get Staff
	const [staff, setStaff] = useState(props.getLocalStorage("staff"))
	const [roles, setRoles] = useState([])
	const [nameQuery, setNameQuery] = useState("")
	const [emailQuery, setEmailQuery] = useState("")
	const [phoneQuery, setPhoneQuery] = useState("")
	const [genderQuery, setGenderQuery] = useState("")
	const [roleQuery, setRoleQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Staff", path: ["crm/staff"] })
		props.get("roles?idAndName=true", setRoles)
	}, [])

	useEffect(() => {
		props.getPaginated(
			`staff?name=${nameQuery}&
			email=${emailQuery}&
			phone=${phoneQuery}&
			gender=${genderQuery}&
			role=${roleQuery}`,
			setStaff,
			"staff"
		)
	}, [nameQuery, emailQuery, phoneQuery, genderQuery, roleQuery])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Staff Tab */}
				<StaffList
					{...props}
					staff={staff}
					setStaff={setStaff}
					roles={roles}
					setNameQuery={setNameQuery}
					setEmailQuery={setEmailQuery}
					setPhoneQuery={setPhoneQuery}
					setGenderQuery={setGenderQuery}
					setRoleQuery={setRoleQuery}
				/>
				{/* Staff Tab End */}
			</div>
		</div>
	)
}

export default index
