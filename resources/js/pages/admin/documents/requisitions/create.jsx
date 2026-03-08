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
	const [checkedBy, setCheckedBy] = useState()
	const [paidBy, setPaidBy] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Create Requisition",
			path: ["requisitions", "create"],
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
		Axios.post("/api/requisitions", {
			projectId: projectId,
			approvedBy: approvedBy,
			checkedBy: checkedBy,
			paidBy: paidBy,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Requisitions
				setTimeout(() => history.push(`/admin/documents/requisitions`), 500)
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
						className="form-control mb-2"
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
						className="form-control mb-2"
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

					{/* Checked By Start */}
					<select
						name="projectId"
						className="form-control mb-2"
						onChange={(e) => setCheckedBy(Number.parseInt(e.target.value))}>
						<option value="">Select Checked By</option>
						{staff.map((staff, key) => (
							<option
								key={key}
								value={staff.id}>
								{staff.name}
							</option>
						))}
					</select>
					{/* Checked By End */}

					{/* Paid By Start */}
					<select
						name="projectId"
						className="form-control mb-2"
						onChange={(e) => setPaidBy(Number.parseInt(e.target.value))}>
						<option value="">Select Paid By</option>
						{staff.map((staff, key) => (
							<option
								key={key}
								value={staff.id}>
								{staff.name}
							</option>
						))}
					</select>
					{/* Paid By End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="create requisition"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/documents/requisitions`}
							icon={<BackSVG />}
							text="back to requisitions"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default create
