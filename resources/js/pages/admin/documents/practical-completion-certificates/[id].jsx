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

	const [practicalCompletionCertificate, setPracticalCompletionCertificate] =
		useState({})

	useEffect(() => {
		// Set page
		props.setPage({
			name: "View Practical Completion Certificate",
			path: ["practical-completion-certificates", "view"],
		})
		props.get(
			`practical-completion-certificates/${id}`,
			setPracticalCompletionCertificate
		)
	}, [])

	/*
	 * Print Practical Completion Certificate
	 */
	const printPracticalCompletionCertificate = () => {
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
					onClick={printPracticalCompletionCertificate}
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

							<div className="w-75">
								<h2 className="text-end mb-0">
									PRACTICAL / SECTIONAL COMPLETION CERTIFICATE
								</h2>
								<div className="p-2 text-center text-capitalize"></div>
							</div>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between mb-4">
								<div className="">
									<h5 className="mb-1"></h5>
								</div>
								<div className="text-end">
									<h5>
										Form No:{" "}
										<span className="text-dark fw-normal">
											{practicalCompletionCertificate.code}
										</span>
									</h5>
									<h5>
										Project No:{" "}
										<span className="text-dark fw-normal">
											{practicalCompletionCertificate.projectCode}
										</span>
									</h5>
									<h5>
										Issue Date:{" "}
										<span className="text-dark fw-normal">
											{practicalCompletionCertificate.createdAt}
										</span>
									</h5>
								</div>
							</div>

							<hr />

							<h5 className="mb-1">
								Employer:{" "}
								<span className="text-dark fw-normal">
									{practicalCompletionCertificate.employer}
								</span>
							</h5>
							<h5>
								Contractor:{" "}
								<span className="text-dark fw-normal">
									{practicalCompletionCertificate.contractor}
								</span>
							</h5>
							<h5>
								Project Manager:{" "}
								<span className="text-dark fw-normal">
									{practicalCompletionCertificate.projectManager}
								</span>
							</h5>
							<h5>
								Contract Dates:{" "}
								<span className="text-dark fw-normal">
									{practicalCompletionCertificate.contractDates}
								</span>
							</h5>
						</div>

						<hr />

						<p>
							Under the terms of the agreement, I/we hereby certify that in
							my/our opinion, the practical completion of the said works has
							been achieved and the contractor has complied with all
							requirements for practical completion on the contract date noted
							above and described below
						</p>

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
									Project Manager
									<div className="text-dark fw-normal">
										{practicalCompletionCertificate.projectManager}
									</div>
								</h6>
							</div>
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Contractor
									<div className="text-dark fw-normal">
										{practicalCompletionCertificate.contractor}
									</div>
								</h6>
							</div>
							<div className="text-start">
								<h6 className="text-dark mb-1">
									Employer
									<div className="text-dark fw-normal">
										{practicalCompletionCertificate.employer}
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
