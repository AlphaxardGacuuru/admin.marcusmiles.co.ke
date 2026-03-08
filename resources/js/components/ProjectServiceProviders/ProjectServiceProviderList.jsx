import React, { useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import ServiceProviderSVG from "@/svgs/ServiceProviderSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import DeleteSVG from "@/svgs/DeleteSVG"

const ProjectServiceProviderList = (props) => {
	const location = useLocation()

	/*
	 * Delete ProjectServiceProvider
	 */
	const onDeleteProjectServiceProvider = (projectServiceProvider) => {
		Axios.delete(`/api/project-service-providers/${projectServiceProvider.id}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setProjectServiceProviders({
					meta: props.projectServiceProviders.meta,
					links: props.projectServiceProviders.links,
					data: props.projectServiceProviders.data.filter(
						(item) => item.id != projectServiceProvider.id
					),
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
							heading="Total Service Providers"
							data={props.projectServiceProviders.data?.length}
						/>
						<HeroIcon>
							<ServiceProviderSVG />
						</HeroIcon>
					</div>
					{/* Total End */}
				</div>
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="card shadow-sm p-4">
				<div className="d-flex flex-wrap">
					{/* Name */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							id=""
							type="text"
							name="name"
							placeholder="Search by Name"
							className="form-control"
							onChange={(e) => props.setNameQuery(e.target.value)}
						/>
					</div>
					{/* Name End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th colSpan="8"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/erp/projects/service-providers/${props.projectId}/create`}
									icon={<PlusSVG />}
									text="add service provider"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th></th>
							<th>Name</th>
							<th>Total Amount</th>
							<th>Service</th>
							<th>Status</th>
							<th>Start Date</th>
							<th>End Date</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.projectServiceProviders.data?.map(
							(projectServiceProvider, key) => (
								<tr key={key}>
									<td>{props.iterator(key, props.projectServiceProviders)}</td>
									<td>
										<Img
											src={projectServiceProvider.serviceProviderAvatar}
											className="rounded-circle"
											width="25px"
											height="25px"
											alt="Avatar"
										/>
									</td>
									<td>{projectServiceProvider.serviceProviderName}</td>
									<td>{projectServiceProvider.totalAmount}</td>
									<td>{projectServiceProvider.service}</td>
									<td className="text-capitalize">{projectServiceProvider.status}</td>
									<td>{projectServiceProvider.startDate}</td>
									<td>{projectServiceProvider.endDate}</td>
									<td>
										<div className="d-flex justify-content-center">
											<MyLink
												linkTo={`/erp/projects/service-providers/${projectServiceProvider.id}/edit`}
												icon={<EditSVG />}
												className="btn-sm"
											/>

											<div className="mx-1">
												{/* Confirm Delete Modal End */}
												<div
													className="modal fade"
													id={`deleteModalProjectServiceProvider${projectServiceProvider.id}`}
													tabIndex="-1"
													aria-labelledby="deleteModalLabel"
													aria-hidden="true">
													<div className="modal-dialog">
														<div className="modal-content rounded-4">
															<div className="modal-header">
																<h1
																	id="deleteModalLabel"
																	className="modal-title fs-5">
																	Delete{" "}
																	{projectServiceProvider.serviceProviderName}
																</h1>
																<button
																	type="button"
																	className="btn-close"
																	data-bs-dismiss="modal"
																	aria-label="Close"></button>
															</div>
															<div className="modal-body text-start text-wrap">
																Are you sure you want to delete{" "}
																{projectServiceProvider.serviceProviderName}.
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
																	onClick={() =>
																		onDeleteProjectServiceProvider(
																			projectServiceProvider
																		)
																	}>
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
													data-bs-target={`#deleteModalProjectServiceProvider${projectServiceProvider.id}`}>
													<DeleteSVG />
												</button>
											</div>
										</div>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.projectServiceProviders}
					getPaginated={props.getPaginated}
					setState={props.setProjectServiceProviders}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default ProjectServiceProviderList
