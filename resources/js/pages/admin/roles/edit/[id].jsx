import React, { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	const { id } = useParams()

	// Declare states
	const [role, setRole] = useState({})
	const [name, setName] = useState("")
	const [permissionIds, setPermissionIds] = useState([])
	const [permissions, setPermissions] = useState([])
	const [loading, setLoading] = useState()

	const getRole = () => {
		Axios.get(`api/roles/${id}`)
			.then((res) => {
				const roleData = res.data.data
				setRole(roleData)

				// Set the role's existing permission IDs
				const existingPermissionIds = roleData.permissions.map((p) => p.id)
				setPermissionIds(existingPermissionIds)
			})
			.catch((err) => props.getErrors(err))
	}

	useEffect(() => {
		// Set page
		props.setPage({ name: "Edit Role", path: ["roles", "edit"] })

		// Fetch All Available Permissions
		props.get("permissions", setPermissions)

		// Fetch Role Data (this will set the existing permissions)
		getRole()
	}, [])

	// Handle Permission checkboxes
	const handleSetPermissions = (permissionId) => {
		var exists = permissionIds.includes(permissionId)

		var newPermissionIds = exists
			? permissionIds.filter((item) => item != permissionId)
			: [...permissionIds, permissionId]

		setPermissionIds(newPermissionIds)
	}

	// Group permissions by entity (model name)
	const getGroupedPermissions = () => {
		const grouped = {}

		permissions.forEach((permission) => {
			const parts = permission.name.split(" ")
			const action = parts[0] // view, create, update, delete
			const entity = parts.slice(1).join(" ") // rest is the entity name

			if (!grouped[entity]) {
				grouped[entity] = []
			}

			grouped[entity].push({
				id: permission.id,
				name: permission.name,
				action: action,
			})
		})

		return grouped
	}

	// Handle Select All per Entity/Model
	const handleSelectAllForEntity = (isChecked, entityName) => {
		const groupedPermissions = getGroupedPermissions()
		const entityPermissions = groupedPermissions[entityName] || []

		if (isChecked) {
			// Add all entity permissions to permissionIds
			const entityPermissionIds = entityPermissions.map((p) => p.id)
			const newPermissionIds = [
				...new Set([...permissionIds, ...entityPermissionIds]),
			]
			setPermissionIds(newPermissionIds)
		} else {
			// Remove all entity permissions from permissionIds
			const entityPermissionIds = entityPermissions.map((p) => p.id)
			const newPermissionIds = permissionIds.filter(
				(id) => !entityPermissionIds.includes(id)
			)
			setPermissionIds(newPermissionIds)
		}
	}

	// Handle Master Select All
	const handleMasterSelectAll = (isChecked) => {
		if (isChecked) {
			// Select all permissions
			const allPermissionIds = permissions.map((p) => p.id)
			setPermissionIds(allPermissionIds)
		} else {
			// Deselect all permissions
			setPermissionIds([])
		}
	}

	// Check if all permissions for an entity are selected
	const isEntityFullySelected = (entityName) => {
		const groupedPermissions = getGroupedPermissions()
		const entityPermissions = groupedPermissions[entityName] || []
		return (
			entityPermissions.length > 0 &&
			entityPermissions.every((p) => permissionIds.includes(p.id))
		)
	}

	const onSubmit = (e) => {
		e.preventDefault()

		// Show loader for button
		setLoading(true)

		// Send data to UsersController
		Axios.put(`api/roles/${id}`, {
			name: name,
			permissionIds: permissionIds,
		})
			.then((res) => {
				// Remove loader for button
				setLoading(false)
				props.setMessages([res.data.message])
				// Fetch Data
				getRole()
			})
			.catch((err) => {
				// Remove loader for button
				setLoading(false)
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-2"></div>
			<div className="col-sm-8">
				<form onSubmit={onSubmit}>
					<input
						type="text"
						name="name"
						placeholder="Name"
						defaultValue={role.name}
						className="form-control mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
						required={true}
					/>

					{/* Permissions */}
					<div className="form-group mt-4">
						<label
							htmlFor=""
							className="float-start fw-bold ms-1">
							Permissions
						</label>
						<div className="table-responsive hidden-scroll">
							<table className="table">
								<thead>
									<tr>
										<th>
											<label className="form-check">
												<input
													type="checkbox"
													name="masterSelectAll"
													className="form-check-input"
													checked={
														permissions.length > 0 &&
														permissionIds.length === permissions.length
													}
													onChange={(e) =>
														handleMasterSelectAll(e.target.checked)
													}
												/>
											</label>
										</th>
										<th>Entity</th>
										<th
											colspan="4"
											className="text-center">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(getGroupedPermissions()).map(
										([entityName, entityPermissions], key) => (
											<tr key={key}>
												<td>
													<label className="form-check">
														<input
															type="checkbox"
															name="selectAllForEntity"
															className="form-check-input"
															checked={isEntityFullySelected(entityName)}
															onChange={(e) =>
																handleSelectAllForEntity(
																	e.target.checked,
																	entityName
																)
															}
														/>
													</label>
												</td>
												{/* Entity Title */}
												<td>
													<div className="text-capitalize fw-bold">
														{entityName.replace(/_/g, " ")}
													</div>
												</td>
												{/* Entity Title End */}
												{entityPermissions.map((permission) => (
													<td>
														<label
															key={permission.id}
															className="form-check form-check-inline">
															<input
																type="checkbox"
																name="permissions"
																value={permission.id}
																checked={permissionIds.includes(permission.id)}
																onChange={(e) =>
																	handleSetPermissions(parseInt(e.target.value))
																}
																className="form-check-input me-1"
															/>
															<span className="form-check-label text-capitalize">
																{permission.action}
															</span>
														</label>
													</td>
												))}
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
					{/* Permissions End */}

					<div className="d-flex justify-content-end">
						<Btn
							text="edit role"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo="/roles"
							icon={<BackSVG />}
							text="back to roles"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
			<div className="col-sm-2"></div>
		</div>
	)
}

export default edit