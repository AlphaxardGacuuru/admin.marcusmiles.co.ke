import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import CloseSVG from "@/svgs/CloseSVG"
import PlusSVG from "@/svgs/PlusSVG"

const create = (props) => {
	const history = useHistory()

	const [invoice, setInvoice] = useState({
		projectId: "",
		issueDate: new Date().toISOString().split("T")[0],
		dueDate: new Date().toISOString().split("T")[0],
		notes: "",
		items: [{ description: "", quantity: 1, rate: 0, total: 0 }],
		total: 0,
	})

	const [projects, setProjects] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Create Invoice",
			path: ["crm/invoices", "create"],
		})

		props.get("projects?idAndName=true", setProjects)
	}, [])

	// Handle high-level field changes
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setInvoice({ ...invoice, [name]: value })
	}

	// Handle line item changes
	const handleItemChange = (index, e) => {
		const { name, value } = e.target
		const newItems = [...invoice.items]
		newItems[index][name] = value
		newItems[index].total = newItems[index].quantity * newItems[index].rate
		setInvoice({ ...invoice, items: newItems })
	}

	const addItem = (e) => {
		e.preventDefault()
		setInvoice({
			...invoice,
			items: [
				...invoice.items,
				{ description: "", quantity: 1, rate: 0, total: 0 },
			],
		})
	}

	const removeItem = (index, e) => {
		e.preventDefault()
		const newItems = invoice.items.filter((_, i) => i !== index)
		setInvoice({ ...invoice, items: newItems })
	}

	const subtotal = invoice.items.reduce(
		(sum, item) => sum + Number(item.total),
		0
	)
	const grandTotal = subtotal

	const handleSubmit = (e) => {
		e.preventDefault()

		setLoading(true)

		Axios.post("/api/invoices", { ...invoice, total: grandTotal })
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Redirect to Invoices
				history.push("/admin/crm/invoices")
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
											value={invoice.issueDate}
											onChange={handleInputChange}
										/>
									</div>
									{/* Issue Date End */}
									{/* Expirey Date Start */}
									<div className="col-md-3 mb-3">
										<label className="form-label">Expiry Date</label>
										<input
											type="date"
											name="dueDate"
											className="form-control"
											value={invoice.dueDate}
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
											{invoice.items.map((item, index) => (
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
										placeholder="e.g. 20% deposit required to commence works..."
										onChange={handleInputChange}></textarea>
								</div>

								<div className="d-flex justify-content-end mt-4">
									<Btn
										text="Create Invoice"
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

export default create
