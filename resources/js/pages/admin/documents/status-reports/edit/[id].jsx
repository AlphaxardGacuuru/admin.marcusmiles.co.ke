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

const edit = (props) => {
	const { id } = useParams()

	const [statusReport, setStatusReport] = useState({})
	const [staff, setStaff] = useState([])

	const [actionItems, setActionItems] = useState([])
	const [approvedBy, setApprovedBy] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Status Report",
			path: ["status-reports", "edit"],
		})
		// Fetch Status Report
		Axios.get(`api/status-reports/${id}`)
			.then((res) => {
				setStatusReport(res.data.data)
				setActionItems(res.data.data.actionItems)
				console.info("actionItems", actionItems)
			})
			.catch((err) => props.getErrors(err))
		// Fetch Staff
		props.get("staff", setStaff)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/status-reports/${id}`, {
			actionItems: actionItems,
			approvedBy: approvedBy,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
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
					{/* Approved By Start */}
					<select
						name="projectId"
						className="form-control mb-2 ms-1"
						onChange={(e) => setApprovedBy(Number.parseInt(e.target.value))}>
						<option value="">Select Approved By</option>
						{staff.map((staff, key) => (
							<option
								key={key}
								value={staff.id}
								selected={statusReport.approvedById == staff.id}>
								{staff.name}
							</option>
						))}
					</select>
					{/* Approved By End */}

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
									defaultValue={actionItem.item}
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
									}}>
									<option value="">Select In Charge</option>
									{staff.map((staff, key) => (
										<option
											key={key}
											value={staff.id}
											selected={staff.id == actionItem.inCharge}>
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
									defaultValue={actionItem.dueDateRaw}
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
									defaultValue={actionItem.comments}
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
							text="update status report"
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

export default edit
