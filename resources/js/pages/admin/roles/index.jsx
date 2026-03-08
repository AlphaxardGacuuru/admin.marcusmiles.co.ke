import React, { useEffect, useState } from "react"

import MyLink from "@/components/Core/MyLink"
import DeleteModal from "@/components/Core/DeleteModal"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import PersonGearSVG from "@/svgs/PersonGearSVG"
import PlusSVG from "@/svgs/PlusSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"

const index = (props) => {
	// Get Role
	const [roles, setRoles] = useState([])

	useEffect(() => {
		// Set page
		props.setPage({ name: "Roles", path: ["role"] })
		props.getPaginated("roles", setRoles)
	}, [])

	/*
	 * Delete
	 */
	const onDeleteRole = (roleId) => {
		Axios.delete(`/api/roles/${roleId}`).then((res) => {
			props.setMessages([res.data.message])
			// Remove row
			setRoles({
				meta: roles.meta,
				links: roles.links,
				data: roles.data.filter((role) => role.id != roleId),
			})
		})
	}
	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Data */}
				<div className="card shadow-sm p-2">
					<div className="d-flex justify-content-between">
						{/* Total */}
						<div className="d-flex justify-content-between w-100 align-items-center mx-4">
							<HeroHeading
								heading="Total Roles"
								data={roles.data?.length}
							/>
							<HeroIcon>
								<PersonGearSVG />
							</HeroIcon>
						</div>
						{/* Total End */}
					</div>
				</div>
				{/* Data End */}

				<br />

				<div className="table-responsive">
					<table className="table table-hover">
						<thead>
							<tr>
								<th colSpan="4"></th>
								<th className="text-end">
									<MyLink
										linkTo={`/roles/create`}
										icon={<PlusSVG />}
										text="add role"
									/>
								</th>
							</tr>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Description</th>
								<th>Permissions</th>
								<th className="text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{roles.data?.map((role, key) => (
								<tr key={key}>
									<td>{key + 1}</td>
									<td>{role.name}</td>
									<td>{role.description}</td>
									<td>
										<div className="d-flex flex-wrap">
											{role.permissions.map((permission, key) => (
												<div
													key={key}
													className="text-secondary p-1">
													| {permission}
												</div>
											))}
										</div>
									</td>
									<td>
										<div className="d-flex justify-content-center">
											<React.Fragment>
												<MyLink
													linkTo={`/roles/${role.id}/show`}
													icon={<ViewSVG />}
													className="btn-sm me-1"
												/>

												<MyLink
													linkTo={`/roles/${role.id}/edit`}
													icon={<EditSVG />}
													className="btn-sm"
												/>

												<div className="mx-1">
													<DeleteModal
														index={key}
														model={role}
														modelName="Role"
														onDelete={onDeleteRole}
													/>
												</div>
											</React.Fragment>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default index
