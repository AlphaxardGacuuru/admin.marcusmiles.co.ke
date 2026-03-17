import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [product, setProduct] = useState({})

	const [name, setName] = useState()
	const [price, setPrice] = useState()
	const [loading, setLoading] = useState()

	// Get Products
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Product",
			path: ["crm/products", "edit"],
		})

		// Fetch Product
		props.get(`products/${id}`, setProduct)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.put(`/api/products/${id}`, {
			name: name,
			price: price,
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
						defaultValue={product.name}
						placeholder="Name"
						className="form-control mb-2"
						onChange={(e) => setName(e.target.value)}
						/>
					{/* Name End */}

					{/* Price */}
					<label htmlFor="price">Price</label>
					<input
						type="number"
						name="price"
						defaultValue={product.price}
						placeholder="Price"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setPrice(e.target.value)}
						required={true}
					/>
					{/* Price End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update product"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center">
						<MyLink
							linkTo={`/crm/products`}
							icon={<BackSVG />}
							text="back to products"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
