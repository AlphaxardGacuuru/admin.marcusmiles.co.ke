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
	const [requisitions, setRequisitions] = useState([])

	const [tenant, setTenant] = useState("")
	const [unit, setUnit] = useState("")
	const [propertyId, setPropertyId] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [endYear, setEndYear] = useState("")

	const [properties, setProperties] = useState([])

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Requisitions", path: ["requisitions"] })
	}, [])

	useEffect(() => {
		// Fetch Requisition
		props.getPaginated(
			`requisitions?
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setRequisitions
		)
	}, [startMonth, endMonth, startYear, endYear])

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
									<small>KES</small>{" "}
									{requisitions.meta?.total}
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
								<option value="">Select Month</option>
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
								<option value="">Select Month</option>
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
							<th>Project No</th>
							<th>Client</th>
							<th>Approved By</th>
							<th>Checked By</th>
							<th>Paid By</th>
							<th>Ordered By</th>
							<th>Issue Date</th>
							<th className="text-center">Action</th>
						</tr>
						{requisitions.data?.map(
							(requisition, key) => (
								<tr key={key}>
									<td>
										{props.iterator(key, requisitions)}
									</td>
									<td>{requisition.code}</td>
									<td>{requisition.projectCode}</td>
									<td>{requisition.clientName}</td>
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
							)
						)}
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
