import React, { useEffect, useState } from "react"

import ClientList from "@/components/Clients/ClientList"

const index = (props) => {
	// Get Client
	const [clients, setClients] = useState(props.getLocalStorage("clients"))

	const [nameQuery, setNameQuery] = useState("")
	const [emailQuery, setEmailQuery] = useState("")
	const [phoneQuery, setPhoneQuery] = useState("")
	const [genderQuery, setGenderQuery] = useState("")
	const [locationQuery, setLocationQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Clients", path: ["clients"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`clients?
		name=${nameQuery}
		&email=${emailQuery}
		&phone=${phoneQuery}
		&gender=${genderQuery}
		&location=${locationQuery}`,
			setClients,
			"clients"
		)
	}, [nameQuery, emailQuery, phoneQuery, genderQuery, locationQuery])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Clients Tab */}
				<ClientList
					{...props}
					clients={clients}
					setClients={setClients}
					setNameQuery={setNameQuery}
					setEmailQuery={setEmailQuery}
					setPhoneQuery={setPhoneQuery}
					setGenderQuery={setGenderQuery}
					setLocationQuery={setLocationQuery}
				/>
				{/* Clients Tab End */}
			</div>
		</div>
	)
}

export default index
