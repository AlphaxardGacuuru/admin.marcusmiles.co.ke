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

	const [statusReport, setStatusReport] = useState({})

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Status Report",
			path: ["status-reports", "view"],
		})
		props.get(`status-reports/${id}`, setStatusReport)
	}, [])

	/*
	 * Print Status Report
	 */
	const printStatusReport = () => {
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
					onClick={printStatusReport}
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
								<h2 className="mb-0">STATUS REPORT</h2>
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
											{statusReport.code}
										</span>
									</h5>
									<h5>
										Project No:{" "}
										<span className="text-dark fw-normal">
											{statusReport.projectCode}
										</span>
									</h5>
									<h5>
										Issue Date:{" "}
										<span className="text-dark fw-normal">
											{statusReport.createdAt}
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
									{statusReport.projectName}
								</span>
							</h5>
							<h5>
								Client:{" "}
								<span className="text-dark fw-normal">
									{statusReport.clientName}
								</span>
							</h5>
							<h5>
								Lead Consultant:{" "}
								<span className="text-dark fw-normal">Marcus Miles LTD</span>
							</h5>
							{/* Second Header End */}

							<hr />

							<h5 className="my-2">Action Items</h5>

							<ul className="ps-5">
								<li>
									<strong>PROJECT PHASE</strong>
									<ul>
										<li>
											<strong>INITIATION:</strong> Identifying project
											objectives, investigate feasibility, and approve a
											solution.
										</li>
										<li>
											<strong>PLANNING:</strong> Design a solution, identify
											tasks & resource requirements, schedule in detailed steps,
											assess budget and risk.
										</li>
										<li>
											<strong>EXECUTION:</strong> Implement plan. Control time,
											quality & budget. Communication & documentation,
											monitoring & adjustments.
										</li>
										<li>
											<strong>CLOSURE:</strong> Release final deliverables,
											terminate contracts. Hand over project to stakeholders.
											Audit & Review.
										</li>
									</ul>
								</li>
							</ul>

							<hr />

							<h4 className="my-2">Action Items</h4>

							<div className="centered-grey-background">
								{/* First Header Start */}
								<div className="table-responsive-sm">
									<table className="table bg-white">
										<thead className="border-bottom">
											<tr>
												<th>No</th>
												<th>Item</th>
												<th>In Charge</th>
												<th>Due Date</th>
												<th>Comment</th>
											</tr>
										</thead>
										<tbody>
											{statusReport.actionItems?.map((actionItem, key) => (
												<tr key={key}>
													<td>{key + 1}</td>
													<td>{actionItem.item}</td>
													<td>{actionItem.inCharge}</td>
													<td>{actionItem.dueDate}</td>
													<td>{actionItem.comments}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
							{/* Table End */}
						</div>

						<hr />

						{/* First Footer Start */}
						<div className="card-footer d-flex justify-content-between bg-white border-0">
							<div className="text-start"></div>
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Prepared by:{" "}
									<span className="text-dark fw-normal">
										{statusReport.createdByName}
									</span>
								</h6>
								<h6 className="text-dark mb-1">
									Approved by:{" "}
									<span className="text-dark fw-normal">
										{statusReport.approvedByName}
									</span>
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
