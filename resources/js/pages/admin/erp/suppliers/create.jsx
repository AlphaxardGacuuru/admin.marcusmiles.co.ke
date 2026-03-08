import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import CloseSVG from "@/svgs/CloseSVG"
import BackSVG from "@/svgs/BackSVG"

const create = (props) => {
	var { id } = useParams()
	var history = useHistory()

	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [phone, setPhone] = useState()
	const [location, setLocation] = useState()
	const [goodIds, setGoodIds] = useState([])
	const [loading, setLoading] = useState()

	const [goods, setGoods] = useState([])

	useEffect(() => {
		// Set page
		props.setPage({ name: "Add Supplier", path: ["suppliers", "create"] })
		// Fetch Goods
		props.get("goods?idAndName=true", setGoods)
	}, [])

	/*
	 * Handle Good selects
	 */
	const handleGoodIds = (id) => {
		if (id) {
			var exists = goodIds.includes(id)

			var newGoodIds = exists
				? goodIds.filter((item) => item != id)
				: [...goodIds, id]

			setGoodIds(newGoodIds)
		}
	}

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/suppliers", {
			name: name,
			email: email,
			phone: phone,
			location: location,
			goodIds: goodIds,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Redirect to Supplier
				setTimeout(() => history.push(`/admin/erp/suppliers`), 500)
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
					{/* Name Start */}
					<label htmlFor="">Name</label>
					<input
						type="text"
						name="name"
						placeholder="John Doe"
						className="form-control mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
						required={true}
					/>
					{/* Name End */}

					{/* Email Start */}
					<label htmlFor="">Email</label>
					<input
						type="text"
						placeholder="johndoe@gmail.com"
						className="form-control mb-2 me-2"
						onChange={(e) => setEmail(e.target.value)}
						required={true}
					/>
					{/* Email End */}

					{/* Phone Start */}
					<label htmlFor="">Phone</label>
					<input
						type="tel"
						placeholder="0722123456"
						className="form-control mb-2 me-2"
						onChange={(e) => setPhone(e.target.value)}
						required={true}
					/>
					{/* Phone End */}

					{/* Location Start */}
					<label htmlFor="">Location</label>
					<input
						type="text"
						placeholder="Nairobi"
						className="form-control mb-2 me-2"
						onChange={(e) => setLocation(e.target.value)}
					/>
					{/* Location End */}

					{/* Goods Start */}
					<label htmlFor="">Goods</label>
					<div className="d-flex">
						<select
							name="goodId"
							className="form-control mb-3 me-2"
							onChange={(e) => handleGoodIds(Number.parseInt(e.target.value))}
							disabled={goodIds.length > 0}>
							<option value="">Select Good</option>
							{goods.map((good, key) => (
								<option
									key={key}
									value={good.id}
									className="text-primary"
									selected={good.id == goodIds[0]}>
									{good.name}
								</option>
							))}
						</select>
						{/* Close Icon */}
						<span
							className="text-primary"
							style={{ cursor: "pointer" }}
							onClick={() => setGoodIds(goodIds.slice(0, 0))}>
							<CloseSVG />
						</span>
						{/* Close Icon End */}
					</div>

					{goodIds.map((input, key1) => (
						<div
							className="d-flex"
							key={key1}>
							<select
								name="goodId"
								className="form-control mb-3 me-2"
								onChange={(e) => handleGoodIds(Number.parseInt(e.target.value))}
								disabled={goodIds.length > key1 + 1}>
								<option value="">Select Good</option>
								{goods.map((good, key2) => (
									<option
										key={key2}
										value={!goodIds.includes(good.id) && good.id}
										className={
											goodIds.includes(good.id)
												? "text-secondary"
												: "text-primary"
										}
										selected={good.id == goodIds[key1 + 1]}>
										{good.name}
									</option>
								))}
							</select>
							{/* Close Icon */}
							<span
								className={
									key1 == goodIds.length - 1
										? "invisible text-primary"
										: "text-primary"
								}
								style={{ cursor: "pointer" }}
								onClick={() =>
									setGoodIds(
										goodIds.filter((goodId, index) => index != key1 + 1)
									)
								}>
								<CloseSVG />
							</span>
							{/* Close Icon End */}
						</div>
					))}
					{/* Goods End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add supplier"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/properties/${id}/show`}
							icon={<BackSVG />}
							text="back to supplier"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default create
