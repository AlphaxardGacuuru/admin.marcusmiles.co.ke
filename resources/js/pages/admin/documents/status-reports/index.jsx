import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import PaperSVG from "@/svgs/PaperSVG"
import BalanceSVG from "@/svgs/BalanceSVG"
import Btn from "@/components/Core/Btn"

const index = (props) => {
	const [statusReports, setStatusReports] = useState(
		props.getLocalStorage("statusReports")
	)

	const [clients, setClients] = useState(
		props.getLocalStorage("clientShortList")
	)
	const [projects, setProjects] = useState(
		props.getLocalStorage("projectsShortList")
	)
	const [staff, setStaff] = useState(props.getLocalStorage("staffShortList"))

	const [codeQuery, setCodeQuery] = useState("")
	const [clientIdQuery, setClientIdQuery] = useState("")
	const [projectIdQuery, setProjectIdQuery] = useState("")
	const [approvedByQuery, setApprovedByQuery] = useState("")
	const [createdByQuery, setCreatedByQuery] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Status Reports",
			path: ["documents/status-reports"],
		})
		props.get("clients?idAndName=true", setClients, "clientShortList")
		props.get("projects?idAndName=true", setProjects, "projectsShortList")
		props.get("staff?idAndName=true", setStaff, "staffShortList")
	}, [])

	useEffect(() => {
		// Fetch Status Report
		props.getPaginated(
			`status-reports?
			code=${codeQuery}&
			clientId=${clientIdQuery}&
			projectId=${projectIdQuery}&
			approvedBy=${approvedByQuery}&
			createdBy=${createdByQuery}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setStatusReports,
			"statusReports"
		)
	}, [
		codeQuery,
		clientIdQuery,
		projectIdQuery,
		approvedByQuery,
		createdByQuery,
		startMonth,
		endMonth,
		startYear,
		endYear,
	])

	/*
	 * Delete StatusReport
	 */
	const onDeleteStatusReport = (statusReportId) => {
		setLoading(true)
		var statusReportIds = Array.isArray(statusReportId)
			? statusReportId.join(",")
			: statusReportId

		Axios.delete(`/api/status-reports/${statusReportIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setStatusReports({
					meta: statusReports.meta,
					links: statusReports.links,
					data: statusReports.data.filter((statusReport) => {
						if (Array.isArray(statusReportId)) {
							return !statusReportIds.includes(statusReport.id)
						} else {
							return statusReport.id != statusReportId
						}
					}),
				})
				// Clear DeleteIds
				setDeleteIds([])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
				// Clear DeleteIds
				setDeleteIds([])
			})
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm mb-2 p-2">
				<div className="d-flex justify-content-between">
					<div className="d-flex justify-content-between flex-wrap w-100 align-items-center mx-4">
						{/* Total */}
						<HeroHeading
							heading="Total"
							data={
								<span>
									<small>KES</small> {statusReports.meta?.total}
								</span>
							}
						/>
						<HeroIcon>
							<PaperSVG />
						</HeroIcon>
						{/* Total End */}
					</div>
				</div>
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="card shadow-sm px-4 pt-4 pb-3 mb-2">
				<div className="d-flex flex-wrap">
					{/* Code */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Code</label>
						<input
							type="text"
							placeholder="Search by Code"
							className="form-control"
							onChange={(e) => setCodeQuery(e.target.value)}
						/>
					</div>
					{/* Code End */}
					{/* Client */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Client</label>
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setClientIdQuery(e.target.value)}
							required={true}>
							<option value="">All</option>
							{clients.map((client, key) => (
								<option
									key={key}
									value={client.id}>
									{client.name}
								</option>
							))}
						</select>
					</div>
					{/* Client End */}
					{/* Project ID */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Project</label>
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setProjectIdQuery(e.target.value)}
							required={true}>
							<option value="">All</option>
							{projects.map((project, key) => (
								<option
									key={key}
									value={project.id}>
									{project.name}
								</option>
							))}
						</select>
					</div>
					{/* Project ID End */}
					{/* Approved By */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Approved By</label>
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setApprovedByQuery(e.target.value)}
							required={true}>
							<option value="">All</option>
							{staff.map((staffMember, key) => (
								<option
									key={key}
									value={staffMember.id}>
									{staffMember.name}
								</option>
							))}
						</select>
					</div>
					{/* Approved By End */}
					{/* Created By */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Created By</label>
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setCreatedByQuery(e.target.value)}
							required={true}>
							<option value="">All</option>
							{staff.map((staffMember, key) => (
								<option
									key={key}
									value={staffMember.id}>
									{staffMember.name}
								</option>
							))}
						</select>
					</div>
					{/* Created By End */}
				</div>
			</div>

			<div className="card shadow-sm py-2 px-4">
				<div className="d-flex justify-content-end flex-wrap">
					<div className="d-flex flex-grow-1">
						{/* Start Date */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Start At</label>
							{/* Start Month */}
							<select
								className="form-control"
								onChange={(e) => setStartMonth(e.target.value)}>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{month}
									</option>
								))}
							</select>
						</div>
						{/* Start Month End */}
						{/* Start Year */}
						<div className="flex-grow-1 me-2 mb-2">
							<label
								htmlFor=""
								className="invisible">
								Start At
							</label>
							<select
								className="form-control"
								onChange={(e) => setStartYear(e.target.value)}>
								<option value="">Select Year</option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						{/* Start Year End */}
					</div>
					{/* Start Date End */}
					{/* End Date */}
					<div className="d-flex flex-grow-1">
						{/* End Month */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">End At</label>
							<select
								className="form-control"
								onChange={(e) => setEndMonth(e.target.value)}>
								{props.months.map((month, key) => (
									<option
										key={key}
										value={key}>
										{month}
									</option>
								))}
							</select>
						</div>
						{/* End Month End */}
						{/* End Year */}
						<div className="flex-grow-1 me-2 mb-2">
							<label
								htmlFor=""
								className="invisible">
								End At
							</label>
							<select
								className="form-control"
								onChange={(e) => setEndYear(e.target.value)}>
								<option value="">Select Year</option>
								{props.years.map((year, key) => (
									<option
										key={key}
										value={year}>
										{year}
									</option>
								))}
							</select>
						</div>
						{/* End Year End */}
					</div>
					{/* End Date End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			{/* Table */}
			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th colSpan="7"></th>
							<th className="text-end">
								<div className="d-flex justify-content-end">
									<MyLink
										linkTo={`/documents/status-reports/create`}
										icon={<PlusSVG />}
										text="create status report"
									/>
								</div>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Form No</th>
							<th>Client</th>
							<th>Project</th>
							<th>Approved By</th>
							<th>Created By</th>
							<th>Issue Date</th>
							<th className="text-center">Action</th>
						</tr>
						{statusReports.data?.map((statusReport, key) => (
							<tr key={key}>
								<td>{props.iterator(key, statusReports)}</td>
								<td>{statusReport.code}</td>
								<td>{statusReport.clientName}</td>
								<td>{statusReport.projectName}</td>
								<td>{statusReport.approvedByName}</td>
								<td>{statusReport.createdByName}</td>
								<td>{statusReport.createdAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/documents/status-reports/${statusReport.id}/view`}
											icon={<ViewSVG />}
											className="me-1"
										/>

										<MyLink
											linkTo={`/documents/status-reports/${statusReport.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`statusReport${key}`}
												model={statusReport}
												modelName="Status Report"
												onDelete={onDeleteStatusReport}
											/>
										</div>
									</div>
								</td>
							</tr>
						))}
					</thead>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={statusReports}
					getPaginated={props.getPaginated}
					setState={setStatusReports}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
