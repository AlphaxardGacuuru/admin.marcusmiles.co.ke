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
	const [actionItems, setActionItems] = useState([
		{
			item: "",
			inCharge: "",
			dueDate: "",
			comments: "",
		},
	])
	const [approvedBy, setApprovedBy] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Create Status Report",
			path: ["status-reports", "create"],
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
		Axios.post("/api/status-reports", {
			projectId: projectId,
			actionItems: actionItems,
			approvedBy: approvedBy,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Status Reports
				setTimeout(() => history.push(`/admin/documents/status-reports`), 500)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-2"></div>
			<div className="col-sm-8">
				<form onSubmit={onSubmit}>
					<div className="d-flex justify-content-between mb-2">
						{/* Project Start */}
						<select
							name="projectId"
							className="form-control mb-2 me-1"
							onChange={(e) => setProjectId(Number.parseInt(e.target.value))}>
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
					</div>

					<label
						htmlFor=""
						className="ms-2">
						Action Items
					</label>
					{/* Action Items Start */}
					{actionItems.map((actionItem, key) => (
						<div
							key={key}
							className="d-flex">
							<div className="d-flex justify-content-between flex-wrap flex-grow-1">
								{/* Item Start */}
								<label
									htmlFor=""
									className="ms-2">
									Item
								</label>
								<input
									type="text"
									name="item"
									placeholder="Roof Works"
									className="form-control mb-2 mx-1"
									onChange={(e) => {
										actionItems[key].item = e.target.value
										setActionItems(actionItems)
									}}
									required={true}
								/>
								{/* Item End */}
								{/* In Charge Start */}
								<label
									htmlFor=""
									className="ms-2">
									In Charge
								</label>
								<select
									name="projectId"
									className="form-control mb-2 mx-1"
									onChange={(e) => {
										actionItems[key].inCharge = Number(e.target.value)
										setActionItems(actionItems)
									}}
									required={true}>
									<option value="">Select In Charge</option>
									{staff.map((staff, key) => (
										<option
											key={key}
											value={staff.id}>
											{staff.name}
										</option>
									))}
								</select>
								{/* In Charge End */}
								{/* Due Date Start */}
								<label
									htmlFor=""
									className="ms-2">
									Due Date
								</label>
								<input
									type="date"
									name="item"
									className="form-control mb-2 mx-1"
									onChange={(e) => {
										actionItems[key].dueDate = e.target.value
										setActionItems(actionItems)
									}}
									required={true}
								/>
								{/* Due Date End */}
								{/* Comments Start */}
								<label
									htmlFor=""
									className="ms-2">
									Comments
								</label>
								<textarea
									name="item"
									placeholder="Add a comment"
									cols="5"
									rows="5"
									className="form-control mb-2 mx-1"
									onChange={(e) => {
										actionItems[key].comments = e.target.value
										setActionItems(actionItems)
									}}
									required={true}></textarea>
								{/* Comments End */}
							</div>
							{/* Delete Item Button Start */}
							{key == actionItems.length - 1 && (
								<div
									className="mx-1"
									onClick={() =>
										setActionItems(
											actionItems.filter((actionItem, index) => index != key)
										)
									}
									style={{ cursor: "pointer" }}>
									<CloseSVG />
								</div>
							)}
							{/* Delete Item Button End */}
						</div>
					))}
					{/* Action Items End */}

					{/* Add Button Start */}
					<div className="d-flex justify-content-end mb-2">
						<Btn
							icon={<PlusSVG />}
							text="add action item"
							onClick={() =>
								setActionItems([
									...actionItems,
									{
										item: "",
										inCharge: "",
										dueDate: "",
										comments: "",
									},
								])
							}
						/>
					</div>
					{/* Add Button End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="create status report"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/documents/status-reports`}
							icon={<BackSVG />}
							text="back to status reports"
						/>
					</div>
					<div className="col-sm-2"></div>
				</form>
			</div>
		</div>
	)
}

export default create
