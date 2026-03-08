import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [good, setGood] = useState({})

	const [name, setName] = useState()
	const [markup, setMarkup] = useState()
	const [notificationQuantity, setNotificationQuantity] = useState()
	const [loading, setLoading] = useState()

	// Get Goods
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Good",
			path: ["goods", "edit"],
		})

		// Fetch Good
		props.get(`goods/${id}`, setGood)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.put(`/api/goods/${id}`, {
			name: name,
			markup: markup,
			notificationQuantity: notificationQuantity,
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
					{/* Name */}
					<input
						type="text"
						defaultValue={good.name}
						placeholder="Name"
						className="form-control mb-2"
						onChange={(e) => setName(e.target.value)}
						/>
					{/* Name End */}

					{/* Mark Up */}
					<label htmlFor="notificationQuantity">Mark Up</label>
					<input
						type="number"
						name="markup"
						defaultValue={good.markup}
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
						defaultValue={good.notificationQuantity}
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setNotificationQuantity(e.target.value)}
						required={true}
					/>
					{/* Notification Quantity End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update good"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center">
						<MyLink
							linkTo={`/erp/goods`}
							icon={<BackSVG />}
							text="back to goods"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
