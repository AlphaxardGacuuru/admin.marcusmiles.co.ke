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

	const [creditNote, setCreditNote] = useState({})

	const [description, setDescription] = useState()
	const [amount, setAmount] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Credit Note",
			path: ["credit-notes", "edit"],
		})

		// Fetch Credit Note
		props.get(`/credit-notes/${id}`, setCreditNote)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/credit-notes/${id}`, {
			invoiceId: id,
			description: description,
			amount: amount,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Fetch Credit Note
				props.get(`/credit-notes/${id}`, setCreditNote)
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
					{/* Amount */}
					<label htmlFor="">Amount</label>
					<input
						type="number"
						placeholder="20000"
						defaultValue={creditNote.amount?.replace(/,/g, "")}
						className="form-control mb-2"
						onChange={(e) => setAmount(e.target.value)}
						required={true}
					/>
					{/* Amount End */}

					{/* Description */}
					<label htmlFor="">Description</label>
					<textarea
						className="form-control mb-2"
						placeholder="For Damages"
						defaultValue={creditNote.description}
						rows="5"
						onChange={(e) => setDescription(e.target.value)}
						required={true}></textarea>
					{/* Description End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update credit note"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/credit-notes`}
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

export default edit
