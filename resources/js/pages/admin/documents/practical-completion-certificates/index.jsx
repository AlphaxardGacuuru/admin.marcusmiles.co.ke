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
	const [practicalCompletionCertificates, setPracticalCompletionCertificates] = useState([])

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
		props.setPage({ name: "Practical Completion Certificates", path: ["practical-completion-certificates"] })
	}, [])

	useEffect(() => {
		// Fetch Practical Completion Certificate
		props.getPaginated(
			`practical-completion-certificates?
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setPracticalCompletionCertificates
		)
	}, [startMonth, endMonth, startYear, endYear])

	/*
	 * Delete PracticalCompletionCertificate
	 */
	const onDeletePracticalCompletionCertificate = (practicalCompletionCertificateId) => {
		setLoading(true)
		var practicalCompletionCertificateIds = Array.isArray(practicalCompletionCertificateId)
			? practicalCompletionCertificateId.join(",")
			: practicalCompletionCertificateId

		Axios.delete(`/api/practical-completion-certificates/${practicalCompletionCertificateIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setPracticalCompletionCertificates({
					meta: practicalCompletionCertificates.meta,
					links: practicalCompletionCertificates.links,
					data: practicalCompletionCertificates.data.filter((practicalCompletionCertificate) => {
						if (Array.isArray(practicalCompletionCertificateId)) {
							return !practicalCompletionCertificateIds.includes(practicalCompletionCertificate.id)
						} else {
							return practicalCompletionCertificate.id != practicalCompletionCertificateId
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
									{practicalCompletionCertificates.meta?.total}
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
										linkTo={`/documents/practical-completion-certificates/create`}
										icon={<PlusSVG />}
										text="create practical completion certificate"
									/>
								</div>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Form No</th>
							<th>Project No</th>
							<th>Employer</th>
							<th>Contractor</th>
							<th>Project Manager</th>
							<th>Brief</th>
							<th>Contract Dates</th>
							<th>Issue Date</th>
							<th className="text-center">Action</th>
						</tr>
						{practicalCompletionCertificates.data?.map(
							(practicalCompletionCertificate, key) => (
								<tr key={key}>
									<td>
										{props.iterator(key, practicalCompletionCertificates)}
									</td>
									<td>{practicalCompletionCertificate.code}</td>
									<td>{practicalCompletionCertificate.projectCode}</td>
									<td>{practicalCompletionCertificate.employer}</td>
									<td>{practicalCompletionCertificate.contractor}</td>
									<td>{practicalCompletionCertificate.projectManager}</td>
									<td>{practicalCompletionCertificate.brief}</td>
									<td>{practicalCompletionCertificate.contractDates}</td>
									<td>{practicalCompletionCertificate.createdAt}</td>
									<td>
										<div className="d-flex justify-content-center">
											<MyLink
												linkTo={`/documents/practical-completion-certificates/${practicalCompletionCertificate.id}/view`}
												icon={<ViewSVG />}
												className="me-1"
											/>

											<MyLink
												linkTo={`/documents/practical-completion-certificates/${practicalCompletionCertificate.id}/edit`}
												icon={<EditSVG />}
											/>

											<div className="mx-1">
												<DeleteModal
													index={`practicalCompletionCertificate${key}`}
													model={practicalCompletionCertificate}
													modelName="Practical Completion Certificate"
													onDelete={onDeletePracticalCompletionCertificate}
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
					list={practicalCompletionCertificates}
					getPaginated={props.getPaginated}
					setState={setPracticalCompletionCertificates}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
