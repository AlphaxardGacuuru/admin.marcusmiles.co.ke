import React, { useEffect, useState } from "react"

import QuotationList from "@/components/Quotations/QuotationList"

const index = (props) => {
	// Get Quotations
	const [quotations, setQuotations] = useState(
		props.getLocalStorage("quotations")
	)

	const [codeQuery, setCodeQuery] = useState("")
	const [clientIdQuery, setClientIdQuery] = useState("")
	const [projectIdQuery, setProjectIdQuery] = useState("")
	const [statusQuery, setStatusQuery] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Quotations", path: ["crm/quotations"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`quotations?
			code=${codeQuery}&
			clientId=${clientIdQuery}&
			projectId=${projectIdQuery}&
			status=${statusQuery}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setQuotations,
			"quotations"
		)
	}, [
		codeQuery,
		clientIdQuery,
		projectIdQuery,
		statusQuery,
		startMonth,
		endMonth,
		startYear,
		endYear,
	])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Quotations Tab */}
				<QuotationList
					{...props}
					quotations={quotations}
					setQuotations={setQuotations}
					setCodeQuery={setCodeQuery}
					setClientIdQuery={setClientIdQuery}
					setProjectIdQuery={setProjectIdQuery}
					setStatusQuery={setStatusQuery}
					setStartMonth={setStartMonth}
					setEndMonth={setEndMonth}
					setStartYear={setStartYear}
					setEndYear={setEndYear}
				/>
				{/* Quotations Tab End */}
			</div>
		</div>
	)
}

export default index
