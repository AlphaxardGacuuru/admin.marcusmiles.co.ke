import React, { useState } from "react"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import SupplierSVG from "@/svgs/SupplierSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import DeleteSVG from "@/svgs/DeleteSVG"

const SupplierList = (props) => {
	/*
	 * Delete Supplier
	 */
	const onDeleteSupplier = (supplier) => {
		Axios.delete(`/api/suppliers/${supplier.id}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setSuppliers({
					meta: props.suppliers.meta,
					links: props.suppliers.links,
					data: props.suppliers.data.filter((item) => item.id != supplier.id),
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
							heading="Total Suppliers"
							data={props.suppliers.data?.length}
						/>
						<HeroIcon>
							<SupplierSVG />
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
							<th colSpan="5"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/erp/suppliers/create`}
									icon={<PlusSVG />}
									text="add supplier"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th></th>
							<th>Name</th>
							<th>Phone</th>
							<th>Location</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.suppliers.data?.map((supplier, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.suppliers)}</td>
								<td>
									<Img
										src={supplier.avatar}
										className="rounded-circle"
										width="25px"
										height="25px"
										alt="Avatar"
									/>
								</td>
								<td>{supplier.name}</td>
								<td>{supplier.phone}</td>
								<td>{supplier.location}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/erp/suppliers/${supplier.id}/view`}
											className="me-1"
											icon={<ViewSVG />}
										/>

										<MyLink
											linkTo={`/erp/suppliers/${supplier.id}/edit`}
											icon={<EditSVG />}
											className="btn-sm"
										/>

										<div className="mx-1">
											{/* Confirm Delete Modal End */}
											<div
												className="modal fade"
												id={`deleteModalSupplier${supplier.id}`}
												tabIndex="-1"
												aria-labelledby="deleteModalLabel"
												aria-hidden="true">
												<div className="modal-dialog">
													<div className="modal-content rounded-4">
														<div className="modal-header">
															<h1
																id="deleteModalLabel"
																className="modal-title fs-5">
																Delete {supplier.name}
															</h1>
															<button
																type="button"
																className="btn-close"
																data-bs-dismiss="modal"
																aria-label="Close"></button>
														</div>
														<div className="modal-body text-start text-wrap">
															Are you sure you want to delete {supplier.name}.
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
																onClick={() => onDeleteSupplier(supplier)}>
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
												data-bs-target={`#deleteModalSupplier${supplier.id}`}>
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
					list={props.suppliers}
					getPaginated={props.getPaginated}
					setState={props.setSuppliers}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default SupplierList
