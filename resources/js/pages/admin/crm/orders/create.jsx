import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"
import CloseSVG from "@/svgs/CloseSVG"
import PlusSVG from "@/svgs/PlusSVG"

const create = (props) => {
	var history = useHistory()

	const [clients, setClients] = useState(
		props.getLocalStorage("clientsShortList")
	)
	const [products, setProducts] = useState(
		props.getLocalStorage("productsShortList")
	)

	const [order, setOrder] = useState({
		clientId: "",
		total: "",
		notes: "",
		items: [{ productId: "", quantity: 1, rate: 0, total: 0 }],
	})
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({ name: "Add Order", path: ["crm/orders", "create"] })
		props.get("clients?idAndName=true", setClients, "clientsShortList")
		props.get("products?idAndName=true", setProducts, "productsShortList")
	}, [])

	// Handle high-level field changes
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setOrder({ ...order, [name]: value })
	}

	// Handle line item changes
	const handleItemChange = (index, e) => {
		const { name, value } = e.target
		const newItems = [...order.items]
		newItems[index][name] = value

		if (name === "productId") {
			const product = products.find((p) => p.id == value)
			newItems[index].rate = product ? product.price || 0 : 0
		}

		newItems[index].total = newItems[index].quantity * newItems[index].rate
		setOrder({ ...order, items: newItems })
	}

	const addItem = (e) => {
		e.preventDefault()
		setOrder({
			...order,
			items: [
				...order.items,
				{ productId: "", quantity: 1, rate: 0, total: 0 },
			],
		})
	}

	const removeItem = (index, e) => {
		e.preventDefault()
		const newItems = order.items.filter((_, i) => i !== index)
		setOrder({ ...order, items: newItems })
	}

	const subtotal = order.items.reduce(
		(sum, item) => sum + Number(item.total),
		0
	)
	const grandTotal = subtotal

	const handleSubmit = (e) => {
		e.preventDefault()

		setLoading(true)

		Axios.post("/api/orders", { ...order, total: grandTotal })
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Redirect to Orders
				history.push("/admin/crm/orders")
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-2"></div>
			<div className="col-sm-8">
				<div className="container">
					<div className="card shadow-sm">
						<div className="card-body">
							<form onSubmit={handleSubmit}>
								{/* Project Header Info */}
								<div className="row mb-3">
									<div className="col-md-12 mb-3">
										{/* Client Start */}
										<label className="form-label">Client</label>
										<select
											type="text"
											name="clientId"
											className="form-control mb-2"
											onChange={(e) => handleInputChange(e)}
											required>
											<option value="">Select Client</option>
											{clients.map((client, key) => (
												<option
													key={key}
													value={client.id}>
													{client.name}
												</option>
											))}
										</select>
										{/* Client End */}
									</div>
								</div>

								{/* Line Items Section */}
								<h5 className="ms-1 mb-2">Items</h5>
								<div className="table-responsive">
									<table className="table table-bordered">
										<thead className="table-light">
											<tr>
												<th style={{ width: "25%" }}>Product</th>
												<th>Qty</th>
												<th>Unit Price (KES)</th>
												<th>Total (KES)</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{order.items.map((item, index) => (
												<tr key={index}>
													<td>
														{/* Products Start */}
														<div className="d-flex">
															<select
																name="productId"
																className="form-control me-2"
																onChange={(e) => handleItemChange(index, e)}>
																<option value="">Select Product</option>
																{products.map((product, key) => (
																	<option
																		key={key}
																		value={product.id}>
																		{product.name}
																	</option>
																))}
															</select>
														</div>
														{/* Products End */}
													</td>
													<td>
														<input
															type="number"
															name="quantity"
															className="form-control"
															value={item.quantity}
															onChange={(e) => handleItemChange(index, e)}
														/>
													</td>
													<td>
														<input
															type="number"
															name="rate"
															className="form-control"
															value={item.rate}
															onChange={(e) => handleItemChange(index, e)}
															disabled={true}
														/>
													</td>
													<td className="align-middle">
														{item.total.toLocaleString()}
													</td>
													<td className="align-middle text-center">
														<Btn
															icon={<CloseSVG />}
															className="mysonar-sm px-2"
															onClick={(e) => removeItem(index, e)}
														/>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div className="d-flex justify-content-end mb-2">
									<Btn
										icon={<PlusSVG />}
										text="Add Item"
										onClick={addItem}
									/>
								</div>

								{/* Summary & Totals */}
								<div className="row justify-content-end">
									<div className="col-md-4">
										<div className="d-flex justify-content-between mb-2">
											<span>Subtotal:</span>
											<span>KES {subtotal.toLocaleString()}</span>
										</div>
										<hr />
										<div className="d-flex justify-content-between h5">
											<strong>Total:</strong>
											<strong>KES {grandTotal.toLocaleString()}</strong>
										</div>
									</div>
								</div>

								<div className="mt-4 border-top pt-3">
									<label className="form-label">Payment Terms & Notes</label>
									<textarea
										name="notes"
										className="form-control"
										rows="3"
										value={order.notes}
										placeholder="e.g. 20% deposit required to commence works..."
										onChange={handleInputChange}></textarea>
								</div>

								<div className="mt-4 text-end">
									<Btn
										text="Create Order"
										onClick={handleSubmit}
										loading={loading}
									/>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="col-sm-2"></div>
			</div>
		</div>
	)
}

export default create
