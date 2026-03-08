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
	var history = useHistory()

	const [goods, setGoods] = useState([])

	const [goodId, setGoodId] = useState()
	const [price, setPrice] = useState()
	const [loading, setLoading] = useState()

	// Get Goods
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Add Supplier Good",
			path: [
				`erp/suppliers`,
				`erp/suppliers/${id}/view`,
				`erp/suppliers/supplier-goods/${id}/create`,
			],
		})
		// Fetch Goods
		props.get("goods?idAndName=true", setGoods)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/supplier-goods", {
			supplierId: id,
			goodId: goodId,
			price: price,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Goods
				setTimeout(() => history.push(`/admin/erp/suppliers/${id}/view`), 500)
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
					{/* Goods */}
					<label htmlFor="name">Goods</label>
					<select
						name="name"
						placeholder="Goods"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setGoodId(e.target.value)}
						required={true}>
						{[{ id: "", name: "Select Good" }]
							.concat(goods)
							.map((good, key) => (
								<option
									key={key}
									value={good.id}>
									{good.name}
								</option>
							))}
					</select>
					{/* Goods End */}

					{/* Price */}
					<label htmlFor="name">Price</label>
					<input
						type="number"
						name="name"
						placeholder="10,000"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setPrice(e.target.value)}
						required={true}
					/>
					{/* Price End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add supplier good"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/erp/suppliers/${id}/view`}
							icon={<BackSVG />}
							text="back to supplier"
						/>
					</div>
					<div className="col-sm-2"></div>
				</form>
			</div>
		</div>
	)
}

export default create
