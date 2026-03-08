import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import InventoryList from "@/components/Inventories/InventoryList"
import WorkPlanList from "@/components/WorkPlan/WorkPlanList"
import Overview from "@/components/Projects/Overview"
import ProjectServiceProviderList from "@/components/ProjectServiceProviders/ProjectServiceProviderList"

const show = (props) => {
	var { id } = useParams()

	const [project, setProject] = useState({})
	const [workPlanChart, setWorkPlanChart] = useState({})
	const [workPlans, setWorkPlans] = useState([])
	const [inventories, setInventories] = useState([])
	const [projectServiceProviders, setProjectServiceProviders] = useState([])

	const [nameQuery, setNameQuery] = useState("")

	const [tab, setTab] = useState("overview")

	useEffect(() => {
		// Set page
		props.setPage({ name: "View Project", path: ["projects", "view"] })
		props.get(`projects/${id}`, setProject)
		props.get(`work-plans/chart/${id}`, setWorkPlanChart)
		props.getPaginated(`work-plans?projectId=${id}`, setWorkPlans)
		props.getPaginated(`inventories?projectId=${id}`, setInventories)
		props.getPaginated(
			`project-service-providers?projectId=${id}`,
			setProjectServiceProviders
		)
	}, [id])

	useEffect(() => {
		props.getPaginated(
			`inventories?projectId=${id}&
				name=${nameQuery}`,
			setInventories
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
				<div className="card shadow mb-2 p-4">
					<div className="text-center">
						<h6 className="fw-semibold">{project.code}</h6>
						<h5>{project.name}</h5>
						<h6 className="text-capitalize">{project.type}</h6>
						<h6>{project.description}</h6>
					</div>
					<hr />
					<div className="text-center">
						<h6>
							<span className="fw-normal me-1">Location:</span>
							{project.location}
						</h6>
						<h6>
							<span className="fw-normal me-1">Client Initials:</span>
							{project.clientInitials}
						</h6>
						<h6>
							<span className="fw-normal me-1">Current Stage:</span>
							{project.currentStageName}
						</h6>
						<h6>
							<span className="fw-normal me-1">Created By:</span>
							{project.createdBy}
						</h6>
						<h6>
							<span className="fw-normal me-1">Created On:</span>
							{project.createdAt}
						</h6>
					</div>
				</div>
			</div>
			<div className="col-sm-8">
				{/* Tabs */}
				<div className="d-flex justify-content-between flex-wrap mb-2">
					<div
						className={`card shadow-sm flex-grow-1 text-center me-1 mb-2 py-2 px-4 ${active(
							"overview"
						)}`}
						style={{ cursor: "pointer" }}
						onClick={() => setTab("overview")}>
						Overview
					</div>
					<div
						className={`card shadow-sm flex-grow-1 text-center me-1 mb-2 py-2 px-4 ${active(
							"work-plan"
						)}`}
						style={{ cursor: "pointer" }}
						onClick={() => setTab("work-plan")}>
						Work Plan
					</div>
					<div
						className={`card shadow-sm flex-grow-1 text-center me-1 mb-2 py-2 px-4 ${active(
							"inventories"
						)}`}
						style={{ cursor: "pointer" }}
						onClick={() => setTab("inventories")}>
						Inventory
					</div>
					<div
						className={`card shadow-sm flex-grow-1 text-center me-1 mb-2 py-2 px-4 ${active(
							"serviceProviders"
						)}`}
						style={{ cursor: "pointer" }}
						onClick={() => setTab("serviceProviders")}>
						Service Providers
					</div>
				</div>
				{/* Tabs End */}

				{/* Overview Tab */}
				{workPlanChart.labels && (
					<Overview
						{...props}
						activeTab={activeTab("overview")}
						workPlanChart={workPlanChart}
						workPlans={workPlans}
						setWorkPlans={setWorkPlans}
						totalWorkPlans={project.workPlanCount}
						projectId={id}
						setProject={setProject}
					/>
				)}
				{/* Overview Tab End */}

				{/* Work Plans Tab */}
				<WorkPlanList
					{...props}
					activeTab={activeTab("work-plan")}
					workPlans={workPlans}
					setWorkPlans={setWorkPlans}
					totalWorkPlans={project.workPlanCount}
					projectId={id}
					setProject={setProject}
				/>
				{/* Work Plans Tab End */}
				{/* Inventories Tab */}
				<InventoryList
					{...props}
					activeTab={activeTab("inventories")}
					inventories={inventories}
					setInventories={setInventories}
					totalInventory={project.inventoryCount}
					projectId={id}
					setProject={setProject}
					setNameQuery={setNameQuery}
				/>
				{/* Inventories Tab End */}
				{/* Project Service Provider Tab */}
				<ProjectServiceProviderList
					{...props}
					activeTab={activeTab("serviceProviders")}
					projectServiceProviders={projectServiceProviders}
					setProjectServiceProviders={setProjectServiceProviders}
					projectId={id}
					setProject={setProject}
					setNameQuery={setNameQuery}
				/>
				{/* Project Service Provider Tab End */}
			</div>
		</div>
	)
}

export default show
