import React, { useEffect, useState } from "react"

import CreditNoteList from "@/components/CreditNotes/CreditNoteList"

const index = (props) => {
	const [creditNotes, setCreditNotes] = useState(props.getLocalStorage("creditNotes"))

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
		props.setPage({ name: "Credit Notes", path: ["crm/credit-notes"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`credit-notes?
			code=${codeQuery}&
			clientId=${clientIdQuery}&
			projectId=${projectIdQuery}&
			status=${statusQuery}&
			start_month=${startMonth}&
			end_month=${endMonth}&
			start_year=${startYear}&
			end_year=${endYear}`,
			setCreditNotes,
			"creditNotes"
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
				{/* Credit Notes Tab */}
				<CreditNoteList
					{...props}
					creditNotes={creditNotes}
					setCreditNotes={setCreditNotes}
					setCodeQuery={setCodeQuery}
					setClientIdQuery={setClientIdQuery}
					setProjectIdQuery={setProjectIdQuery}
					setStatusQuery={setStatusQuery}
					setStartMonth={setStartMonth}
					setEndMonth={setEndMonth}
					setStartYear={setStartYear}
					setEndYear={setEndYear}
				/>
				{/* Credit Notes Tab End */}
			</div>
		</div>
	)
}

export default index