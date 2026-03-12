import React, { useEffect, useState } from "react"
import InvoiceList from "@/components/Invoices/InvoiceList"

const index = (props) => {
	const [invoices, setInvoices] = useState(props.getLocalStorage("invoices"))

	const [codeQuery, setCodeQuery] = useState("")
	const [projectQuery, setProjectQuery] = useState("")
	const [statusQuery, setStatusQuery] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Invoices", path: ["invoices"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`invoices?
			code=${codeQuery}&
			project=${projectQuery}&
			status=${statusQuery}&
			start_month=${startMonth}&
			end_month=${endMonth}&
			start_year=${startYear}&
			end_year=${endYear}`,
			setInvoices,
			"invoices"
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
				{/* Invoices Tab */}
				<InvoiceList
					{...props}
					invoices={invoices}
					setInvoices={setInvoices}
					setCodeQuery={setCodeQuery}
					setProjectQuery={setProjectQuery}
					setStatusQuery={setStatusQuery}
					setStartMonth={setStartMonth}
					setEndMonth={setEndMonth}
					setStartYear={setStartYear}
					setEndYear={setEndYear}
				/>
				{/* Invoices Tab End */}
			</div>
		</div>
	)
}

export default index
