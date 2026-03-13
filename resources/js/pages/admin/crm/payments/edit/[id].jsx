import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [payment, setPayment] = useState({})

	const [invoices, setInvoices] = useState([])

	const [invoiceId, setInvoiceId] = useState()
	const [amount, setAmount] = useState()
	const [paymentDate, setPaymentDate] = useState()
	const [notes, setNotes] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Payment",
			path: ["crm/payments", "edit"],
		})

		// Fetch Payment
		props.get(`payments/${id}`, setPayment)
		props.get("invoices?idAndName=true", setInvoices)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/payments/${id}`, {
			invoiceId: invoiceId,
			amount: amount,
			paymentDate: paymentDate,
			notes: notes,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Fetch Payment
				props.get(`payments/${id}`, setPayment)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form onSubmit={onSubmit}>
					{/* Invoice Start */}
					<label className="form-label">Invoice</label>
					<select
						type="text"
						name="projectId"
						className="form-control mb-2"
						onChange={(e) => setInvoiceId(e.target.value)}
						required>
						<option value="">Select Invoice</option>
						{invoices.map((invoice, key) => (
							<option
								key={key}
								value={invoice.id}
								selected={invoice.id === payment.invoiceId}>
								{invoice.code}
							</option>
						))}
					</select>
					{/* Invoice End */}

					{/* Amount */}
					<label htmlFor="">Amount</label>
					<input
						type="number"
						min="1"
						placeholder="20000"
						defaultValue={payment.amount}
						className="form-control mb-2"
						onChange={(e) => setAmount(e.target.value)}
					/>
					{/* Amount End */}

					{/* Payment Date */}
					<label htmlFor="">Payment Date</label>
					<input
						type="date"
						className="form-control mb-2"
						value={
							payment.paymentDateFormatted || new Date().toISOString().split("T")[0]
						}
						onChange={(e) => setPaymentDate(e.target.value)}
					/>
					{/* Payment Date End */}

					{/* Notes Start */}
					<label className="form-label">Notes</label>
					<textarea
						name="notes"
						className="form-control mb-4"
						defaultValue={payment.notes}
						rows="3"
						placeholder="e.g. 20% deposit required to commence works..."
						onChange={(e) => setNotes(e.target.value)}></textarea>
					{/* Notes End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update payment"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/crm/payments`}
							icon={<BackSVG />}
							text="back to payments"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
