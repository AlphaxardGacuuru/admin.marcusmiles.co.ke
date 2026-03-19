import React, { useEffect, useState } from "react"

import ProjectList from "@/components/Projects/ProjectList"

const index = (props) => {
	const [projects, setProjects] = useState(props.getLocalStorage("projects"))
	const [stages, setStages] = useState(props.getLocalStorage("stages"))

	const [codeQuery, setCodeQuery] = useState("")
	const [nameQuery, setNameQuery] = useState("")
	const [typeQuery, setTypeQuery] = useState("")
	const [locationQuery, setLocationQuery] = useState("")
	const [clientIdQuery, setClientIdQuery] = useState("")
	const [createdByQuery, setCreatedByQuery] = useState("")
	const [startMonthQuery, setStartMonthQuery] = useState("")
	const [endMonthQuery, setEndMonthQuery] = useState("")
	const [startYearQuery, setStartYearQuery] = useState("")
	const [endYearQuery, setEndYearQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Projects", path: ["erp/projects"] })
		// Fetch Stages
		props.get("stages?type=project", setStages, "stages")
	}, [])

	useEffect(() => {
		// Fetch Projects
		props.getPaginated(
			`projects?
			code=${codeQuery}&
			name=${nameQuery}&
			type=${typeQuery}&
			location=${locationQuery}&
			clientId=${clientIdQuery}&
			createdBy=${createdByQuery}&
			startMonth=${startMonthQuery}&
			endMonth=${endMonthQuery}&
			startYear=${startYearQuery}&
			endYear=${endYearQuery}`,
			setProjects,
			"projects"
		)
	}, [
		codeQuery,
		nameQuery,
		typeQuery,
		locationQuery,
		clientIdQuery,
		startMonthQuery,
		endMonthQuery,
		startYearQuery,
		endYearQuery,
		createdByQuery,
	])

	return (
		<ProjectList
			{...props}
			projects={projects}
			setProjects={setProjects}
			stages={stages}
			setStages={setStages}
			codeQuery={codeQuery}
			nameQuery={nameQuery}
			typeQuery={typeQuery}
			locationQuery={locationQuery}
			clientIdQuery={clientIdQuery}
			startMonthQuery={startMonthQuery}
			endMonthQuery={endMonthQuery}
			startYearQuery={startYearQuery}
			endYearQuery={endYearQuery}
			createdByQuery={createdByQuery}
			setCodeQuery={setCodeQuery}
			setNameQuery={setNameQuery}
			setTypeQuery={setTypeQuery}
			setLocationQuery={setLocationQuery}
			setClientIdQuery={setClientIdQuery}
			setStartMonthQuery={setStartMonthQuery}
			setEndMonthQuery={setEndMonthQuery}
			setStartYearQuery={setStartYearQuery}
			setEndYearQuery={setEndYearQuery}
			setCreatedByQuery={setCreatedByQuery}
		/>
	)
}

export default index
