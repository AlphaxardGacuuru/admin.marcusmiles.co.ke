import React, { useEffect, useState } from "react"

import QuotationList from "@/components/Quotations/QuotationList"

const index = (props) => {
	// Get Quotations
	const [quotations, setQuotations] = useState(
		props.getLocalStorage("quotations")
	)

	const [search, setSearch] = useState("")
	const [clientQuery, setClientQuery] = useState("")
	const [projectQuery, setProjectQuery] = useState("")
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
			name=${search}&
			client=${clientQuery}&
			project=${projectQuery}&
			status=${statusQuery}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setQuotations,
			"quotations"
		)
	}, [
		search,
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
				{/* Quotations Tab */}
				<QuotationList
					{...props}
					quotations={quotations}
					setQuotations={setQuotations}
					setSearch={setSearch}
					setProjectQuery={setProjectQuery}
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
