import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"

import CloseSVG from "@/svgs/CloseSVG"
import PlusSVG from "@/svgs/PlusSVG"

const edit = (props) => {
	const { id } = useParams()

	const [quotation, setQuotation] = useState({
		projectId: "",
		issueDate: new Date().toISOString().split("T")[0],
		expiryDate: new Date().toISOString().split("T")[0],
		notes: "",
		tax: 16,
		items: [{ description: "", quantity: 1, rate: 0, total: 0 }],
		total: 0,
	})

	const [projects, setProjects] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Quotation",
			path: ["crm/quotations", "edit"],
		})

		props.get("projects?idAndName=true", setProjects)

		Axios.get(`/api/quotations/${id}`)
			.then((res) => {
				const data = res.data.data

				setQuotation({
					projectId: data.projectId || "",
					issueDate: data.issueDateFormatted,
					expiryDate: data.expiryDateFormatted,
					notes: data.notes || "",
					tax: data.tax || 16,
					items:
						data.items && data.items.length > 0
							? data.items.map((item) => ({
									...item,
									total: item.total || 0,
								}))
							: [{ description: "", quantity: 1, rate: 0, total: 0 }],
					total: data.total || 0,
					code: data.code || "",
					status: data.status || "",
				})
			})
			.catch((err) => {
				props.getErrors(err)
			})
	}, [])

	// Handle high-level field changes
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setQuotation({ ...quotation, [name]: value })
	}

	// Handle line item changes
	const handleItemChange = (index, e) => {
		const { name, value } = e.target
		const newItems = [...quotation.items]
		newItems[index][name] = value
		newItems[index].total = newItems[index].quantity * newItems[index].rate
		setQuotation({ ...quotation, items: newItems })
	}

	const addItem = (e) => {
		e.preventDefault()
		setQuotation({
			...quotation,
			items: [
				...quotation.items,
				{ description: "", quantity: 1, rate: 0, total: 0 },
			],
		})
	}

	const removeItem = (index, e) => {
		e.preventDefault()
		const newItems = quotation.items.filter((_, i) => i !== index)
		setQuotation({ ...quotation, items: newItems })
	}

	const subtotal = quotation.items.reduce(
		(sum, item) => sum + Number(item.total),
		0
	)

	const taxRate = Number(quotation.tax || 0) / 100
	const taxAmount = subtotal * taxRate
	const grandTotal = subtotal + taxAmount
	const handleSubmit = (e) => {
		e.preventDefault()

		setLoading(true)

		Axios.put(`/api/quotations/${id}`, { ...quotation, total: grandTotal })
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
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
									{/* Project Start */}
									<div className="col-md-6 mb-3">
										<label className="form-label">Project</label>
										<select
											type="text"
											name="projectId"
											className="form-control"
											value={quotation.projectId}
											onChange={handleInputChange}
											required>
											<option value="">Select Project</option>
											{projects.map((project, key) => (
												<option
													key={key}
													value={project.id}>
													{project.name}
												</option>
											))}
										</select>
									</div>
									{/* Project End */}
									{/* Issue Date Start */}
									<div className="col-md-3 mb-3">
										<label className="form-label">Issue Date</label>
										<input
											type="date"
											name="issueDate"
											className="form-control"
											value={quotation.issueDate}
											onChange={handleInputChange}
										/>
									</div>
									{/* Issue Date End */}
									{/* Expirey Date Start */}
									<div className="col-md-3 mb-3">
										<label className="form-label">Expiry Date</label>
										<input
											type="date"
											name="expiryDate"
											className="form-control"
											value={quotation.expiryDate}
											onChange={handleInputChange}
										/>
									</div>
									{/* Expirey Date End */}
								</div>

								{/* Line Items Section */}
								<h5 className="ms-1 mb-2">Scope of Work</h5>
								<div className="table-responsive">
									<table className="table table-bordered">
										<thead className="table-light">
											<tr>
												<th style={{ width: "45%" }}>
													Description (Phase/Task)
												</th>
												<th>Qty</th>
												<th>Unit Price (KES)</th>
												<th>Total (KES)</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{quotation.items.map((item, index) => (
												<tr key={index}>
													<td>
														<input
															type="text"
															name="description"
															className="form-control"
															placeholder="e.g. Schematic Design Phase"
															value={item.description}
															onChange={(e) => handleItemChange(index, e)}
															required
														/>
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
														/>
													</td>
													<td className="align-middle">
														<strong>{item.total.toLocaleString()}</strong>
													</td>
													<td>
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
										text="Add Phase/Item"
										onClick={addItem}
									/>
								</div>

								{/* Summary & Totals */}
								<div className="row justify-content-end">
									<div className="col-md-4">
										<div className="mb-2">
											<label className="form-label mb-1">Tax (%)</label>
											<input
												type="number"
												name="tax"
												className="form-control"
												min="0"
												step="0.01"
												value={quotation.tax}
												onChange={handleInputChange}
											/>
										</div>
										<div className="d-flex justify-content-between mb-2">
											<span>Subtotal:</span>
											<span>KES {subtotal.toLocaleString()}</span>
										</div>
										<div className="d-flex justify-content-between mb-2">
											<span>Tax ({Number(quotation.tax || 0)}%):</span>
											<span>KES {taxAmount.toLocaleString()}</span>
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
										value={quotation.notes}
										placeholder="e.g. 20% deposit required to commence works..."
										onChange={handleInputChange}></textarea>
								</div>

								<div className="d-flex justify-content-end mt-4">
									<Btn
										text="Update Quotation"
										onClick={handleSubmit}
										loading={loading}
									/>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="col-sm-2"></div>
		</div>
	)
}

export default edit
