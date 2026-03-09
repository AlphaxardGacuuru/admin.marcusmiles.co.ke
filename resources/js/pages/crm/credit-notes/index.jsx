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
import CreditNoteSVG from "@/svgs/CreditNoteSVG"
import BalanceSVG from "@/svgs/BalanceSVG"
import Btn from "@/components/Core/Btn"

const index = (props) => {
	const [creditNotes, setCreditNotes] = useState([])

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
		props.setPage({ name: "Credit Note", path: ["credit-notes"] })
		// Fetch Properties
		props.get(
			`properties/by-user-id/${props.auth.id}?idAndName=true`,
			setProperties
		)
	}, [])

	useEffect(() => {
		// Fetch Credit Note
		props.getPaginated(
			`credit-notes/by-property-id/${props.auth.propertyIds}?
			tenant=${tenant}&
			unit=${unit}&
			propertyId=${propertyId}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setCreditNotes
		)
	}, [tenant, unit, propertyId, startMonth, endMonth, startYear, endYear])

	/*
	 * Delete CreditNote
	 */
	const onDeleteCreditNote = (creditNoteId) => {
		setLoading(true)
		var creditNoteIds = Array.isArray(creditNoteId)
			? creditNoteId.join(",")
			: creditNoteId

		Axios.delete(`/api/credit-notes/${creditNoteIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				setCreditNotes({
					meta: creditNotes.meta,
					links: creditNotes.links,
					data: creditNotes.data.filter((creditNote) => {
						if (Array.isArray(creditNoteId)) {
							return !creditNoteIds.includes(creditNote.id)
						} else {
							return creditNote.id != creditNoteId
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
									<small>KES</small> {creditNotes.sum}
								</span>
							}
						/>
						<HeroIcon>
							<CreditNoteSVG />
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
					{/* Tenant */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							type="text"
							placeholder="Search by Tenant"
							className="form-control"
							onChange={(e) => setTenant(e.target.value)}
						/>
					</div>
					{/* Tenant End */}
					{/* Unit */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							type="text"
							placeholder="Search by Unit"
							className="form-control"
							onChange={(e) => setUnit(e.target.value)}
						/>
					</div>
					{/* Unit End */}
					{/* Properties */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							name="property"
							className="form-control text-capitalize"
							onChange={(e) => setPropertyId(e.target.value)}
							required={true}>
							<option value="">Filter by Property</option>
							{properties.map((property, key) => (
								<option
									key={key}
									value={property.id}>
									{property.name}
								</option>
							))}
						</select>
					</div>
					{/* Properties End */}
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
							<th>#</th>
							<th>Tenant</th>
							<th>Unit</th>
							<th>Invoice No</th>
							<th>Type</th>
							<th>Description</th>
							<th>Amount</th>
							<th className="text-center">Action</th>
						</tr>
						{creditNotes.data?.map((creditNote, key) => (
							<tr key={key}>
								<td>{props.iterator(key, creditNotes)}</td>
								<td>{creditNote.tenantName}</td>
								<td>{creditNote.unitName}</td>
								<td>{creditNote.invoiceId}</td>
								<td className="text-capitalize">
									{creditNote.type
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</td>
								<td>{creditNote.description}</td>
								<td className="text-success">
									<small>KES</small> {creditNote.amount}
								</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/invoices/${creditNote.invoiceId}/show`}
											icon={<ViewSVG />}
											text="view invoice"
											className="me-1"
										/>

										<MyLink
											linkTo={`/credit-notes/${creditNote.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`creditNote${key}`}
												model={creditNote}
												modelName="Credit Note"
												onDelete={onDeleteCreditNote}
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
					list={creditNotes}
					getPaginated={props.getPaginated}
					setState={setCreditNotes}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default index
