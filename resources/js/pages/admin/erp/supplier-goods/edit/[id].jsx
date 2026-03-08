import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [supplierGood, setSupplierGood] = useState({})

	const [price, setPrice] = useState()
	const [loading, setLoading] = useState()

	// Get Supplier Good
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Supplier Good",
			path: [`erp/suppliers`, `erp/suppliers/supplier-goods/${id}/edit`],
		})

		// Fetch Good
		Axios.get(`api/supplier-goods/${id}`)
			.then((res) => {
				setSupplierGood(res.data.data)

				// Set page
				props.setPage({
					name: "Edit Supplier Good",
					path: [
						`erp/suppliers`,
						`erp/suppliers/${res.data.data.goodId}/view`,
						`erp/suppliers/supplier-goods/${id}/edit`,
					],
				})
			})
			.catch((err) => props.setErrors(["Failed to Fetch Supplier Good"]))
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.put(`/api/supplier-goods/${id}`, {
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
					{/* Price */}
					<label htmlFor="name">Price</label>
					<input
						type="number"
						name="name"
						placeholder="10,000"
						defaultValue={supplierGood.currentPrice}
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setPrice(e.target.value)}
						required={true}
					/>
					{/* Price End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update supplier good"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center">
						<MyLink
							linkTo={`/erp/suppliers/${supplierGood.supplierId}/view`}
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

export default edit
