import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"
import PlusSVG from "@/svgs/PlusSVG"

const create = (props) => {
	const history = useHistory()

	const [projects, setProjects] = useState([])
	const [staff, setStaff] = useState([])

	const [projectId, setProjectId] = useState()
	const [approvedBy, setApprovedBy] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Create Site Visit Report",
			path: ["site-visit-reports", "create"],
		})
		// Fetch Projects
		props.get("projects?idAndName=true", setProjects)
		// Fetch Staff
		props.get("staff?idAndName=true", setStaff)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/site-visit-reports", {
			projectId: projectId,
			approvedBy: approvedBy,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Site Visit Reports
				setTimeout(
					() => history.push(`/admin/documents/site-visit-reports`),
					500
				)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form onSubmit={onSubmit}>
					{/* Project Start */}
					<select
						name="projectId"
						className="form-control mb-2 me-1"
						onChange={(e) => setProjectId(Number.parseInt(e.target.value))}
						required={true}>
						<option value="">Select Project</option>
						{projects.map((project, key) => (
							<option
								key={key}
								value={project.id}>
								{project.name}
							</option>
						))}
					</select>
					{/* Project End */}

					{/* Approved By Start */}
					<select
						name="projectId"
						className="form-control mb-2 ms-1"
						onChange={(e) => setApprovedBy(Number.parseInt(e.target.value))}>
						<option value="">Select Approved By</option>
						{staff.map((staff, key) => (
							<option
								key={key}
								value={staff.id}>
								{staff.name}
							</option>
						))}
					</select>
					{/* Approved By End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="create site visit report"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/documents/site-visit-reports`}
							icon={<BackSVG />}
							text="back to site visit reports"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default create
