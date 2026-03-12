import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"
import Btn from "@/components/Core/Btn"

import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import CreditNoteSVG from "@/svgs/CreditNoteSVG"
import BalanceSVG from "@/svgs/BalanceSVG"

const CreditNoteList = (props) => {
	const [clients, setClients] = useState([])
	const [projects, setProjects] = useState([])

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		props.get("clients?idAndName=true", setClients)
		props.get("projects?idAndName=true", setProjects)
	}, [])

	/*
	 * Delete Credit Note
	 */
	const onDeleteCreditNote = (creditNoteId) => {
		setLoading(true)
		var creditNoteIds = Array.isArray(creditNoteId) ? creditNoteId.join(",") : creditNoteId

		Axios.delete(`/api/credit-notes/${creditNoteIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				props.setCreditNotes({
					meta: props.creditNotes.meta,
					links: props.creditNotes.links,
					data: props.creditNotes.data.filter((creditNote) => {
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
									<small>KES</small> {props.creditNotes.sum}
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
					{/* Code */}
					<div className="flex-grow-1 me-2 mb-2">
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
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setClientQuery(e.target.value)}
							required={true}>
							<option value="">Filter by Client</option>
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
					{/* Project */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setProjectQuery(e.target.value)}
							required={true}>
							<option value="">Filter by Project</option>
							{projects.map((project, key) => (
								<option
									key={key}
									value={project.id}>
									{project.name}
								</option>
							))}
						</select>
					</div>
					{/* Project End */}
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
							<th colSpan="6"></th>
							<th className="text-end">
								<div className="d-flex justify-content-end">
									{deleteIds.length > 0 && (
										<Btn
											text={`delete ${deleteIds.length}`}
											className="me-2"
											onClick={() => onDeleteCreditNote(deleteIds)}
											loading={loading}
										/>
									)}

									<MyLink
										linkTo={`/crm/credit-notes/create`}
										icon={<PlusSVG />}
										text="create credit note"
									/>
								</div>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Credit Note Code</th>
							<th>Project</th>
							<th>Invoice No</th>
							<th>Amount</th>
							<th>Issue Date</th>
							<th className="text-center">Action</th>
						</tr>
						{props.creditNotes.data?.map((creditNote, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.creditNotes)}</td>
								<td>{creditNote.code}</td>
								<td>{creditNote.projectName}</td>
								<td>{creditNote.invoiceCode}</td>
								<td className="text-success">
									<small>KES</small> {creditNote.amount}
								</td>
								<td>{creditNote.issueDate}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/crm/credit-notes/${creditNote.id}/view`}
											icon={<ViewSVG />}
											className="me-1"
										/>

										<MyLink
											linkTo={`/crm/credit-notes/${creditNote.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`creditNote${key}`}
												model={creditNote}
												modelName="CreditNote"
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
					list={props.creditNotes}
					getPaginated={props.getPaginated}
					setState={props.setCreditNotes}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default CreditNoteList