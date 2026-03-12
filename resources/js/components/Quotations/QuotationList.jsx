import React, { useEffect, useState } from "react"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"
import Btn from "@/components/Core/Btn"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import PersonSVG from "@/svgs/PersonSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import DeleteSVG from "@/svgs/DeleteSVG"
import QuotationSVG from "@/svgs/QuotationSVG"

const QuotationList = (props) => {
	const [projects, setProjects] = useState([])

	/*
	 * Delete Quotation
	 */
	const onDeleteQuotation = (quotation) => {
		Axios.delete(`/api/quotations/${quotation.id}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setQuotations({
					meta: props.quotations.meta,
					links: props.quotations.links,
					data: props.quotations.data.filter((item) => item.id != quotation.id),
				})
			})
			.catch((err) => props.getErrors(err))
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between w-100 align-items-center mx-4">
						<HeroHeading
							heading="Total Quotations"
							data={props.quotations.data?.length}
						/>
						<HeroIcon>
							<QuotationSVG />
						</HeroIcon>
					</div>
					{/* Total End */}
				</div>
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="card shadow-sm px-4 pt-4 pb-3 mb-2">
				<div className="d-flex flex-wrap">
					{/* Code */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							type="text"
							placeholder="Search by Code"
							className="form-control"
							onChange={(e) => setCodeQuery(e.target.value)}
						/>
					</div>
					{/* Code End */}
					{/* Project */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							type="text"
							name="type"
							className="form-control text-capitalize"
							onChange={(e) => setProjectQuery(e.target.value)}
							required={true}>
							<option value="">Filter by Project</option>
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
					{/* Status */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							type="text"
							name="status"
							className="form-control text-capitalize"
							onChange={(e) => setStatus(e.target.value)}
							required={true}>
							<option value="">Filter by Status</option>
							{props.quotations.statuses?.map((status, key) => (
								<option
									key={key}
									value={status}>
									{status
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								</option>
							))}
						</select>
					</div>
					{/* Status End */}
				</div>
			</div>

			<br />

			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th colSpan="8"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/crm/quotations/create`}
									icon={<PlusSVG />}
									text="add quotation"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Code</th>
							<th>Project</th>
							<th>Issue Date</th>
							<th>Expiry Date</th>
							<th>Total</th>
							<th>Created By</th>
							<th>Status</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.quotations.data?.map((quotation, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.quotations)}</td>
								<td>{quotation.code}</td>
								<td>{quotation.projectName}</td>
								<td>{quotation.issueDate}</td>
								<td>{quotation.expiryDate}</td>
								<td>{quotation.total}</td>
								<td>{quotation.createdByName}</td>
								<td>{quotation.status}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/crm/quotations/${quotation.id}/view`}
											className="me-1"
											icon={<ViewSVG />}
										/>

										<MyLink
											linkTo={`/crm/quotations/${quotation.id}/edit`}
											icon={<EditSVG />}
											className="btn-sm"
										/>

										<div className="mx-1">
											{/* Confirm Delete Modal End */}
											<div
												className="modal fade"
												id={`deleteModalQuotation${quotation.id}`}
												tabIndex="-1"
												aria-labelledby="deleteModalLabel"
												aria-hidden="true">
												<div className="modal-dialog">
													<div className="modal-content rounded-4">
														<div className="modal-header">
															<h1
																id="deleteModalLabel"
																className="modal-title fs-5">
																Delete {quotation.title}
															</h1>
															<button
																type="button"
																className="btn-close"
																data-bs-dismiss="modal"
																aria-label="Close"></button>
														</div>
														<div className="modal-body text-start text-wrap">
															Are you sure you want to delete {quotation.title}.
														</div>
														<div className="modal-footer justify-content-between">
															<button
																type="button"
																className="mysonar-btn btn-2"
																data-bs-dismiss="modal">
																Close
															</button>
															<button
																type="button"
																className="btn btn-danger rounded-4"
																data-bs-dismiss="modal"
																onClick={() => onDeleteQuotation(quotation)}>
																<span className="me-1">{<DeleteSVG />}</span>
																Delete
															</button>
														</div>
													</div>
												</div>
											</div>
											{/* Confirm Delete Modal End */}

											{/* Button trigger modal */}
											<button
												type="button"
												className="mysonar-btn btn-2"
												data-bs-toggle="modal"
												data-bs-target={`#deleteModalQuotation${quotation.id}`}>
												<DeleteSVG />
											</button>
										</div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.quotations}
					getPaginated={props.getPaginated}
					setState={props.setQuotations}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default QuotationList
