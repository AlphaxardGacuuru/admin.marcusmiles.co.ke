import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"

import PrintSVG from "@/svgs/PrintSVG"

const show = (props) => {
	var { id } = useParams()

	const [payment, setPayment] = useState({})

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Payment",
			path: ["crm/payments", "view"],
		})
		props.get(`payments/${id}`, setPayment)
	}, [])

	/*
	 * Print Payment
	 */
	const printPayment = () => {
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
					onClick={printPayment}
				/>
			</div>
			{/*Create Link End*/}

			<div
				id="contentToPrint"
				className="row mb-5">
				<div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
					<div className="card bg-white p-5">
						<div className="border-0 d-flex justify-content-between">
							<div className="d-flex">
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
									<h4>MARCUS MILES CONSULT LTD - DESIGN & BUILD</h4>
									<h6>Kilifi House, Lavington</h6>
									<h6>PO BOX 7763-00300</h6>
									<h6>KRA PIN P051650553D Nairobi</h6>
									<h6>Kenya</h6>
									<h6>www.marcusmiles.co.ke</h6>
								</div>
							</div>

							<div>
								<h2 className="mb-0 text-end">PAYMENT</h2>
							</div>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between mb-4">
								<div className="">
									<h5 className="mb-1">Client / Project:</h5>
									<h5 className="fw-normal text-dark">{payment.projectName}</h5>
								</div>

								{/* First Header Start */}
								<div className="text-end">
									<h5>
										Payment No:{" "}
										<span className="text-dark fw-normal">{payment.code}</span>
									</h5>
									<h5>
										Payment Date:{" "}
										<span className="text-dark fw-normal">
											{payment.paymentDate}
										</span>
									</h5>
								</div>
							</div>
							{/* First Header End */}

							<hr />

							<div className="centered-grey-background my-4">
								{/* Table Start */}
								<div className="table-responsive-sm">
									<table className="table bg-white border">
										<thead className="table-light">
											<tr>
												<th style={{ width: "50%" }}>Description</th>
												<th className="text-end">Amount (KES)</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Payment for Invoice {payment.invoiceCode}</td>
												<td className="text-end fw-bold">{payment.amount}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							{/* Table End */}
						</div>

						{/* First Footer Start */}
						<div className="card-footer d-flex justify-content-start bg-white border-0 px-4">
							<div className="text-start w-100">
								<h5 className="text-dark mb-2">Payment Terms & Notes</h5>
								<p
									className="text-dark fw-normal"
									style={{ whiteSpace: "pre-wrap" }}>
									{payment.notes || "No notes available."}
								</p>
							</div>
						</div>
						{/* First Footer End */}
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default show
