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
	const [siteVisitReports, setSiteVisitReports] = useState([])

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
		props.setPage({ name: "Site Visit Reports", path: ["site-visit-reports"] })
	}, [])

	useEffect(() => {
		// Fetch Site Visit Report
		props.getPaginated(
			`site-visit-reports?
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setSiteVisitReports
		)
	}, [startMonth, endMonth, startYear, endYear])

	/*
	 * Delete SiteVisitReport
	 */
	const onDeleteSiteVisitReport = (siteVisitReportId) => {
		setLoading(true)
		var siteVisitReportIds = Array.isArray(siteVisitReportId)
			? siteVisitReportId.join(",")
			: siteVisitReportId

		Axios.delete(`/api/site-visit-reports/${siteVisitReportIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setSiteVisitReports({
					meta: siteVisitReports.meta,
					links: siteVisitReports.links,
					data: siteVisitReports.data.filter((siteVisitReport) => {
						if (Array.isArray(siteVisitReportId)) {
							return !siteVisitReportIds.includes(siteVisitReport.id)
						} else {
							return siteVisitReport.id != siteVisitReportId
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
									{siteVisitReports.meta?.total}
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
							<th colSpan="7"></th>
							<th className="text-end">
								<div className="d-flex justify-content-end">
									<MyLink
										linkTo={`/documents/site-visit-reports/create`}
										icon={<PlusSVG />}
										text="create site visit report"
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
							<th>Prepared By</th>
							<th>Issue Date</th>
							<th className="text-center">Action</th>
						</tr>
						{siteVisitReports.data?.map(
							(siteVisitReport, key) => (
								<tr key={key}>
									<td>
										{props.iterator(key, siteVisitReports)}
									</td>
									<td>{siteVisitReport.code}</td>
									<td>{siteVisitReport.projectCode}</td>
									<td>{siteVisitReport.clientName}</td>
									<td>{siteVisitReport.approvedByName}</td>
									<td>{siteVisitReport.createdByName}</td>
									<td>{siteVisitReport.createdAt}</td>
									<td>
										<div className="d-flex justify-content-center">
											<MyLink
												linkTo={`/documents/site-visit-reports/${siteVisitReport.id}/view`}
												icon={<ViewSVG />}
												className="me-1"
											/>

											<MyLink
												linkTo={`/documents/site-visit-reports/${siteVisitReport.id}/edit`}
												icon={<EditSVG />}
											/>

											<div className="mx-1">
												<DeleteModal
													index={`siteVisitReport${key}`}
													model={siteVisitReport}
													modelName="Site Visit Report"
													onDelete={onDeleteSiteVisitReport}
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
					list={siteVisitReports}
					getPaginated={props.getPaginated}
					setState={setSiteVisitReports}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
