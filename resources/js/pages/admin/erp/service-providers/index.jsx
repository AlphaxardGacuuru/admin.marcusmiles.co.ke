import React, { useEffect, useState } from "react"

import ServiceProviderList from "@/components/ServiceProviders/ServiceProviderList"

const index = (props) => {
	// Get ServiceProvider
	const [serviceProviders, setServiceProviders] = useState(
		props.getLocalStorage("serviceProviders")
	)

	const [nameQuery, setNameQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Service Providers", path: ["service-providers"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`service-providers?
		name=${nameQuery}`,
			setServiceProviders,
			"serviceProviders"
		)
	}, [nameQuery])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* ServiceProviders Tab */}
				<ServiceProviderList
					{...props}
					serviceProviders={serviceProviders}
					setServiceProviders={setServiceProviders}
					setNameQuery={setNameQuery}
				/>
				{/* ServiceProviders Tab End */}
			</div>
		</div>
	)
}

export default index
