import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"

import PlusSVG from "@/svgs/PlusSVG"
import PrintSVG from "@/svgs/PrintSVG"
import CheckSVG from "@/svgs/CheckSVG"

const form = (props) => {
	var { id } = useParams()

	const [siteVisitReport, setSiteVisitReport] = useState({})

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Site Visit Report",
			path: ["site-visit-reports", "view"],
		})
		props.get(`site-visit-reports/${id}`, setSiteVisitReport)
	}, [])

	/*
	 * Print Site Visit Report
	 */
	const printSiteVisitReport = () => {
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
					onClick={printSiteVisitReport}
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
								<h2 className="text-end mb-0">SITE VISIT REPORT</h2>
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
											{siteVisitReport.code}
										</span>
									</h5>
									<h5>
										Project No:{" "}
										<span className="text-dark fw-normal">
											{siteVisitReport.projectCode}
										</span>
									</h5>
									<h5>
										Issue Date:{" "}
										<span className="text-dark fw-normal">
											{siteVisitReport.createdAt}
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
									{siteVisitReport.projectName}
								</span>
							</h5>
							<h5>
								Client:{" "}
								<span className="text-dark fw-normal">
									{siteVisitReport.clientName}
								</span>
							</h5>
						</div>
						{/* Second Header End */}

						<hr />

						<div className="centered-grey-background">
							<div className="my-5 py-5"></div>
							<div className="my-5 py-5"></div>
						</div>

						<hr />

						{/* Footer Start */}
						<div className="card-footer d-flex justify-content-between bg-white border-0">
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Prepared By
									<div className="text-dark fw-normal">
										{siteVisitReport.createdByName}
									</div>
								</h6>
							</div>
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Approved By
									<div className="text-dark fw-normal">
										{siteVisitReport.approvedByName}
									</div>
								</h6>
							</div>
						</div>
						{/* Footer End */}
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default form
