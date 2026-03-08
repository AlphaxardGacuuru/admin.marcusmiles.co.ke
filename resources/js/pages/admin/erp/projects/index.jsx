import React, { useEffect, useState } from "react"

import ProjectList from "@/components/Projects/ProjectList"

const index = (props) => {
	const [projects, setProjects] = useState([])
	const [stages, setStages] = useState([])

	const [nameQuery, setNameQuery] = useState("")
	const [typeQuery, setTypeQuery] = useState("")
	const [locationQuery, setLocationQuery] = useState("")
	const [clientIdQuery, setClientIdQuery] = useState("")
	const [startMonthQuery, setStartMonthQuery] = useState("")
	const [endMonthQuery, setEndMonthQuery] = useState("")
	const [startYearQuery, setStartYearQuery] = useState("")
	const [endYearQuery, setEndYearQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Projects", path: ["projects"] })
		// Fetch Stages
		props.get("stages?type=project", setStages)
	}, [])

	useEffect(() => {
		// Fetch Projects
		props.getPaginated(
			`projects?
			name=${nameQuery}&
			type=${typeQuery}&
			location=${locationQuery}&
			clientId=${clientIdQuery}&
			startMonth=${startMonthQuery}&
			endMonth=${endMonthQuery}&
			startYear=${startYearQuery}&
			endYear=${endYearQuery}`,
			setProjects
		)
	}, [
		nameQuery,
		typeQuery,
		locationQuery,
		clientIdQuery,
		startMonthQuery,
		endMonthQuery,
		startYearQuery,
		endYearQuery,
	])

	return (
		<ProjectList
			{...props}
			projects={projects}
			setProjects={setProjects}
			stages={stages}
			setStages={setStages}
			nameQuery={nameQuery}
			typeQuery={typeQuery}
			locationQuery={locationQuery}
			clientIdQuery={clientIdQuery}
			startMonthQuery={startMonthQuery}
			endMonthQuery={endMonthQuery}
			startYearQuery={startYearQuery}
			endYearQuery={endYearQuery}
			setNameQuery={setNameQuery}
			setTypeQuery={setTypeQuery}
			setLocationQuery={setLocationQuery}
			setClientIdQuery={setClientIdQuery}
			setStartMonthQuery={setStartMonthQuery}
			setEndMonthQuery={setEndMonthQuery}
			setStartYearQuery={setStartYearQuery}
			setEndYearQuery={setEndYearQuery}
		/>
	)
}

export default index
