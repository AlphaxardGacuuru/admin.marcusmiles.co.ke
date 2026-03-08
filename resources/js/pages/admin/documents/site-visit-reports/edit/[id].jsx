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

	const [siteVisitReport, setSiteVisitReport] = useState({})

	const [staff, setStaff] = useState([])
	
	const [approvedBy, setApprovedBy] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Site Visit Report",
			path: ["site-visit-report", "edit"],
		})
		// Fetch Site Visit Report
		props.get(`site-visit-reports/${id}`, setSiteVisitReport)
		// Fetch Staff
		props.get("staff?idAndName=true", setStaff)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/site-visit-reports/${id}`, {
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
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form
					onSubmit={onSubmit}
					className="my-5">
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
								selected={siteVisitReport.approvedById == staff.id}>
								{staff.name}
							</option>
						))}
					</select>
					{/* Approved By End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update site visit report"
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

export default edit
