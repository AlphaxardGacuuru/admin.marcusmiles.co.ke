import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"

import PrintSVG from "@/svgs/PrintSVG"

const show = (props) => {
	var { id } = useParams()

	const [quotation, setQuotation] = useState({})

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Quotation",
			path: ["crm/quotations", "view"],
		})
		props.get(`quotations/${id}`, setQuotation)
	}, [])

	/*
	 * Print Quotation
	 */
	const printQuotation = () => {
		var contentToPrint = document.getElementById("contentToPrint").innerHTML

		document.body.innerHTML = contentToPrint
		// Print
		window.print()
		// Reload
		window.location.reload()
	}

	return (
		<React.Fragment>
			{/*Create Link*/}
			<div className="d-flex justify-content-end mb-4">
				<Btn
					className="me-5"
					icon={<PrintSVG />}
					text="print"
					onClick={printQuotation}
				/>
			</div>
			{/*Create Link End*/}

			<div
				id="contentToPrint"
				className="row mb-5">
				<div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
					<div className="card bg-white p-5">
						<div className="border-0 d-flex justify-content-between">
							<div style={{ width: "7em" }}>
								<div
									className="mx-auto"
									style={{ width: "5em" }}>
									<Img
										src="/img/favicon.png"
										style={{ width: "100%", height: "auto" }}
									/>
								</div>
								<h6
									className="text-center"
									style={{ fontSize: "10px" }}>
									RESEARCH. DESIGN & ENG. AUDIT PROJECT MANAGEMENT
								</h6>
							</div>

							<div>
								<h2 className="mb-0 text-end">QUOTATION</h2>
								<div className="text-end fw-bold text-uppercase mt-2">
									Status: {quotation.status}
								</div>
							</div>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between mb-4">
								<div className="">
									<h5 className="mb-1">Client / Project:</h5>
									<h5 className="fw-normal text-dark">
										{quotation.projectName}
									</h5>
								</div>

								{/* First Header Start */}
								<div className="text-end">
									<h5>
										Quotation No:{" "}
										<span className="text-dark fw-normal">
											{quotation.code}
										</span>
									</h5>
									<h5>
										Issue Date:{" "}
										<span className="text-dark fw-normal">
											{quotation.issueDate}
										</span>
									</h5>
									<h5>
										Valid Until:{" "}
										<span className="text-dark fw-normal">
											{quotation.expiryDate}
										</span>
									</h5>
								</div>
							</div>
							{/* First Header End */}

							<hr />

							<div className="centered-grey-background my-4">
								<h5 className="mb-3 px-2">Scope of Work</h5>
								{/* Table Start */}
								<div className="table-responsive-sm">
									<table className="table bg-white border">
										<thead className="table-light">
											<tr>
												<th style={{ width: "50%" }}>
													Description (Phase/Task)
												</th>
												<th className="text-center">Qty</th>
												<th className="text-end">Unit Price (KES)</th>
												<th className="text-end">Total</th>
											</tr>
										</thead>
										<tbody>
											{quotation.items?.map((item, key) => (
												<tr key={key}>
													<td>{item.description}</td>
													<td className="text-center">{item.quantity}</td>
													<td className="text-end">
														{(
															item.rate ||
															item.amount / item.quantity ||
															0
														).toLocaleString()}
													</td>
													<td className="text-end fw-bold">
														{(item.amount || item.total || 0).toLocaleString()}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
							{/* Table End */}

							{/* Totals Section */}
							<div className="row justify-content-end mb-4">
								<div className="col-md-5">
									<table className="table table-borderless">
										<tbody>
											<tr>
												<td className="text-start fs-5">
													<strong>Grand Total:</strong>
												</td>
												<td className="text-end fs-5 text-dark">
													<strong>
														KES {(quotation.total || 0).toLocaleString()}
													</strong>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>

						{/* First Footer Start */}
						<div className="card-footer d-flex justify-content-start bg-white border-0 px-4">
							<div className="text-start w-100">
								<h5 className="text-dark mb-2">Payment Terms & Notes</h5>
								<p
									className="text-dark fw-normal"
									style={{ whiteSpace: "pre-wrap" }}>
									{quotation.notes || "No notes available."}
								</p>

								<div className="mt-5">
									<h6 className="text-dark mb-1">
										Prepared By:{" "}
										<span className="text-dark fw-normal">
											{quotation.createdByName}
										</span>
									</h6>
								</div>
							</div>
						</div>
						{/* First Footer End */}

						<hr className="mt-5" />

						<center>
							<small className="text-muted">
								This is a computer generated document and does not require a
								physical signature.
							</small>
						</center>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default show
