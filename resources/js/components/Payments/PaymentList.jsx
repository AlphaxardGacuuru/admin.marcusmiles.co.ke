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
import PaymentSVG from "@/svgs/PaymentSVG"
import BalanceSVG from "@/svgs/BalanceSVG"

const PaymentList = (props) => {
	const [clients, setClients] = useState([])
	const [projects, setProjects] = useState([])

	const [deleteIds, setDeleteIds] = useState([])
	const [loading, setLoading] = useState()

	useEffect(() => {
		props.get("clients?idAndName=true", setClients)
		props.get("projects?idAndName=true", setProjects)
	}, [])

	/*
	 * Delete Payment
	 */
	const onDeletePayment = (paymentId) => {
		setLoading(true)
		var paymentIds = Array.isArray(paymentId) ? paymentId.join(",") : paymentId

		Axios.delete(`/api/payments/${paymentIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Remove row
				props.setPayments({
					meta: props.payments.meta,
					links: props.payments.links,
					data: props.payments.data.filter((payment) => {
						if (Array.isArray(paymentId)) {
							return !paymentIds.includes(payment.id)
						} else {
							return payment.id != paymentId
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
									<small>KES</small> {props.payments.sum}
								</span>
							}
						/>
						<HeroIcon>
							<PaymentSVG />
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
											onClick={() => onDeletePayment(deleteIds)}
											loading={loading}
										/>
									)}

									<MyLink
										linkTo={`/crm/payments/create`}
										icon={<PlusSVG />}
										text="create payment"
									/>
								</div>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Payment Code</th>
							<th>Project</th>
							<th>Invoice No</th>
							<th>Amount</th>
							<th>Payment Date</th>
							<th className="text-center">Action</th>
						</tr>
						{props.payments.data?.map((payment, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.payments)}</td>
								<td>{payment.code}</td>
								<td>{payment.projectName}</td>
								<td>{payment.invoiceCode}</td>
								<td className="text-success">
									<small>KES</small> {payment.amount}
								</td>
								<td>{payment.paymentDate}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/crm/payments/${payment.id}/view`}
											icon={<ViewSVG />}
											className="me-1"
										/>

										<MyLink
											linkTo={`/crm/payments/${payment.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`payment${key}`}
												model={payment}
												modelName="Payment"
												onDelete={onDeletePayment}
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
					list={props.payments}
					getPaginated={props.getPaginated}
					setState={props.setPayments}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}
		</div>
	)
}

export default PaymentList
