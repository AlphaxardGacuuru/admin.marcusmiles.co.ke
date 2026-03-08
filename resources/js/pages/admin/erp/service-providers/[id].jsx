import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import ProjectList from "@/components/Projects/ProjectList"
import ServiceProviderProjectList from "@/components/ServiceProviderProjects/ServiceProviderProjectList"
import EditSVG from "@/svgs/EditSVG"
import NotFoundSVG from "@/svgs/NotFoundSVG"

const show = (props) => {
	var { id } = useParams()

	const [serviceProvider, setServiceProvider] = useState({})
	const [projects, setProjects] = useState([])

	const [name, setName] = useState("")

	const [tab, setTab] = useState("projects")

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Service Provider",
			path: ["service-providers", "view"],
		})
		props.get(`service-providers/${id}`, setServiceProvider)
	}, [id])

	useEffect(() => {
		// Fetch Projects
		props.getPaginated(
			`project-service-providers?
			serviceProviderId=${id}&
			name=${name}`,
			setProjects
		)
	}, [name])

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
					<h4>{serviceProvider.name}</h4>
					<h6>{serviceProvider.email}</h6>
					<h6>{serviceProvider.phone}</h6>
					<h6>{serviceProvider.location}</h6>

					<hr />
					<h6 className="mb-2">National ID</h6>

					{serviceProvider.nationalIdFile ? (
						<iframe
							src={serviceProvider.nationalIdFile}
							style={{ width: "100%", height: "30em" }}></iframe>
					) : (
						<div>
							<div className="text-center fs-3 text-muted">
								<NotFoundSVG />
							</div>
							<p className="text-muted">National ID not Found</p>
						</div>
					)}

					{/* Edit Start */}
					<MyLink
						linkTo={`/erp/service-providers/${id}/edit`}
						icon={<EditSVG />}
						text="edit"
						className="btn-sm"
					/>
					{/* Edit End */}
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

				<ServiceProviderProjectList
					{...props}
					projects={projects}
					setProjects={setProjects}
					setName={setName}
				/>
			</div>
		</div>
	)
}

export default show
