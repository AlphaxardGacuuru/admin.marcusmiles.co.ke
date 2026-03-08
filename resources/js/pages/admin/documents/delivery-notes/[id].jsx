import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"

import PlusSVG from "@/svgs/PlusSVG"
import PrintSVG from "@/svgs/PrintSVG"

const form = (props) => {
	var { id } = useParams()

	const [deliveryNote, setDeliveryNote] = useState({})

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Delivery Note",
			path: ["delivery-notes", "view"],
		})
		props.get(`delivery-notes/${id}`, setDeliveryNote)
	}, [])

	/*
	 * Print Delivery Note
	 */
	const printDeliveryNote = () => {
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
					onClick={printDeliveryNote}
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
										src="/storage/img/favicon.png"
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
								<h2 className="mb-0">DELIVERY NOTE</h2>
								<div className="p-2 text-center text-capitalize"></div>
							</div>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between mb-4">
								<div className="">
									<h5 className="mb-1"></h5>
								</div>

								{/* First Header Start */}
								<div className="text-end">
									<h5>
										Form No:{" "}
										<span className="text-dark fw-normal">
											{deliveryNote.code}
										</span>
									</h5>
									<h5>
										Project No:{" "}
										<span className="text-dark fw-normal">
											{deliveryNote.projectCode}
										</span>
									</h5>
									<h5>
										Issue Date:{" "}
										<span className="text-dark fw-normal">
											{deliveryNote.createdAt}
										</span>
									</h5>
								</div>
							</div>
							{/* First Header End */}

							<hr />

							{/* Second Header End */}
							<h5>
								Project:{" "}
								<span className="text-dark fw-normal">
									{deliveryNote.projectName}
								</span>
							</h5>
							{/* Second Header End */}

							<hr />

							<div className="centered-grey-background">
								{/* Table Start */}
								<div className="table-responsive-sm">
									<table className="table table-borderless bg-white">
										<thead className="border-bottom">
											<tr>
												<th>No</th>
												<th>BOQ REF</th>
												<th>Item Description</th>
												<th>Unit</th>
												<th>Quantity</th>
												<th>Approval</th>
											</tr>
										</thead>
										<tbody>
											{deliveryNote.inventories?.map((inventory, key) => (
												<tr key={key}>
													<td>{key + 1}</td>
													<td></td>
													<td>{inventory.goodName}</td>
													<td></td>
													<td>{inventory.quantity}</td>
													<td>{inventory.createdByName}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
							{/* Table End */}
						</div>

						{/* First Footer Start */}
						<div className="card-footer d-flex justify-content-start bg-white border-0">
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Delivered By:{" "}
									<span className="text-dark fw-normal">
										{deliveryNote.inventories?.at(0)?.supplierName}
									</span>
								</h6>
								<h6 className="text-dark mb-1">
									Received By:{" "}
									<span className="text-dark fw-normal">
										{deliveryNote.receivedByName}
									</span>{" "}
									<small className="text-muted">(Clerk of Works)</small>
								</h6>
								<h6 className="text-dark mb-1">
									Approved By:{" "}
									<span className="text-dark fw-normal">
										{deliveryNote.createdByName}
									</span>{" "}
									<small className="text-muted">(Construction Manager)</small>
								</h6>
							</div>
						</div>
						{/* First Footer End */}

						<hr />

						<center>
							<small className="text-muted">
								Delivery notes accompany documents being delivered to or
								collected by a client. A copy of this goes with the supplier,
								another copy is retained by the clerk of works and the last copy
								is retained in the booklet.
							</small>
						</center>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default form
