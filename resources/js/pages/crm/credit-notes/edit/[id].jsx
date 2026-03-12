import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"

const create = (props) => {
	const { id } = useParams()

	const [creditNote, setCreditNote] = useState({})

	const [invoices, setInvoices] = useState(
		props.getLocalStorage("invoicesShortList")
	)

	const [invoiceId, setInvoiceId] = useState()
	const [amount, setAmount] = useState()
	const [issueDate, setIssueDate] = useState()
	const [notes, setNotes] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Credit Note",
			path: ["crm/credit-notes", "edit"],
		})
		props.get(`credit-notes/${id}`, setCreditNote)
		props.get("invoices?idAndName=true", setInvoices, "invoicesShortList")
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/credit-notes", {
			invoiceId: invoiceId,
			amount: amount,
			issueDate: issueDate,
			notes: notes,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
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
								selected={creditNote.invoiceId == invoice.id}>
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
						defaultValue={creditNote.amount}
						className="form-control mb-2"
						onChange={(e) => setAmount(e.target.value)}
					/>
					{/* Amount End */}

					{/* Issue Date */}
					<label htmlFor="">Issue Date</label>
					<input
						type="date"
						defaultValue={creditNote.issueDateFormatted}
						className="form-control mb-2"
						value={issueDate || new Date().toISOString().split("T")[0]}
						onChange={(e) => setIssueDate(e.target.value)}
					/>
					{/* Issue Date End */}

					{/* Notes Start */}
					<label className="form-label">Notes</label>
					<textarea
						name="notes"
						defaultValue={creditNote.notes}
						className="form-control mb-4"
						rows="3"
						placeholder="e.g. 20% deposit required to commence works..."
						onChange={(e) => setNotes(e.target.value)}></textarea>
					{/* Notes End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add credit note"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/crm/credit-notes`}
							icon={<BackSVG />}
							text="back to credit notes"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default create
