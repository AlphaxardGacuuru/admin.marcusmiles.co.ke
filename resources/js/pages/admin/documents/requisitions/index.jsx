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
	const [requisitions, setRequisitions] = useState(
		props.getLocalStorage("requisitions")
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
	const [checkedByQuery, setCheckedByQuery] = useState("")
	const [paidByQuery, setPaidByQuery] = useState("")
	const [createdByQuery, setCreatedByQuery] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Requisitions", path: ["documents/requisitions"] })
		props.get("clients?idAndName=true", setClients, "clientShortList")
		props.get("projects?idAndName=true", setProjects, "projectsShortList")
		props.get("staff?idAndName=true", setStaff, "staffShortList")
	}, [])

	useEffect(() => {
		// Fetch Requisition
		props.getPaginated(
			`requisitions?
			code=${codeQuery}&
			clientId=${clientIdQuery}&
			projectId=${projectIdQuery}&
			approvedBy=${approvedByQuery}&
			checkedBy=${checkedByQuery}&
			paidBy=${paidByQuery}&
			createdBy=${createdByQuery}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setRequisitions,
			"requisitions"
		)
	}, [
		codeQuery,
		clientIdQuery,
		projectIdQuery,
		approvedByQuery,
		checkedByQuery,
		paidByQuery,
		createdByQuery,
		startMonth,
		endMonth,
		startYear,
		endYear,
	])

	/*
	 * Delete Requisition
	 */
	const onDeleteRequisition = (requisitionId) => {
		setLoading(true)
		var requisitionIds = Array.isArray(requisitionId)
			? requisitionId.join(",")
			: requisitionId

		Axios.delete(`/api/requisitions/${requisitionIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setRequisitions({
					meta: requisitions.meta,
					links: requisitions.links,
					data: requisitions.data.filter((requisition) => {
						if (Array.isArray(requisitionId)) {
							return !requisitionIds.includes(requisition.id)
						} else {
							return requisition.id != requisitionId
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
									<small>KES</small> {requisitions.meta?.total}
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
					{/* Checked By */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Checked By</label>
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setCheckedByQuery(e.target.value)}
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
					{/* Checked By End */}
					{/* Paid By */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Paid By</label>
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setPaidByQuery(e.target.value)}
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
					{/* Paid By End */}
					{/* Created By */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="">Ordered By</label>
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
							<th colSpan="9"></th>
							<th className="text-end">
								<div className="d-flex justify-content-end">
									<MyLink
										linkTo={`/documents/requisitions/create`}
										icon={<PlusSVG />}
										text="create requisition"
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
							<th>Checked By</th>
							<th>Paid By</th>
							<th>Ordered By</th>
							<th>Issue Date</th>
							<th className="text-center">Action</th>
						</tr>
						{requisitions.data?.map((requisition, key) => (
							<tr key={key}>
								<td>{props.iterator(key, requisitions)}</td>
								<td>{requisition.code}</td>
								<td>{requisition.clientName}</td>
								<td>{requisition.projectName}</td>
								<td>{requisition.approvedByName}</td>
								<td>{requisition.checkedByName}</td>
								<td>{requisition.paidByName}</td>
								<td>{requisition.createdByName}</td>
								<td>{requisition.createdAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/documents/requisitions/${requisition.id}/view`}
											icon={<ViewSVG />}
											className="me-1"
										/>

										<MyLink
											linkTo={`/documents/requisitions/${requisition.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`requisition${key}`}
												model={requisition}
												modelName="Requisition"
												onDelete={onDeleteRequisition}
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
					list={requisitions}
					getPaginated={props.getPaginated}
					setState={setRequisitions}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
