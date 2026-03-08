import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import ProjectList from "@/components/Projects/ProjectList"

const show = (props) => {
	var { id } = useParams()

	const [client, setClient] = useState({})
	const [projects, setProjects] = useState([])

	const [nameQuery, setNameQuery] = useState("")

	const [tab, setTab] = useState("projects")

	useEffect(() => {
		// Set page
		props.setPage({ name: "View Client", path: ["clients", "view"] })
		props.get(`clients/${id}`, setClient)
		props.getPaginated(`projects?clientId=${id}`, setProjects)
	}, [id])

	useEffect(() => {
		props.getPaginated(
			`projects?clientId=${id}&
				name=${nameQuery}`,
			setProjects
		)
	}, [nameQuery])

	const active = (activeTab) => {
		return activeTab == tab
			? "bg-secondary text-white shadow-sm"
			: "bg-secondary-subtle"
	}

	const activeTab = (activeTab) => {
		return activeTab == tab ? "d-block" : "d-none"
	}

	return (
		<div className="row">
			<div className="col-sm-4">
				<div className="card shadow mb-2 p-4 text-center">
					<h4>{client.name}</h4>
					<h6>{client.email}</h6>
					<h6>{client.phone}</h6>
					<h6>{client.location}</h6>
				</div>
			</div>
			<div className="col-sm-8">
				{/* Tabs */}
				<div className="d-flex justify-content-between flex-wrap mb-2">
					<div
						className={`card shadow-sm flex-grow-1 text-center me-1 mb-2 py-2 px-4 ${active(
							"projects"
						)}`}
						style={{ cursor: "pointer" }}
						onClick={() => setTab("projects")}>
						Projects
					</div>
				</div>
				{/* Tabs End */}

				{/* Projects Tab */}
				<ProjectList
					{...props}
					activeTab={activeTab("projects")}
					projects={projects}
					setProjects={setProjects}
					stages={[]}
					totalProject={client.projectCount}
					clientId={id}
					setClient={setClient}
					setNameQuery={setNameQuery}
				/>
				{/* Projects Tab End */}
			</div>
		</div>
	)
}

export default show
