import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"

import PrintSVG from "@/svgs/PrintSVG"
import DownloadSVG from "@/svgs/DownloadSVG"

const form = (props) => {
	var { id } = useParams()

	const [deliveryNote, setDeliveryNote] = useState({})

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Delivery Note",
			path: ["documents/delivery-notes", "view"],
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

	const downloadPDF = async () => {
		try {
			// 1. Add { responseType: 'blob' } so Axios doesn't corrupt the binary data
			const response = await Axios.get(`/api/delivery-notes/${id}/preview`, {
				responseType: "blob",
			})

			// 2. Use response.data (the actual file) instead of the whole response object
			const blob = new Blob([response.data], { type: "application/pdf" })
			const url = window.URL.createObjectURL(blob)

			const link = document.createElement("a")
			link.href = url

			// Ensure the filename is set
			link.setAttribute("download", `DeliveryNote-${deliveryNote.code}.pdf`)

			document.body.appendChild(link)
			link.click()

			// Cleanup
			link.parentNode.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error("PDF Download failed", error)
		}
	}

	return (
		<React.Fragment>
			{/*Download PDF Button*/}
			<div className="d-flex justify-content-end mb-4">
				<Btn
					className="me-5"
					icon={<DownloadSVG />}
					text="Download PDF"
					onClick={downloadPDF}
				/>
			</div>

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
													<td>
														{inventory.unit?.value} {inventory.unit?.unit}
													</td>
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
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default form
