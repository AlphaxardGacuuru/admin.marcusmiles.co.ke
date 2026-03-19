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

const ServiceProviderList = (props) => {
	const [staff, setStaff] = useState(props.getLocalStorage("staffShortList"))

	/*
	 * Delete ServiceProvider
	 */
	const onDeleteServiceProvider = (serviceProvider) => {
		Axios.delete(`/api/service-providers/${serviceProvider.id}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setServiceProviders({
					meta: props.serviceProviders.meta,
					links: props.serviceProviders.links,
					data: props.serviceProviders.data.filter(
						(item) => item.id != serviceProvider.id
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
							data={props.serviceProviders.data?.length}
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
						<label htmlFor="name">Name</label>
						<input
							id="name"
							type="text"
							name="name"
							placeholder="Search by Name"
							className="form-control"
							onChange={(e) => props.setNameQuery(e.target.value)}
						/>
					</div>
					{/* Name End */}
					{/* Email */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="phone">Email</label>
						<input
							id="phone"
							type="text"
							name="phone"
							placeholder="Search by Email"
							className="form-control"
							onChange={(e) => props.setEmailQuery(e.target.value)}
						/>
					</div>
					{/* Email End */}
					{/* Phone */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="phone">Phone</label>
						<input
							id="phone"
							type="text"
							name="phone"
							placeholder="Search by Phone"
							className="form-control"
							onChange={(e) => props.setPhoneQuery(e.target.value)}
						/>
					</div>
					{/* Phone End */}
					{/* Gender Start */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="gender">Gender</label>
						<select
							id="gender"
							name="gender"
							className="form-control"
							onChange={(e) => props.setGenderQuery(e.target.value)}>
							<option value="">All</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					{/* Gender End */}
					{/* ID Number */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="idNumber">ID Number</label>
						<input
							id="idNumber"
							type="text"
							name="idNumber"
							placeholder="Search by ID Number"
							className="form-control"
							onChange={(e) => props.setIdNumberQuery(e.target.value)}
						/>
					</div>
					{/* ID Number End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th colSpan="7"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/erp/service-providers/create`}
									icon={<PlusSVG />}
									text="add service provider"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th></th>
							<th>Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Gender</th>
							<th>ID Number</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.serviceProviders.data?.map((serviceProvider, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.serviceProviders)}</td>
								<td>
									<Img
										src={serviceProvider.avatar}
										className="rounded-circle"
										width="25px"
										height="25px"
										alt="Avatar"
									/>
								</td>
								<td>{serviceProvider.name}</td>
								<td>{serviceProvider.email}</td>
								<td>{serviceProvider.phone}</td>
								<td className="text-capitalize">{serviceProvider.gender}</td>
								<td>{serviceProvider.idNumber}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/erp/service-providers/${serviceProvider.id}/view`}
											className="me-1"
											icon={<ViewSVG />}
										/>
										{/* View End */}

										{/* Edit Start */}
										<MyLink
											linkTo={`/erp/service-providers/${serviceProvider.id}/edit`}
											icon={<EditSVG />}
											className="btn-sm"
										/>
										{/* Edit End */}

										<div className="mx-1">
											{/* Confirm Delete Modal End */}
											<div
												className="modal fade"
												id={`deleteModalServiceProvider${serviceProvider.id}`}
												tabIndex="-1"
												aria-labelledby="deleteModalLabel"
												aria-hidden="true">
												<div className="modal-dialog">
													<div className="modal-content rounded-4">
														<div className="modal-header">
															<h1
																id="deleteModalLabel"
																className="modal-title fs-5">
																Delete {serviceProvider.name}
															</h1>
															<button
																type="button"
																className="btn-close"
																data-bs-dismiss="modal"
																aria-label="Close"></button>
														</div>
														<div className="modal-body text-start text-wrap">
															Are you sure you want to delete{" "}
															{serviceProvider.name}.
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
																	onDeleteServiceProvider(serviceProvider)
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
												data-bs-target={`#deleteModalServiceProvider${serviceProvider.id}`}>
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
					list={props.serviceProviders}
					getPaginated={props.getPaginated}
					setState={props.setServiceProviders}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default ServiceProviderList
