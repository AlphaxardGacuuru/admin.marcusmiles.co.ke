import React, { useEffect, useState } from "react"

import PaymentList from "@/components/Payments/PaymentList"

const index = (props) => {
	const [payments, setPayments] = useState(props.getLocalStorage("payments"))

	const [codeQuery, setCodeQuery] = useState("")
	const [projectQuery, setProjectQuery] = useState("")
	const [statusQuery, setStatusQuery] = useState("")
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
			project=${projectQuery}&
			status=${statusQuery}&
			start_month=${startMonth}&
			end_month=${endMonth}&
			start_year=${startYear}&
			end_year=${endYear}`,
			setPayments,
			"payments"
		)
	}, [
		codeQuery,
		projectQuery,
		statusQuery,
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
					setProjectQuery={setProjectQuery}
					setStatusQuery={setStatusQuery}
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
