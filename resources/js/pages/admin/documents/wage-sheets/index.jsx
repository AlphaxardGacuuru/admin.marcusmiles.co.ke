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
	const [wageSheets, setWageSheets] = useState(props.getLocalStorage("wageSheets"))

	const [projects, setProjects] = useState(
		props.getLocalStorage("projectsShortList")
	)
	const [staff, setStaff] = useState(props.getLocalStorage("staffShortList"))

	const [codeQuery, setCodeQuery] = useState("")
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
		props.setPage({ name: "Wage Sheets", path: ["documents/wage-sheets"] })
		props.get("projects?idAndName=true", setProjects, "projectsShortList")
		props.get("staff?idAndName=true", setStaff, "staffShortList")
	}, [])

	useEffect(() => {
		// Fetch Wage Sheet
		props.getPaginated(
			`wage-sheets?
			code=${codeQuery}&
			projectId=${projectIdQuery}&
			approvedBy=${approvedByQuery}&
			createdBy=${createdByQuery}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setWageSheets,
			"wageSheets"
		)
	}, [
		codeQuery,
		projectIdQuery,
		approvedByQuery,
		createdByQuery,
		startMonth,
		endMonth,
		startYear,
		endYear,
	])

	/*
	 * Delete WageSheet
	 */
	const onDeleteWageSheet = (wageSheetId) => {
		setLoading(true)
		var wageSheetIds = Array.isArray(wageSheetId)
			? wageSheetId.join(",")
			: wageSheetId

		Axios.delete(`/api/wage-sheets/${wageSheetIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setWageSheets({
					meta: wageSheets.meta,
					links: wageSheets.links,
					data: wageSheets.data.filter((wageSheet) => {
						if (Array.isArray(wageSheetId)) {
							return !wageSheetIds.includes(wageSheet.id)
						} else {
							return wageSheet.id != wageSheetId
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
									<small>KES</small> {wageSheets.meta?.total}
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
							<th colSpan="10"></th>
							<th className="text-end">
								<div className="d-flex justify-content-end">
									<MyLink
										linkTo={`/documents/wage-sheets/create`}
										icon={<PlusSVG />}
										text="create wage sheet"
									/>
								</div>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Form No</th>
							<th>Project</th>
							<th>Total Labour Force</th>
							<th>Total Wages</th>
							<th>From</th>
							<th>To</th>
							<th>Approved By</th>
							<th>Created By</th>
							<th>Issue Date</th>
							<th className="text-center">Action</th>
						</tr>
						{wageSheets.data?.map((wageSheet, key) => (
							<tr key={key}>
								<td>{props.iterator(key, wageSheets)}</td>
								<td>{wageSheet.code}</td>
								<td>{wageSheet.projectName}</td>
								<td>{wageSheet.totalLabourForce}</td>
								<td>
									{wageSheet.wageSheetServiceProviders?.reduce(
										(acc, wageSheetServiceProvider) =>
											acc + wageSheetServiceProvider.total,
										0
									)}
								</td>
								<td>{wageSheet.startsAt}</td>
								<td>{wageSheet.endsAt}</td>
								<td>{wageSheet.approvedByName}</td>
								<td>{wageSheet.createdByName}</td>
								<td>{wageSheet.createdAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/documents/wage-sheets/${wageSheet.id}/view`}
											icon={<ViewSVG />}
											className="me-1"
										/>

										<MyLink
											linkTo={`/documents/wage-sheets/${wageSheet.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`wageSheet${key}`}
												model={wageSheet}
												modelName="Wage Sheet"
												onDelete={onDeleteWageSheet}
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
					list={wageSheets}
					getPaginated={props.getPaginated}
					setState={setWageSheets}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
