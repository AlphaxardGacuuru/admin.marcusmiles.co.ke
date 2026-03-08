import React, { useEffect, useState } from "react"

import ServiceProviderList from "@/components/ServiceProviders/ServiceProviderList"

const index = (props) => {
	// Get ServiceProvider
	const [serviceProviders, setServiceProviders] = useState([])

	const [nameQuery, setNameQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Service Providers", path: ["service-providers"] })
		props.getPaginated("service-providers", setServiceProviders)
	}, [])

	useEffect(() => {
	  props.getPaginated(`service-providers?name=${nameQuery}`, setServiceProviders)
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
