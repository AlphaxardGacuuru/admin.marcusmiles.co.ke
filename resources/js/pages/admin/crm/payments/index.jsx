import React, { useEffect, useState } from "react"

import PaymentList from "@/components/Payments/PaymentList"

const index = (props) => {
	const [payments, setPayments] = useState(props.getLocalStorage("payments"))

	const [codeQuery, setCodeQuery] = useState("")
	const [clientIdQuery, setClientIdQuery] = useState("")
	const [projectIdQuery, setProjectIdQuery] = useState("")
	const [createdByQuery, setCreatedByQuery] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Payments", path: ["crm/payments"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`payments?
			code=${codeQuery}&
			clientId=${clientIdQuery}&
			projectId=${projectIdQuery}&
			createdBy=${createdByQuery}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setPayments,
			"payments"
		)
	}, [
		codeQuery,
		clientIdQuery,
		projectIdQuery,
		createdByQuery,
		startMonth,
		endMonth,
		startYear,
		endYear,
	])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Payments Tab */}
				<PaymentList
					{...props}
					payments={payments}
					setPayments={setPayments}
					setCodeQuery={setCodeQuery}
					setClientIdQuery={setClientIdQuery}
					setProjectIdQuery={setProjectIdQuery}
					setCreatedByQuery={setCreatedByQuery}
					setStartMonth={setStartMonth}
					setEndMonth={setEndMonth}
					setStartYear={setStartYear}
					setEndYear={setEndYear}
				/>
				{/* Payments Tab End */}
			</div>
		</div>
	)
}

export default index
