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
	var history = useHistory()

	const [name, setName] = useState()
	const [markup, setMarkup] = useState()
	const [notificationQuantity, setNotificationQuantity] = useState()
	const [loading, setLoading] = useState()

	// Get Goods
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Add Good",
			path: [`goods`, "create"],
		})
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/goods", {
			name: name,
			markup: markup,
			notificationQuantity: notificationQuantity,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Goods
				setTimeout(() => history.push(`/admin/erp/goods`), 500)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-2"></div>
			<div className="col-sm-8">
				<form onSubmit={onSubmit}>
					{/* Name */}
					<label htmlFor="name">Name</label>
					<input
						name="name"
						placeholder="Name"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
						required={true}
					/>
					{/* Name End */}

					{/* Mark Up */}
					<label htmlFor="notificationQuantity">Mark Up</label>
					<input
						type="number"
						name="markup"
						placeholder="Mark Up"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setMarkup(e.target.value)}
						required={true}
					/>
					{/* Mark Up End */}

					{/* Notification Quantity */}
					<label htmlFor="notificationQuantity">Notification Quantity</label>
					<input
						type="number"
						name="notificationQuantity"
						placeholder="Notification Quantity"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setNotificationQuantity(e.target.value)}
						required={true}
					/>
					{/* Notification Quantity End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add good"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/erp/goods`}
							icon={<BackSVG />}
							text="back to goods"
						/>
					</div>
					<div className="col-sm-2"></div>
				</form>
			</div>
		</div>
	)
}

export default create
