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
	const onDeleteStaff = (id) => {
		Axios.delete(`/api/staff/${id}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setStaff({
					meta: props.staff.meta,
					links: props.staff.links,
					data: props.staff.data.filter((item) => item.id != id),
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
						<label htmlFor="name">Name</label>
						<input
							id=""
							type="text"
							name="name"
							placeholder="Search by Name"
							className="form-control me-2"
							onChange={(e) => props.setNameQuery(e.target.value)}
						/>
					</div>
					{/* Name End */}
					{/* Email */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="email">Email</label>
						<input
							id=""
							type="text"
							name="email"
							placeholder="Search by Email"
							className="form-control me-2"
							onChange={(e) => props.setEmailQuery(e.target.value)}
						/>
					</div>
					{/* Email End */}
					{/* Phone */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="phone">Phone</label>
						<input
							id=""
							type="text"
							name="phone"
							placeholder="Search by Phone"
							className="form-control me-2"
							onChange={(e) => props.setPhoneQuery(e.target.value)}
						/>
					</div>
					{/* Phone End */}
					{/* Gender */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="gender">Gender</label>
						<select
							id=""
							type="text"
							name="gender"
							placeholder="Search by Gender"
							className="form-control me-2"
							onChange={(e) => props.setGenderQuery(e.target.value)}
						>
							<option value="">All</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					{/* Gender End */}
					{/* Role */}
					<div className="flex-grow-1 me-2 mb-2">
						<label htmlFor="role">Role</label>
						<select
							id=""
							type="text"
							name="role"
							placeholder="Search by Role"
							className="form-control me-2"
							onChange={(e) => props.setRoleQuery(e.target.value)}>
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
							<th colSpan="8"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/crm/staff/create`}
									icon={<PlusSVG />}
									text="add staff"
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
							<th>Role</th>
							<th>Date Joined</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					{props.staff.data?.length > 0 ? (
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
									<td>{staff.email}</td>
									<td>{staff.phone}</td>
									<td className="text-capitalize">{staff.gender}</td>
									<td>
										{/* Role Names Start */}
										{staff.roleNames?.map((roleName, key) => (
											<h6
												key={key}
												className="fs-6 d-inline text-wrap me-1">
												{roleName}
												{key < staff.roleNames.length - 1 && ","}
											</h6>
										))}
										{/* Role Names End */}
									</td>
									<td>{staff.createdAt}</td>
									<td>
										<div className="d-flex justify-content-center">
											<React.Fragment>
												<MyLink
													linkTo={`/crm/staff/${staff.id}/edit`}
													icon={<EditSVG />}
													className="btn-sm"
												/>

												<div className="mx-1">
													<DeleteModal
														index={`staff${key}`}
														model={staff}
														modelName="Staff"
														onDelete={onDeleteStaff}
													/>
												</div>
											</React.Fragment>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					) : (
						<tbody>
							<tr>
								<td
									colSpan="10"
									className="p-0">
									<div className="bg-white text-center w-100 py-5">
										<img
											src="/img/no-data-found.jpg"
											alt="No entries found"
											style={{ width: "30%", height: "auto" }}
										/>
									</div>
								</td>
							</tr>
						</tbody>
					)}
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
