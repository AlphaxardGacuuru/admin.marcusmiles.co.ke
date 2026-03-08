import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"

const edit = (props) => {
	var { id } = useParams()

	const [project, setProject] = useState({})
	const [name, setName] = useState()
	const [type, setType] = useState({})
	const [description, setDescription] = useState()
	const [location, setLocation] = useState()

	const [loading, setLoading] = useState()

	// Get Projects
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Project",
			path: ["erp/projects", "edit"],
		})

		// Fetch Project
		props.get(`projects/${id}`, setProject)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.put(`/api/projects/${id}`, {
			name: name,
			type: type,
			description: description,
			location: location,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form onSubmit={onSubmit}>
					<h5 className="ms-1 mb-2">{project.name}</h5>

					{/* Name */}
					<input
						type="text"
						defaultValue={project.name}
						className="form-control mb-2"
						onChange={(e) => setName(e.target.value)}
					/>
					{/* Name End */}

					{/* Type */}
					<label htmlFor="name">Type</label>
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
									value={projectType.id}
									selected={projectType.id == project.type}>
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
						defaultValue={project.description}
						className="form-control text-capitalize mb-2 me-2"
						onChange={(e) => setDescription(e.target.value)}
						required={true}></textarea>
					{/* Description End */}

					{/* Location Start */}
					<label htmlFor="">Location</label>
					<input
						type="text"
						defaultValue={project.location}
						className="form-control me-2 mb-2"
						onChange={(e) => setLocation(e.target.value)}
						required={true}
					/>
					{/* Location End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update project"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center">
						<MyLink
							linkTo={`/erp/projects`}
							icon={<BackSVG />}
							text="back to projects"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
