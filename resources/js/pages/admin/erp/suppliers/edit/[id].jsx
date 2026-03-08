import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import CloseSVG from "@/svgs/CloseSVG"
import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [supplier, setSupplier] = useState({})

	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [phone, setPhone] = useState()
	const [location, setLocation] = useState()
	const [goodIds, setGoodIds] = useState([])
	const [loading, setLoading] = useState()

	const [goods, setGoods] = useState([])

	useEffect(() => {
		// Set page
		props.setPage({ name: "Edit Supplier", path: ["suppliers", "edit"] })
		// Fetch Supplier
		Axios.get(`api/suppliers/${id}`)
			.then((res) => {
				setSupplier(res.data.data)
				setGoodIds(res.data.data.goodIds)
			})
			.catch((err) => props.getErrors(err))

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
		Axios.put(`/api/suppliers/${id}`, {
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
					<label htmlFor="">Name</label>
					<input
						type="text"
						name="name"
						placeholder="John Doe"
						defaultValue={supplier.name}
						className="form-control mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
					/>

					<label htmlFor="">Email</label>
					<input
						type="text"
						placeholder="johndoe@gmail.com"
						defaultValue={supplier.email}
						className="form-control mb-2 me-2"
						onChange={(e) => setEmail(e.target.value)}
					/>

					<label htmlFor="">Phone</label>
					<input
						type="tel"
						placeholder="0722123456"
						defaultValue={supplier.phone}
						className="form-control mb-2 me-2"
						onChange={(e) => setPhone(e.target.value)}
					/>

					{/* Location Start */}
					<label htmlFor="">Location</label>
					<input
						type="text"
						defaultValue={supplier.location}
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
							text="update supplier"
							loading={loading}
						/>
					</div>

					<center className="mb-5">
						<MyLink
							linkTo={`/erp/suppliers`}
							icon={<BackSVG />}
							text="back to suppliers"
						/>
					</center>

					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
