import React, { useEffect, useState } from "react"

import ClientList from "@/components/Clients/ClientList"

const index = (props) => {
	// Get Client
	const [clients, setClients] = useState([])

	const [nameQuery, setNameQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Clients", path: ["clients"] })
		props.getPaginated("clients", setClients)
	}, [])

	useEffect(() => {
	  props.getPaginated(`clients?name=${nameQuery}`, setClients)
	}, [nameQuery])
	

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Clients Tab */}
				<ClientList
					{...props}
					clients={clients}
					setClients={setClients}
					setNameQuery={setNameQuery}
				/>
				{/* Clients Tab End */}
			</div>
		</div>
	)
}

export default index
