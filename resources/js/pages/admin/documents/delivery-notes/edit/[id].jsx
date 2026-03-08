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

	const [deliveryNote, setDeliveryNote] = useState({})
	const [staff, setStaff] = useState([])

	const [staffId, setStaffId] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Delivery Note",
			path: ["delivery-notes", "edit"],
		})

		// Fetch Delivery Note
		props.get(`/delivery-notes/${id}`, setDeliveryNote)
		// Fetch Staff Note
		props.get(`/staff`, setStaff)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/delivery-notes/${id}`, {
			receivedBy: staffId,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Fetch Delivery Note
				props.get(`/delivery-notes/${id}`, setDeliveryNote)
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
					{/* Received By */}
					<label htmlFor="">Received By</label>
					<select
						className="form-control mb-2"
						onChange={(e) => setStaffId(e.target.value)}>
						{[{ id: "", name: "Select Receiver" }]
							.concat(staff)
							.map((staff, key) => (
								<option
									key={key}
									value={staff.id}
									selected={staff.id == deliveryNote.receivedById}>
									{staff.name}
								</option>
							))}
					</select>
					{/* Received By End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update delivery note"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/documents/delivery-notes`}
							icon={<BackSVG />}
							text="back to delivery notes"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
