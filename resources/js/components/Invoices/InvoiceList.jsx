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
import InvoiceSVG from "@/svgs/InvoiceSVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import BalanceSVG from "@/svgs/BalanceSVG"
import Btn from "@/components/Core/Btn"

const InvoiceList = (props) => {
	const [clients, setClients] = useState([])
	const [projects, setProjects] = useState([])

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		props.get("clients?idAndName=true", setClients)
		props.get("projects?idAndName=true", setProjects)
	}, [])

	/*
	 * Handle DeleteId checkboxes
	 */
	const handleSetDeleteIds = (invoiceId) => {
		var exists = deleteIds.includes(invoiceId)

		var newDeleteIds = exists
			? deleteIds.filter((item) => item != invoiceId)
			: [...deleteIds, invoiceId]

		setDeleteIds(newDeleteIds)
	}

	/*
	 * Delete Invoice
	 */
	const onDeleteInvoice = (invoiceId) => {
		setLoading(true)
		var invoiceIds = Array.isArray(invoiceId) ? invoiceId.join(",") : invoiceId

		Axios.delete(`/api/invoices/${invoiceIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				props.setInvoices({
					meta: props.invoices.meta,
					links: props.invoices.links,
					data: props.invoices.data.filter((invoice) => {
						if (Array.isArray(invoiceId)) {
							return !invoiceIds.includes(invoice.id)
						} else {
							return invoice.id != invoiceId
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
					{/* Total */}
					<div className="d-flex justify-content-between flex-wrap w-100 align-items-center mx-4">
						{/* Due */}
						<HeroHeading
							heading="Due"
							data={
								<span>
									<small>KES</small> {props.invoices.due}
								</span>
							}
						/>
						<HeroIcon>
							<InvoiceSVG />
						</HeroIcon>
						{/* Due End */}
						{/* Paid */}
						<HeroHeading
							heading="Paid"
							data={
								<span>
									<small>KES</small> {props.invoices.paid}
								</span>
							}
						/>
						<HeroIcon>
							<PaymentSVG />
						</HeroIcon>
						{/* Paid End */}
						{/* Balance */}
						<HeroHeading
							heading="Balance"
							data={
								<span>
									<small>KES</small> {props.invoices.balance}
								</span>
							}
						/>
						<HeroIcon>
							<BalanceSVG />
						</HeroIcon>
						{/* Balance End */}
					</div>
				</div>
				{/* Total End */}
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
					{/* Status */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							type="text"
							name="status"
							className="form-control text-capitalize"
							onChange={(e) => setStatus(e.target.value)}
							required={true}>
							<option value="">Filter by Status</option>
							{props.invoices.statuses?.map((status, key) => (
								<option
									key={key}
									value={status}>
									{status
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</option>
							))}
						</select>
					</div>
					{/* Status End */}
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
							<th colSpan="10"></th>
							<th className="text-end">
								<div className="d-flex justify-content-end">
									{deleteIds.length > 0 && (
										<Btn
											text={`delete ${deleteIds.length}`}
											className="me-2"
											onClick={() => onDeleteInvoice(deleteIds)}
											loading={loading}
										/>
									)}

									<MyLink
										linkTo={`/crm/invoices/create`}
										icon={<PlusSVG />}
										text="create invoice"
									/>
								</div>
							</th>
						</tr>
						<tr>
							{/* <th>
								<input
									type="checkbox"
									checked={
										deleteIds.length == props.invoices.data?.length &&
										deleteIds.length != 0
									}
									onClick={() =>
										setDeleteIds(
											deleteIds.length == props.invoices.data.length
												? []
												: props.invoices.data.map((invoice) => invoice.id)
										)
									}
								/>
							</th> */}
							<th>#</th>
							<th>Invoice Code</th>
							<th>Project</th>
							<th>Issue Date</th>
							<th>Due Date</th>
							<th>Total</th>
							<th>Paid</th>
							<th>Balance</th>
							<th>Status</th>
							<th>Created By</th>
							<th className="text-center">Action</th>
						</tr>
						{props.invoices.data?.map((invoice, key) => (
							<tr key={key}>
								{/* <td>
									<input
										type="checkbox"
										checked={deleteIds.includes(invoice.id)}
										onClick={() => handleSetDeleteIds(invoice.id)}
									/>
								</td> */}
								<td>{props.iterator(key, props.invoices)}</td>
								<td>{invoice.code}</td>
								<td>{invoice.projectName}</td>
								<td>{invoice.issueDate}</td>
								<td>{invoice.dueDate}</td>
								<td className="text-success">
									<small>KES</small> {invoice.total}
								</td>
								<td className="text-success">
									<small>KES</small> {invoice.paid}
								</td>
								<td className="text-success">
									<small>KES</small> {invoice.balance}
								</td>
								<td>{invoice.createdByName}</td>
								<td className="text-capitalize">
									<span
										className={`
											${
												invoice.status == "not_paid"
													? "bg-danger-subtle"
													: invoice.status == "partially_paid"
														? "bg-warning-subtle"
														: invoice.status == "paid"
															? "bg-success-subtle"
															: "bg-dark-subtle"
											}
										 py-1 px-3`}>
										{invoice.status
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									</span>
								</td>
								<td>
									<div className="d-flex justify-content-center">
										<div className="d-flex justify-content-center">
											<MyLink
												linkTo={`/crm/invoices/${invoice.id}/view`}
												icon={<ViewSVG />}
												className="me-1"
											/>
											<MyLink
												linkTo={`/crm/invoices/${invoice.id}/edit`}
												icon={<EditSVG />}
												className="me-1"
											/>
										</div>

										<div className="mx-1">
											<DeleteModal
												index={`invoice${key}`}
												model={invoice}
												modelName="Invoice"
												onDelete={onDeleteInvoice}
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
					list={props.invoices}
					getPaginated={props.getPaginated}
					setState={props.setInvoices}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default InvoiceList
