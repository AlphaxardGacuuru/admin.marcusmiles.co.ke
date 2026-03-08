import React, { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

const edit = (props) => {
	const router = useHistory()

	var { id } = useParams()

	// Declare states
	const [role, setRole] = useState({})
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [permissions, setPermissions] = useState([])
	const [loading, setLoading] = useState()

	const getRole = () => {
		Axios.get(`api/roles/${id}`)
			.then((res) => {
				setRole(res.data.data)
				setPermissions(res.data.data.permissions)
			})
			.catch((err) => props.getErrors(err))
	}

	useEffect(() => {
		// Set page
		props.setPage({ name: "Edit Role", path: ["roles", "edit"] })
		// Fetch Role
		getRole()
	}, [])

	var entities = [
		"finance",
		"instructors",
		"students",
		"faculties",
		"courses",
		"sessions",
		"chat",
		"staff",
		"roles",
	]

	var CRUD = ["read", "create", "update", "delete"]

	// Handle Permission checkboxes
	const handleSetPermissions = (permission) => {
		var exists = permissions.includes(permission)

		var newPermissions = exists
			? permissions.filter((item) => item != permission)
			: [...permissions, permission]

		setPermissions(newPermissions)
	}

	const onSubmit = (e) => {
		e.preventDefault()

		// Show loader for button
		setLoading(true)

		// Send data to UsersController
		Axios.put(`api/roles/${id}`, {
			name: name,
			description: description,
			permissions: permissions,
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
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
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

					<input
						type="text"
						name="description"
						placeholder="Description"
						defaultValue={role.description}
						className="form-control mb-2 me-2"
						onChange={(e) => setDescription(e.target.value)}
						required={true}
					/>

					{/* Permissions */}
					<div className="form-group">
						<label
							htmlFor=""
							className="ms-1">
							Permissions
						</label>
						<div className="table-responsive hidden-scroll">
							<table className="table">
								<thead>
									<tr>
										<th>Entity</th>
										<th>Read</th>
										<th>Create</th>
										<th>Update</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody>
									{entities.map((entity, key) => (
										<tr key={key}>
											{/* Entity Title */}
											<td className="text-capitalize">
												<b>{entity.replace("_", " ")}</b>
											</td>
											{/* Entity Title End */}
											{CRUD.map((item, key) => (
												<td key={key}>
													<label className="px-3">
														<input
															type="checkbox"
															id=""
															name="entities"
															defaultChecked={role.permissions?.includes(
																`${entity}.${item}`
															)}
															onClick={(e) =>
																handleSetPermissions(`${entity}.${item}`)
															}
														/>
													</label>
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					{/* Permissions End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update role"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo="/roles"
							text="back to role"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
