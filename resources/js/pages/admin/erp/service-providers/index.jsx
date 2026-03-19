import React, { useEffect, useState } from "react"

import ServiceProviderList from "@/components/ServiceProviders/ServiceProviderList"

const index = (props) => {
	// Get ServiceProvider
	const [serviceProviders, setServiceProviders] = useState(
		props.getLocalStorage("serviceProviders")
	)

	const [nameQuery, setNameQuery] = useState("")
	const [emailQuery, setEmailQuery] = useState("")
	const [phoneQuery, setPhoneQuery] = useState("")
	const [genderQuery, setGenderQuery] = useState("")
	const [idNumberQuery, setIdNumberQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Service Providers",
			path: ["erp/service-providers"],
		})
	}, [])

	useEffect(() => {
		props.getPaginated(
			`service-providers?
			name=${nameQuery}&
			email=${emailQuery}&
			phone=${phoneQuery}&
			gender=${genderQuery}&
			idNumber=${idNumberQuery}`,
			setServiceProviders,
			"serviceProviders"
		)
	}, [nameQuery, emailQuery, phoneQuery, genderQuery, idNumberQuery])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* ServiceProviders Tab */}
				<ServiceProviderList
					{...props}
					serviceProviders={serviceProviders}
					setServiceProviders={setServiceProviders}
					setNameQuery={setNameQuery}
					setEmailQuery={setEmailQuery}
					setPhoneQuery={setPhoneQuery}
					setGenderQuery={setGenderQuery}
					setIdNumberQuery={setIdNumberQuery}
				/>
				{/* ServiceProviders Tab End */}
			</div>
		</div>
	)
}

export default index
