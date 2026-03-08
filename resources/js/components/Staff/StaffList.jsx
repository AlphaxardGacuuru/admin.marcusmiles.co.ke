import React, { useState } from "react"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import StaffSVG from "@/svgs/StaffSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import DeleteSVG from "@/svgs/DeleteSVG"

const StaffList = (props) => {
	const [nameQuery, setNameQuery] = useState("")
	const [roleQuery, setRoleQuery] = useState("")

	/*
	 * Delete Staff
	 */
	const onDeleteStaff = (staff) => {
		Axios.delete(`/api/staff/${staff.id}?propertyId=${props.propertyId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setStaff({
					meta: props.staff.meta,
					links: props.staff.links,
					data: props.staff.data.filter((item) => item.id != staff.id),
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
							heading="Total Staff"
							data={props.staff.data?.length}
						/>
						<HeroIcon>
							<StaffSVG />
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
							onChange={(e) => setNameQuery(e.target.value)}
						/>
					</div>
					{/* Name End */}
					{/* Role */}
					<div className="flex-grow-1 me-2 mb-2">
						<select
							id=""
							type="text"
							name="name"
							placeholder="Search by Role"
							className="form-control me-2"
							onChange={(e) => setRoleQuery(e.target.value)}>
							<option value="">All</option>
							{props.roles.map((role, key) => (
								<option
									key={key}
									value={role.name}>
									{role.name}
								</option>
							))}
						</select>
					</div>
					{/* Role End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th colSpan="6"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/staff/${props.propertyId}/create`}
									icon={<PlusSVG />}
									text="add staff"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th></th>
							<th>Name</th>
							<th>Phone</th>
							<th>Role</th>
							<th>Date Joined</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.staff.data?.map((staff, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.staff)}</td>
								<td>
									<Img
										src={staff.avatar}
										className="rounded-circle"
										width="25px"
										height="25px"
										alt="Avatar"
									/>
								</td>
								<td>{staff.name}</td>
								<td>{staff.phone}</td>
								<td>
									{staff.roleNames?.map((role, key) => (
										<span key={key}>
											{key != 0 && <span className="mx-1">|</span>}
											{role}
										</span>
									))}
								</td>
								<td>{staff.createdAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<React.Fragment>
											<MyLink
												linkTo={`/staff/${staff.id}/edit`}
												icon={<EditSVG />}
												className="btn-sm"
											/>

											<div className="mx-1">
												{/* Confirm Delete Modal End */}
												<div
													className="modal fade"
													id={`deleteModalStaff${staff.id}`}
													tabIndex="-1"
													aria-labelledby="deleteModalLabel"
													aria-hidden="true">
													<div className="modal-dialog">
														<div className="modal-content rounded-4">
															<div className="modal-header">
																<h1
																	id="deleteModalLabel"
																	className="modal-title fs-5">
																	Delete {staff.name}
																</h1>
																<button
																	type="button"
																	className="btn-close"
																	data-bs-dismiss="modal"
																	aria-label="Close"></button>
															</div>
															<div className="modal-body text-start text-wrap">
																Are you sure you want to delete {staff.name}.
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
																	onClick={() => onDeleteStaff(staff)}>
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
													data-bs-target={`#deleteModalStaff${staff.id}`}>
													<DeleteSVG />
												</button>
											</div>
										</React.Fragment>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.staff}
					getPaginated={props.getPaginated}
					setState={props.setStaff}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default StaffList
