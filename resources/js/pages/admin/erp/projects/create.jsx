import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"
import PlusSVG from "@/svgs/PlusSVG"

const create = (props) => {
	var history = useHistory()

	const [name, setName] = useState()
	const [type, setType] = useState()
	const [description, setDescription] = useState()
	const [location, setLocation] = useState()
	const [clientId, setClientId] = useState()
	const [loading, setLoading] = useState()

	const [clients, setClients] = useState([])

	// Get Projects
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Create Project",
			path: ["erp/projects", "create"],
		})
		// Fetch Clients
		props.get("clients?idAndName=true", setClients)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/projects", {
			name: name,
			type: type,
			description: description,
			location: location,
			clientId: clientId,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])

				// Redirect to Projects
				setTimeout(() => history.push(`/admin/erp/projects`), 500)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-2"></div>
			<div className="col-sm-8">
				<form onSubmit={onSubmit}>
					{/* Name */}
					<label htmlFor="name">Name</label>
					<input
						name="name"
						placeholder="Name"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
						required={true}
					/>
					{/* Name End */}

					{/* Type */}
					<div className="d-flex justify-content-between">
						<label
							htmlFor=""
							className="mt-4">
							Type
						</label>

						{/* Add Type Start */}
						<MyLink
							linkTo={`/configurations`}
							icon={<PlusSVG />}
							text="add type"
						/>
						{/* Add Type End */}
					</div>
					<select
						name="type"
						placeholder="Type"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setType(e.target.value)}
						required={true}>
						{[{ id: "", name: "Select Type" }]
							.concat(props.configuration.projectTypes ?? [])
							?.map((projectType, key) => (
								<option
									key={key}
									value={projectType.id}>
									{projectType.name}
								</option>
							))}
					</select>
					{/* Type End */}

					{/* Description */}
					<label htmlFor="name">Description</label>
					<textarea
						name="description"
						rows="5"
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setDescription(e.target.value)}
						required={true}></textarea>
					{/* Description End */}

					{/* Location Start */}
					<label htmlFor="">Location</label>
					<input
						type="text"
						className="form-control me-2 mb-2"
						onChange={(e) => setLocation(e.target.value)}
						required={true}
					/>
					{/* Location End */}

					{/* Client ID Start */}
					<div className="d-flex justify-content-between">
						<label
							htmlFor=""
							className="mt-4">
							Client
						</label>

						{/* Create Client Start */}
						<MyLink
							linkTo={`/erp/clients/create`}
							icon={<PlusSVG />}
							text="add client"
							className="my-2"
						/>
						{/* Create Client End */}
					</div>
					<select
						className="form-control mb-2"
						onChange={(e) => setClientId(e.target.value)}
						required={true}>
						{[{ id: "", name: "Select Client" }]
							.concat(clients)
							.map((client, key) => (
								<option
									key={key}
									value={client.id}>
									{client.name}
								</option>
							))}
					</select>
					{/* Client ID End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="create project"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/erp/projects`}
							icon={<BackSVG />}
							text="back to projects"
						/>
					</div>
					<div className="col-sm-2"></div>
				</form>
			</div>
		</div>
	)
}

export default create
