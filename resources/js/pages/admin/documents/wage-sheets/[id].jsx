import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"

import PrintSVG from "@/svgs/PrintSVG"
import CheckSVG from "@/svgs/CheckSVG"
import DownloadSVG from "@/svgs/DownloadSVG"

const form = (props) => {
	var { id } = useParams()

	const [wageSheet, setWageSheet] = useState({})
	const [downloadLoading, setDownloadLoading] = useState(false)

	useEffect(() => {
		// Set page
		props.setPage({ name: "View Wage Sheet", path: ["documents/wage-sheets", "view"] })
		props.get(`wage-sheets/${id}`, setWageSheet)
	}, [])

	/*
	 * Print Wage Sheet
	 */
	const printWageSheet = () => {
		var contentToPrint = document.getElementById("contentToPrint").innerHTML

		document.body.innerHTML = contentToPrint
		// Print
		window.print()
		// Reload
		window.location.reload()
	}

	var totalWages = wageSheet.wageSheetServiceProviders?.reduce(
		(acc, wageSheetServiceProvider) => acc + wageSheetServiceProvider.total,
		0
	)

	const downloadPDF = async () => {
		setDownloadLoading(true)

		try {
			// 1. Add { responseType: 'blob' } so Axios doesn't corrupt the binary data
			const response = await Axios.get(`/api/wage-sheets/${id}/preview`, {
				responseType: "blob",
			})

			// 2. Use response.data (the actual file) instead of the whole response object
			const blob = new Blob([response.data], { type: "application/pdf" })
			const url = window.URL.createObjectURL(blob)

			const link = document.createElement("a")
			link.href = url

			// Ensure the filename is set
			link.setAttribute("download", `WageSheet-${wageSheet.code}.pdf`)

			document.body.appendChild(link)
			link.click()

			// Cleanup
			link.parentNode.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error("PDF Download failed", error)
		}
		setDownloadLoading(false)
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
					loading={downloadLoading}
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
								<h2 className="mb-0">WAGE SHEET</h2>
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
											{wageSheet.code}
										</span>
									</h5>
									<h5>
										Project No:{" "}
										<span className="text-dark fw-normal">
											{wageSheet.projectCode}
										</span>
									</h5>
									<h5>
										Issue Date:{" "}
										<span className="text-dark fw-normal">
											{wageSheet.createdAt}
										</span>
									</h5>
									<h5>
										Week:{" "}
										<span className="text-dark fw-normal">
											{wageSheet.startsAt} - {wageSheet.endsAt}
										</span>
									</h5>
								</div>
								{/* First Header End */}
							</div>

							<hr />

							{/* Second Header Start */}
							<h5 className="mb-1">
								Project:{" "}
								<span className="text-dark fw-normal">
									{wageSheet.projectName}
								</span>
							</h5>
							<h5>
								Client:{" "}
								<span className="text-dark fw-normal">
									{wageSheet.clientName}
								</span>
							</h5>
							{/* Second Header End */}

							<hr />

							<div className="centered-grey-background">
								{/* Table Start */}
								<div className="table-responsive-sm">
									<table className="table bg-white">
										<thead className="border-bottom">
											<tr>
												<th>No</th>
												<th>Name</th>
												<th>Duty</th>
												<th>KES / Hr</th>
												<th>S</th>
												<th>M</th>
												<th>T</th>
												<th>W</th>
												<th>T</th>
												<th>F</th>
												<th>S</th>
												<th>Total (KES)</th>
												<th>Sign</th>
											</tr>
										</thead>
										<tbody>
											{wageSheet.wageSheetServiceProviders?.map(
												(wageSheetServiceProvider, key) => (
													<tr key={key}>
														<td>{key + 1}</td>
														<td>
															{
																wageSheetServiceProvider.projectServiceProviderName
															}
														</td>
														<td>
															{
																wageSheetServiceProvider.projectServiceProviderService
															}
														</td>
														<td>
															{
																wageSheetServiceProvider.projectServiceProviderLabourRate
															}
														</td>
														<td>
															{wageSheetServiceProvider.days.Sunday && (
																<CheckSVG />
															)}
														</td>
														<td>
															{wageSheetServiceProvider.days.Monday && (
																<CheckSVG />
															)}
														</td>
														<td>
															{wageSheetServiceProvider.days.Tuesday && (
																<CheckSVG />
															)}
														</td>
														<td>
															{wageSheetServiceProvider.days.Wednesday && (
																<CheckSVG />
															)}
														</td>
														<td>
															{wageSheetServiceProvider.days.Thursday && (
																<CheckSVG />
															)}
														</td>
														<td>
															{wageSheetServiceProvider.days.Friday && (
																<CheckSVG />
															)}
														</td>
														<td>
															{wageSheetServiceProvider.days.Saturday && (
																<CheckSVG />
															)}
														</td>
														<td>{wageSheetServiceProvider.total}</td>
														<td></td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
						{/* Table End */}

						{/* First Footer Start */}
						<div className="card-footer d-flex justify-content-between bg-white border-0">
							<div className="text-start">
								<h6 className="text-dark mb-1">
									TOTAL LABOR FORCE:{" "}
									<span className="text-dark fw-normal">
										{wageSheet.totalLabourForce}
									</span>
								</h6>
								<h6 className="text-dark mb-1">SUSPENDED LABOR:</h6>
								<h6 className="text-dark mb-1">TERMINATED LABOR:</h6>
								<h6 className="text-dark mb-1">TOTAL EQUIPMENT HIRED:</h6>
								<h6 className="text-dark mb-1">NOTES</h6>
							</div>
							<div className="text-start">
								<h6 className="text-dark mb-1">
									TOTAL WAGES: KES{" "}
									<span className="text-dark fw-normal">{totalWages}</span>
								</h6>
								<h6 className="text-dark mb-1">VALUE OF DAMAGED WORK:</h6>
								<h6 className="text-dark mb-1">
									WAGES PAID: KES{" "}
									<span className="text-dark fw-normal">{totalWages}</span>
								</h6>
								<h6 className="text-dark mb-1">
									TOTAL AMOUNT PAID: KES{" "}
									<span className="text-dark fw-normal">{totalWages}</span>
								</h6>
							</div>
						</div>
						{/* First Footer End */}

						<hr />

						{/* Second Footer Start */}
						<div className="card-footer d-flex justify-content-between bg-white border-0">
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Prepared by:{" "}
									<span className="text-dark fw-normal">
										{wageSheet.createdByName}
									</span>
								</h6>
								<h6 className="text-dark mb-1">
									Paid by:{" "}
									<span className="text-dark fw-normal">
										{wageSheet.paidByName}
									</span>
								</h6>
							</div>
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Approved by:{" "}
									<span className="text-dark fw-normal">
										{wageSheet.approvedByName}
									</span>
								</h6>
							</div>
						</div>
						{/* Second Footer End */}
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default form
